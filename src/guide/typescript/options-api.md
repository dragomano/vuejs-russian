# TypeScript с Options API {#typescript-with-options-api}

> Предполагается, что вы уже прочитали главу [Использование Vue с TypeScript](./overview).

:::tip Совет
Хотя Vue поддерживает использование TypeScript с помощью Options API, рекомендуется использовать Vue с TypeScript через API Composition, так как он предлагает более простой, эффективный и надежный вывод типов.
:::

## Типизация пропсов компонента {#typing-component-props}

Вывод типа для пропсов в Options API требует обёртывания компонента с помощью `defineComponent()`. С его помощью Vue может определять типы пропсов на основе свойства `props`, принимая во внимание дополнительные параметры, такие как `require: true` и `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // вывод типа включен
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // тип: string | undefined
    this.id // тип: number | string | undefined
    this.msg // тип: string
    this.metadata // тип: any
  }
})
```

Однако параметры `props` во время выполнения поддерживают только использование функций конструктора в качестве типа параметра — нет возможности указать сложные типы, такие как объекты с вложенными свойствами или сигнатуры вызовов функций.

Для аннотирования сложных типов пропсов мы можем использовать служебный тип `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // предоставляем более конкретный тип для `Object`.
      type: Object as PropType<Book>,
      required: true
    },
    // таким же образом аннотируем функции
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // Ошибка TS: аргумент типа 'string' не является
    // соответствующим параметру типа 'number'
    this.callback?.('123')
  }
})
```

### Оговорки {#caveats}

Если ваша версия TypeScript меньше, чем `4.7`, вы должны быть осторожны при использовании значений функций для опций `validator` и `default` — обязательно используйте стрелочные функции:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Если версия вашего TypeScript меньше 4.7, обязательно используйте стрелочные функции
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Это избавляет TypeScript от необходимости выводить тип `this` внутри этих функций, что, к сожалению, может привести к неудачному выводу типа. Это было предыдущее [ограничение дизайна](https://github.com/microsoft/TypeScript/issues/38845), а теперь улучшено в [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Типизация событий компонента {#typing-component-emits}

Мы можем объявить ожидаемый тип полезной нагрузки для испускаемого события, используя объектный синтаксис свойства `emits`. Кроме того, все необъявленные эмиттируемые события при вызове будут выдавать ошибку типа:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // проверка во время выполнения
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Ошибка типа!
      })

      this.$emit('non-declared-event') // Ошибка типа!
    }
  }
})
```

## Типизация вычисляемых свойств {#typing-computed-properties}

Вычисляемое свойство определяет свой тип на основе возвращаемого значения:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Привет!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // тип: string
  }
})
```

В некоторых случаях вам может понадобиться явно указать тип вычисляемого свойства, чтобы убедиться в правильности его реализации:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Привет!'
    }
  },
  computed: {
    // явно аннотируем возвращаемый тип
    greeting(): string {
      return this.message + '!'
    },

    // аннотирование вычисляемого свойства, доступного для записи
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Явные аннотации также могут потребоваться в некоторых крайних случаях, когда TypeScript не может определить тип вычисляемого свойства из-за зацикленного вывода.

## Типизация обработчиков событий {#typing-event-handlers}

При работе с собственными событиями DOM может оказаться полезным правильно вводить аргумент, который мы передаем обработчику. Давайте рассмотрим этот пример:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `Событие` неявно имеет тип `any` (`любой`)
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Без аннотации типа аргумент `event` будет неявно иметь тип `any`. Это также приведет к ошибке TS, если `"strict": true"` или `"noImplicitAny": true` используются в файле `tsconfig.json`. Поэтому рекомендуется явно аннотировать аргументы обработчиков событий. Кроме того, вам может понадобиться использовать утверждения типов при обращении к свойствам `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Расширение глобальных свойств {#augmenting-global-properties}

Некоторые плагины устанавливают глобально доступные свойства для всех экземпляров компонента через [`app.config.globalProperties`](/api/application#app-config-globalproperties). Например, мы можем установить `this.$http` для получения данных или `this.$translate` для интернационализации. Чтобы всё это хорошо сочеталось с TypeScript, Vue предоставляет интерфейс `ComponentCustomProperties`, предназначенный для дополнения с помощью [расширения модулей TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

См. также:

- [Модульные тесты TypeScript для расширений типов компонентов](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### Размещение расширения типа {#type-augmentation-placement}

Мы можем поместить это расширение типа в файл `.ts` или в общий для проекта файл `*.d.ts`. В любом случае убедитесь, что он включен в `tsconfig.json`. Для авторов библиотек/плагинов этот файл должен быть указан в свойстве `types` в файле `package.json`.

Чтобы воспользоваться преимуществами расширения модуля, вам нужно убедиться, что расширение помещено в [модуль TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html). То есть файл должен содержать хотя бы один верхнеуровневый `import` или `export`, даже если это просто `export {}`. Если дополнение размещено вне модуля, оно перезапишет исходные типы, а не дополнит их!

```ts
// Не работает, перезаписывает исходные типы.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Работает правильно
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Расширение пользовательских опций {#augmenting-custom-options}

Некоторые плагины, например `vue-router`, обеспечивают поддержку пользовательских опций компонента, таких как `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Без надлежащего дополнения типов аргументы этого хука будут неявно иметь тип `any`. Мы можем дополнить интерфейс `ComponentCustomOptions` для поддержки этих пользовательских опций:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Теперь опция `beforeRouteEnter` будет набрана правильно. Обратите внимание, что это всего лишь пример — хорошо типизированные библиотеки, такие как `vue-router`, должны автоматически выполнять эти дополнения в своих собственных определениях типов.

На размещение этого дополнения распространяются [те же ограничения](#type-augmentation-placement), что и на дополнения глобальных свойств.

См. также:

- [Модульные тесты TypeScript для расширений типов компонентов](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

## Типизация глобальных пользовательских директив {#typing-global-custom-directives}

См.: [Типизация глобальных пользовательских директив](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />