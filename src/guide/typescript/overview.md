---
outline: deep
---

# Использование Vue с TypeScript {#using-vue-with-typescript}

Такая система типов, как TypeScript, может обнаружить множество распространённых ошибок с помощью статического анализа во время сборки. Это снижает вероятность возникновения ошибок во время выполнения в производстве, а также позволяет более уверенно рефакторить код в масштабных приложениях. TypeScript также улучшает эргономику разработчика благодаря автодополнению типов в IDE.

Vue написан на TypeScript и обеспечивает первоклассную поддержку TypeScript. Все официальные пакеты Vue поставляются с декларациями типов, которые должны работать «из коробки».

## Настройка проекта {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), официальный инструмент для создания проектов, предлагает возможности для создания проекта Vue на базе [Vite](https://vitejs.dev/) с поддержкой TypeScript.

### Обзор {#overview}

При установке на основе Vite сервер разработки и пакетный модуль выполняют только транспиляцию и не выполняют проверку типов. Благодаря этому сервер разработки Vite остается молниеносно быстрым даже при использовании TypeScript.

- Во время разработки мы рекомендуем полагаться на хорошую [настройку IDE](#ide-support) для мгновенной обратной связи с ошибками типа.

- При использовании SFC используйте утилиту [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) для проверки типов в командной строке и генерации объявлений типов. `vue-tsc` — это обёртка для `tsc`, собственного интерфейса командной строки TypeScript. Работает в основном так же, как и `tsc`, за исключением того, что поддерживает Vue SFC в дополнение к файлам TypeScript. Вы можете запустить `vue-tsc` в режиме watch параллельно с сервером разработки Vite, или использовать плагин Vite, например [vite-plugin-checker](https://vite-plugin-checker.netlify.app/), который запускает проверки в отдельном рабочем потоке.

- Vue CLI также обеспечивает поддержку TypeScript, но больше не рекомендуется. Смотрите [примечания ниже](#note-on-vue-cli-and-ts-loader).

### Поддержка IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code) настоятельно рекомендуется благодаря отличной встроенной поддержке TypeScript.

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (ранее — Volar) — официальное расширение VS Code, обеспечивающее поддержку TypeScript в SFC Vue, а также множество других замечательных возможностей.

    :::tip Совет
    Расширение _Vue - Official_ заменяет [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), наше предыдущее официальное расширение VS Code для Vue 2. Если у вас установлен Vetur, не забудьте отключить его в проектах Vue 3.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) также обеспечивает встроенную поддержку TypeScript и Vue. Другие IDE от JetBrains тоже поддерживают их, либо из коробки, либо с помощью [бесплатного плагина](https://plugins.jetbrains.com/plugin/9442-vue-js). Начиная с версии 2023.2, WebStorm и плагин Vue Plugin поставляются со встроенной поддержкой Vue Language Server. Вы можете настроить службу Vue на использование интеграции Volar для всех версий TypeScript в разделе Settings > Languages & Frameworks > TypeScript > Vue. По умолчанию Volar будет использоваться для TypeScript версий 5.0 и выше.

### Настройка `tsconfig.json` {#configuring-tsconfig-json}

Проекты, созданные с помощью `create-vue`, включают в себя предварительно настроенный `tsconfig.json`. Базовый конфиг абстрагирован в пакете [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Внутри проекта мы используем [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html), чтобы обеспечить правильные типы для кода, работающего в разных средах (например, код приложения и тестовый код должны иметь разные глобальные переменные).

Если настраивать `tsconfig.json` вручную, можно воспользоваться следующими примечательными опциями:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) имеет значение `true`, поскольку Vite использует [esbuild](https://esbuild.github.io/) для транспиляции TypeScript и подвержен ограничениям на транспиляцию одного файла. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) является [надмножеством `isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) и тоже является хорошим выбором — именно его использует [`@vue/tsconfig`](https://github.com/vuejs/tsconfig).

- Если вы используете Options API, вам необходимо установить [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) в `true` (или, по крайней мере, включить [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), который является частью флага `strict`), чтобы задействовать проверку типа `this` в опциях компонента. В противном случае `this` будет рассматриваться как `any`.

- Если вы настроили псевдонимы резольвера в вашем инструменте сборки, например псевдоним `@/*`, настроенный по умолчанию в проекте `create-vue`, вам нужно также настроить его для TypeScript через [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

См. также:

- [Официальная документация по опциям компилятора TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Предостережения по компиляции TypeScript в esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Примечание о Vue CLI и `ts-loader`. {#note-on-vue-cli-and-ts-loader}

В системах на основе webpack, таких как Vue CLI, принято выполнять проверку типов как часть конвейера преобразования модулей, например, с помощью `ts-loader`. Однако это не совсем верное решение, поскольку для проверки типов системе типов необходимо знать весь граф модуля. Шаг преобразования отдельного модуля просто не подходит для этой задачи. Это приводит к следующим проблемам:

- `ts-loader` может проверять только посттрансформационный код. Это не совпадает с ошибками, которые мы видим в IDE или в `vue-tsc`, которые отображаются непосредственно в исходном коде.

- Проверка типов может быть медленной. Когда она выполняется в одном потоке/процессе с преобразованиями кода, это существенно влияет на скорость сборки всего приложения.

- У нас уже есть проверка типов, выполняемая прямо в IDE в отдельном процессе, так что стоимость замедления работы разработчика просто не является хорошим компромиссом.

Если вы в настоящее время используете Vue 3 + TypeScript через Vue CLI, мы настоятельно рекомендуем перейти на Vite. Мы также работаем над параметрами CLI, чтобы включить поддержку TS только для транспилирования, чтобы вы могли переключиться на `vue-tsc` для проверки типов.

## Общие замечания по использованию {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Чтобы TypeScript мог правильно выводить типы в опциях компонентов, нам нужно определить компоненты с помощью [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // включение вывода типа
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // тип: string | undefined
    this.msg // тип: string
    this.count // тип: number
  }
})
```

`defineComponent()` также поддерживает вывод параметров, переданных в `setup()`, при использовании Composition API без `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // включение вывода типа
  props: {
    message: String
  },
  setup(props) {
    props.message // тип: string | undefined
  }
})
```

См. также:

- [Заметка о webpack Treeshaking](/api/general#note-on-webpack-treeshaking)
- [Тесты типов для `defineComponent`](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip Примечание
`defineComponent()` также позволяет определять тип компонентов, определённых на обычном JavaScript.
:::

### Использование в однофайловых компонентах {#usage-in-single-file-components}

Чтобы использовать TypeScript в SFC, добавьте атрибут `lang="ts"` к тегам `<script>`. Когда присутствует `lang="ts"`, все шаблонные выражения также имеют более строгую проверку типов.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- включена проверка типа и автозавершение -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` также можно использовать с `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript включен
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- включена проверка типа и автозавершение -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript в шаблонах {#typescript-in-templates}

Шаблон `<template>` также поддерживает TypeScript в выражениях привязки, когда используется `<script lang="ts">` или `<script setup lang="ts">`. Это полезно в тех случаях, когда необходимо выполнить приведение типов в шаблонных выражениях.

Вот надуманный пример:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- ошибка, потому что x может быть строкой -->
  {{ x.toFixed(2) }}
</template>
```

Это можно обойти с помощью приведения строчного типа:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip Примечание
При использовании Vue CLI или установки на основе webpack, TypeScript в выражениях шаблонов требует `vue-loader@^16.8.0`.
:::

### Использование с TSX

Vue также поддерживает авторские компоненты с JSX/TSX. Подробности описаны в руководстве [Рендер-функции и JSX](/guide/extras/render-function.html#jsx-tsx).

## Универсальные компоненты {#generic-components}

Универсальные компоненты поддерживаются в двух случаях:

- В однофайловых компонентах: [`<script setup>` с атрибутом `generic`](/api/sfc-script-setup.html#generics)
- Рендер-функция / компоненты JSX: [Сигнатура функции `defineComponent()`](/api/general.html#function-signature)

## Рецепты, специфичные для API {#api-specific-recipes}

- [TS с Composition API](./composition-api)
- [TS с Options API](./options-api)
