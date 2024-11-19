# Composition API: setup() {#composition-api-setup}

## Пример использования {#basic-usage}

Хук `setup()` служит точкой входа для использования Composition API в компонентах в следующих случаях:

1. Использование Composition API без этапа сборки;
2. Интеграция с кодом на основе Composition-API в компоненте Options API.

:::info Примечание
Если вы используете Composition API с однофайловыми компонентами, настоятельно рекомендуется использовать [`<script setup>`](/api/sfc-script-setup) для более лаконичного и эргономичного синтаксиса.
:::

Мы можем объявить реактивное состояние с помощью [API-интерфейсов реактивности](./reactivity-core) и предоставить их шаблону, вернув объект из `setup()`. Свойства возвращаемого объекта также будут доступны в экземпляре компонента (если используются другие параметры):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // предоставляем доступ шаблонам и другим опциям API-хуков
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

[refs](/api/reactivity-core#ref), возвращаемые из `setup`, [автоматически неглубоко разворачиваются](/guide/essentials/reactivity-fundamentals#deep-reactivity) при доступе в шаблоне, поэтому вам не нужно использовать `.value` при доступе к ним. Они также разворачиваются таким же образом при доступе через `this`.

`setup()` сам по себе не имеет доступа к экземпляру компонента — `this` будет иметь значение `undefined` внутри `setup()`. Можно получить доступ к значениям, предоставляемым Composition API, из Options API, но не наоборот.

`setup()` должен возвращать объект _синхронно_. Единственный случай, когда можно использовать `async setup()`, — это когда компонент является потомком компонента [Suspense](../guide/built-ins/suspense).

## Доступ к пропсам {#accessing-props}

Первым аргументом в функции `setup` является аргумент `props`. Как и полагается в стандартном компоненте, `props` внутри функции `setup` являются реактивными и будут обновляться при передаче новых параметров.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Обратите внимание, что если вы деструктурируете объект `props`, то деструктурированные переменные потеряют реактивность. Поэтому рекомендуется всегда обращаться к параметрам в виде `props.xxx`.

Если вам действительно нужно деструктурировать параметры или передать параметр во внешнюю функцию, сохранив при этом реактивность, вы можете сделать это с помощью API-утилит [toRefs()](./reactivity-utilities#torefs) и [toRef()](/api/reactivity-utilities#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // превращаем `props` в объект refs, затем деструктурируем
    const { title } = toRefs(props)
    // `title` — ссылка, которая отслеживает `props.title`
    console.log(title.value)

    // ИЛИ, превращаем одно свойство `props` в ссылку
    const title = toRef(props, 'title')
  }
}
```

## Настройка контекста {#setup-context}

Вторым аргументом, передаваемым функции `setup`, является объект **context**. Объект контекста раскрывает другие значения, которые могут быть полезны в `setup`:

```js
export default {
  setup(props, context) {
    // Атрибуты (нереактивный объект, эквивалентный $attrs)
    console.log(context.attrs)

    // Слоты (нереактивный объект, эквивалентный $slots)
    console.log(context.slots)

    // Emit-события (функция, эквивалентная $emit)
    console.log(context.emit)

    // Раскрытие публичных свойств (функция)
    console.log(context.expose)
  }
}
```

Контекстный объект не является реактивным и может быть безопасно разрушен:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` и `slots` — это объекты с состоянием, которые всегда обновляются при обновлении самого компонента. Это означает, что вам следует избегать их деструктуризации и всегда ссылаться на свойства как на `attrs.x` или `slots.x`. Также обратите внимание, что, в отличие от `props`, свойства `attrs` и `slots` **не** реактивны. Если вы собираетесь применять побочные эффекты на основе изменений в `attrs` или `slots`, вам следует сделать это внутри хука жизненного цикла `onBeforeUpdate`.

### Раскрытие публичных свойств {#exposing-public-properties}

`expose` - это функция, которая может быть использована для явного ограничения свойств, раскрываемых при обращении к экземпляру компонента со стороны родительского компонента через [ссылки на элементы шаблона](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // делаем экземпляр "закрытым" -
    // т. е. не открываем ничего родителям
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // выборочно раскрываем локальное состояние
    expose({ count: publicCount })
  }
}
```

## Использование с рендер-функциями {#usage-with-render-functions}

`setup` также может возвращать [рендер-функцию](/guide/extras/render-function), которая может напрямую использовать реактивное состояние, объявленное в той же области видимости:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Возвращение рендер-функции не позволяет нам вернуть что-либо ещё. Внутренне это не должно быть проблемой, но это может быть проблематично, если мы хотим передать методы этого компонента родительскому компоненту через ссылки на элементы шаблона.

Мы можем решить эту проблему, вызвав [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

Тогда метод `increment` будет доступен в родительском компоненте через реактивную ссылку.
