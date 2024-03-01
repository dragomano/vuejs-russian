# Типы утилит {#utility-types}

:::info Информация
На этой странице перечислены лишь некоторые часто используемые типы утилит, применение которых может потребовать пояснений. Полный список экспортируемых типов можно найти в [исходном коде](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131).
:::

## PropType\<T> {#proptype-t}

Используется для аннотирования параметра более сложными типами при использовании деклараций параметров во время выполнения.

- **Пример**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // обеспечивают более конкретный тип `Object`
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **Смотрите также** [Руководство - Типизация параметров компонента](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

Псевдоним для `T | Ref<T>`. Полезно для аннотирования аргументов [композаблов](/guide/reusability/composables.html).

- Поддерживается только в 3.3+.

## MaybeRefOrGetter\<T> {#maybereforgetter}

Псевдоним для `T | Ref<T> | (() => T)`. Полезно для аннотирования аргументов [композаблов](/guide/reusability/composables.html).

- Поддерживается только в 3.3+.

## ExtractPropTypes\<T> {#extractproptypes}

Извлечение типов параметров из объекта `props`. Извлекаемые типы имеют внутреннюю ориентацию — т. е. разрешенные параметры, полученные компонентом. Это означает, что булевые параметры и параметры со значениями по умолчанию всегда определяются, даже если они не требуются.

Для извлечения публичных параметров, т. е. параметров, которые разрешено передавать родителю, используйте [`ExtractPublicPropTypes`](#extractpublicproptypes).

- **Пример**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

Извлечение типов параметров из объекта `props`. Извлечённые типы являются публичными — т. е. параметрами, которые разрешено передавать родителю.

- **Пример**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

Используется для дополнения типа экземпляра компонента для поддержки пользовательских глобальных свойств.

- **Пример**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip Совет
  Дополнения должны быть помещены в файл модуля `.ts` или `.d.ts`. Подробнее см. в главе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **Смотрите также** [Руководство - Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

Используется для дополнения типа опций компонента для поддержки пользовательских опций.

- **Пример**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip Совет
  Дополнения должны быть помещены в файл модуля `.ts` или `.d.ts`. Подробнее см. в главе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

- **Смотрите также** [Руководство - Расширение пользовательских опций](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

Используется для дополнения разрешённых параметров TSX, чтобы использовать недекларированные параметры на элементах TSX.

- **Пример**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // теперь работает, даже если hello не является объявленным параметров
  <MyComponent hello="world" />
  ```

  :::tip Совет
  Дополнения должны быть помещены в файл модуля `.ts` или `.d.ts`. Подробнее см. в главе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
  :::

## CSSProperties {#cssproperties}

Используется для дополнения допустимых значений в привязках свойств стиля.

- **Пример**

  Разрешаем любое пользовательское свойство CSS

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip Совет
Дополнения должны быть помещены в файл модуля `.ts` или `.d.ts`. Подробнее см. в главе [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties).
:::

:::info Смотрите также
Теги SFC `<style>` поддерживают привязку значений CSS к динамическому состоянию компонента с помощью CSS-функции `v-bind`. Это позволяет создавать пользовательские свойства без расширения типа.

- [v-bind() в CSS](/api/sfc-css-features#v-bind-in-css)
  :::
