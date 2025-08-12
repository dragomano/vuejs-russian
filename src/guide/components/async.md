# Асинхронные компоненты {#async-components}

## Пример использования {#basic-usage}

В больших приложениях нам может понадобиться разделить приложение на более мелкие фрагменты и загружать компонент с сервера только тогда, когда он необходим. Чтобы сделать это возможным, во Vue есть функция [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...загрузка компонента с сервера
    resolve(/* загружаемый компонент */)
  })
})
// ... используем `AsyncComp` как обычный компонент
```

Как видите, `defineAsyncComponent` принимает функцию-загрузчик, которая возвращает Promise. Обратный вызов Promise `resolve` должен быть вызван, когда вы получили определение компонента с сервера. Вы также можете вызвать `reject(reason)`, чтобы указать, что загрузка не удалась.

[Динамический импорт модулей ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) также возвращает Promise, поэтому чаще всего мы будем использовать его в сочетании с `defineAsyncComponent`. Такие сборщики, как Vite и webpack, также поддерживают этот синтаксис (и будут использовать его в качестве точек разделения сборки), поэтому мы можем использовать его для импорта Vue SFC:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

Получившийся `AsyncComp` — это компонент-обёртка, который вызывает функцию загрузчика только тогда, когда он действительно отображается на странице. Кроме того, он будет передавать все параметры и слоты внутреннему компоненту, так что вы можете использовать асинхронную обёртку для плавной замены исходного компонента, обеспечивая при этом ленивую загрузку.

Как и обычные компоненты, асинхронные компоненты могут быть [зарегистрированы глобально](/guide/components/registration#global-registration) с помощью `app.component()`:

```js
app.component(
  'MyComponent',
  defineAsyncComponent(() => import('./components/MyComponent.vue'))
)
```

<div class="options-api">

Вы также можете использовать `defineAsyncComponent` при [локальной регистрации компонента](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Они также могут быть определены непосредственно внутри родительского компонента:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Состояния загрузки и ошибки {#loading-and-error-states}

Асинхронные операции неизбежно влекут за собой состояния загрузки и ошибки — `defineAsyncComponent()` поддерживает обработку этих состояний с помощью дополнительных опций:

```js
const AsyncComp = defineAsyncComponent({
  // функция-загрузчик
  loader: () => import('./Foo.vue'),

  // Компонент, который будет использоваться во время загрузки асинхронного компонента
  loadingComponent: LoadingComponent,
  // Задержка перед показом компонента загрузки. По умолчанию: 200 мс.
  delay: 200,

  // Компонент, который будет использоваться в случае сбоя загрузки
  errorComponent: ErrorComponent,
  // Компонент ошибки будет отображен, если тайм-аут указан и превышен. По умолчанию: Infinity.
  timeout: 3000
})
```

Если предоставлен загрузочный компонент, он будет отображаться первым, пока загружается внутренний компонент. По умолчанию существует задержка в 200 мс перед отображением компонента загрузки — это связано с тем, что в быстрых сетях состояние мгновенной загрузки может сменяться слишком быстро и в итоге выглядеть как мерцание.

Если указан компонент ошибки, он будет отображаться, когда Promise, возвращённый функцией загрузчика, будет отклонён. Вы также можете указать тайм-аут для отображения компонента ошибки, если запрос выполняется слишком долго.

## Ленивая гидратация <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Этот раздел применим только при использовании [рендеринга на стороне сервера](/guide/scaling-up/ssr).

В Vue 3.5+ асинхронные компоненты могут контролировать время гидратации, предоставляя стратегию гидратации.

- Vue предоставляет несколько встроенных стратегий гидратации. Эти встроенные стратегии необходимо импортировать по отдельности, чтобы их можно было вытеснить из дерева, если они не используются.

- Дизайн намеренно низкоуровневый для обеспечения гибкости. Синтаксический сахар компилятора потенциально может быть построен на основе этого в будущем либо в ядре, либо в решениях более высокого уровня (например, в Nuxt).

### Гидратация при простое {#hydrate-on-idle}

Запускается через `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate:
    hydrateOnIdle(/* опциональная передача максимального тайм-аута */)
})
```

### Гидратация на видимом элементе {#hydrate-on-visible}

Запускается, когда элементы становятся видимыми через `IntersectionObserver`:

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

В качестве опции можно передать объект с настройками для наблюдателя:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Гидратация при медиазапросе {#hydrate-on-media-query}

Запускается при совпадении указанного медиазапроса:

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Гидратация при взаимодействии {#hydrate-on-interaction}

Запускается при наступлении указанных событий на элементах компонента. Событие, вызвавшее гидратацию, также будет воспроизведено после завершения гидратации:

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Список событий можно передать в виде массива:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Индивидуальная стратегия {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement - это помощник для перебора всех корневых элементов
  // в негидратированном DOM компонента, поскольку корневой элемент может быть фрагментом
  // вместо одного элемента
  forEachElement((el) => {
    // ...
  })
  // вызываем `hydrate` при готовности
  hydrate()
  return () => {
    // при необходимости возвращаем функцию разрушения
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Использование с Suspense {#using-with-suspense}

Асинхронные компоненты можно использовать со встроенным компонентом `<Suspense>`. Взаимодействие между `<Suspense>` и асинхронными компонентами описано в главе [`<Suspense>`](/guide/built-ins/suspense).
