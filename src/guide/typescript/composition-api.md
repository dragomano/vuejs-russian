# TypeScript с Composition API {#typescript-with-composition-api}

<ScrimbaLink href="https://scrimba.com/links/vue-ts-composition-api" title="Бесплатный урок по TypeScript с Composition API в Vue.js" type="scrimba">
  Посмотрите интерактивный видео-урок на Scrimba
</ScrimbaLink>

> Предполагается, что вы уже прочитали главу [Использование Vue с TypeScript](./overview).

## Типизация пропсов компонента {#typing-component-props}

### Использование `<script setup>` {#using-script-setup}

При использовании `<script setup>` макрос `defineProps()` поддерживает вывод типов пропсов на основе аргумента:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Это называется «объявлением во время выполнения», потому что аргумент, переданный в `defineProps()`, будет использоваться в качестве свойства `props` во время выполнения.

Однако обычно проще определить проп с чистыми типами через аргумент общего тиа:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Это называется «объявлением на основе типов». Компилятор постарается сделать всё возможное, чтобы вывести эквивалентные пропсы времени выполнения на основе типа аргумента. В этом случае наш второй пример компилируется в точно такие же пропсы времени выполнения, как и первый.

Вы можете использовать либо объявление на основе типов, либо объявление во время выполнения, но вы не можете использовать оба варианта одновременно.

Мы также можем вынести типы пропсов в отдельный интерфейс:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

Это также работает, если `Props` импортируется из внешнего источника. Эта функция требует, чтобы TypeScript был зависимым от Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Ограничения синтаксиса {#syntax-limitations}

В версии 3.2 и ниже параметр общего типа для `defineProps()` был ограничен литералом типа или ссылкой на локальный интерфейс.

Это ограничение было устранено в версии 3.3. Последняя версия Vue поддерживает ссылки на импортируемые и ограниченный набор сложных типов в позиции параметра типа. Однако, поскольку преобразование типов к времени выполнения всё ещё основано на AST, некоторые сложные типы, требующие фактического анализа типов, например условные типы, не поддерживаются. Вы можете использовать условные типы для типа отдельного параметра, но не всего объекта параметров.

### Значения по умолчанию для пропсов {#props-default-values}

При использовании объявления на основе типов мы теряем возможность объявлять значения по умолчанию для пропсов. Это можно решить с помощью макроса компилятора `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'привет',
  labels: () => ['раз', 'два']
})
```

Это будет скомпилировано в эквивалентные опции параметра `default`. Кроме того, помощник `withDefaults` обеспечивает проверку типов для значений по умолчанию и гарантирует, что в возвращаемом типе `props` будут удалены необязательные флаги для свойств, у которых объявлены значения по умолчанию.

:::info Примечание
Обратите внимание, что значения по умолчанию для изменяемых ссылочных типов (например, массивов или объектов) должны быть обёрнуты в функции, чтобы избежать случайного изменения и внешних побочных эффектов. Это гарантирует, что каждый экземпляр компонента получит свою собственную копию значения по умолчанию.
:::

### Без `<script setup>` {#without-script-setup}

Если не используется `<script setup>`, необходимо использовать `defineComponent()`, чтобы включить вывод типа параметра. Тип объекта props, переданного в `setup()`, выводится из свойства `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- тип: string
  }
})
```

### Сложные типы пропсов {#complex-prop-types}

При объявлении на основе типов проп может использовать сложный тип так же, как и любой другой тип:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Для объявления во время выполнения мы можем использовать служебный тип `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Это работает точно так же, как если бы мы указывали опцию `props` напрямую:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

Свойство `props` чаще всего используется с Options API, поэтому более подробные примеры вы найдете в руководстве [TypeScript с Options API](/guide/typescript/options-api#typing-component-props). Приёмы, показанные в этих примерах, также применимы к объявлениям во время выполнения с помощью `defineProps()`.

## Типизация событий компонента {#typing-component-emits}

В `<script setup>` функция `emit` также может быть типизирована с помощью объявления во время выполнения, либо объявления типа:

```vue
<script setup lang="ts">
// runtime
const emit = defineEmits(['change', 'update'])

// на основе options
const emit = defineEmits({
  change: (id: number) => {
    // возвращает `true` или `false` для указания
    // валидация прошла либо нет
  },
  update: (value: string) => {
    // возвращает `true` или `false` для указания
    // валидация прошла либо нет
  }
})

// на основе типов
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: альтернативный, более лаконичный синтаксис
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Тип аргумента может быть одним из следующих:

1. Вызываемый тип функции, но записанный как литерал типа с [сигнатурами вызова](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Он будет использоваться в качестве типа возвращаемой функции `emit`.
2. Литерал типа, ключами которого являются имена событий, а значениями — типы массивов/кортежей, представляющие дополнительные принятые параметры для события. В приведённом выше примере используются именованные кортежи, поэтому каждый аргумент может иметь явное имя.

Как мы видим, объявление типов дает нам гораздо более тонкий контроль над ограничениями типов испускаемых событий.

Если не используется `<script setup>`, `defineComponent()` может определить разрешённые события для функции `emit`, выставленной на контекст `setup`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- проверка типа / автозаполнение
  }
})
```

## Типизация `ref()` {#typing-ref}

Ссылки выводят тип из начального значения:

```ts
import { ref } from 'vue'

// предполагаемый тип: Ref<number>
const year = ref(2020)

// => Ошибка TS: Тип 'string' не может быть присвоен типу 'number'.
year.value = '2020'
```

Иногда нам может понадобиться указать сложные типы для внутреннего значения ссылки. Для этого мы можем использовать тип `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Или передав общий аргумент при вызове `ref()`, чтобы отменить вывод по умолчанию:

```ts
// результирующий тип: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Если вы укажете аргумент общего типа, но опустите начальное значение, то результирующим типом будет объединённый тип, включающий `undefined`:

```ts
// предполагаемый тип: Ref<number | undefined>
const n = ref<number>()
```

## Типизация `reactive()` {#typing-reactive}

`reactive()` также неявно выводит тип из своего аргумента:

```ts
import { reactive } from 'vue'

// предполагаемый тип: { title: string }
const book = reactive({ title: 'Руководство по Vue 3' })
```

Чтобы явно ввести свойство `reactive`, мы можем использовать интерфейсы:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Руководство по Vue 3' })
```

:::tip Совет
Не рекомендуется использовать общий аргумент `reactive()`, поскольку возвращаемый тип, который обрабатывает разворачивание вложенных ссылок, отличается от общего типа аргумента.
:::

## Типизация `computed()` {#typing-computed}

`computed()` определяет свой тип на основе возвращаемого значения геттера:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// предполагаемый тип: ComputedRef<number>
const double = computed(() => count.value * 2)

// => Ошибка TS: Свойство 'split' не существует для типа 'number'
const result = double.value.split('')
```

Вы также можете указать явный тип через общий аргумент:

```ts
const double = computed<number>(() => {
  // Ошибка типа, если возвращается не число
})
```

## Типизация обработчиков событий {#typing-event-handlers}

При работе с собственными событиями DOM может оказаться полезным правильно вводить аргумент, который мы передаем обработчику. Давайте рассмотрим этот пример:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `Событие` неявно имеет тип `любой`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Без аннотации типа аргумент `event` будет неявно иметь тип `any`. Это также приведет к ошибке TS, если `"strict": true"` или `"noImplicitAny": true` используются в файле `tsconfig.json`. Поэтому рекомендуется явно аннотировать аргументы обработчиков событий. Кроме того, вам может понадобиться использовать утверждения типов при обращении к свойствам `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Типизация Provide / Inject {#typing-provide-inject}

Обеспечение и инъекция обычно выполняются в отдельных компонентах. Чтобы правильно типизировать инжектируемые значения, Vue предоставляет интерфейс `InjectionKey`, который представляет собой общий тип, расширяющий `Symbol`. Он может использоваться для синхронизации типа вводимого значения между поставщиком и потребителем:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // Предоставление нестрокового значения приведет к ошибке

const foo = inject(key) // тип foo: string | undefined
```

Рекомендуется поместить ключ инъекции в отдельный файл, чтобы его можно было импортировать в несколько компонентов.

При использовании строковых ключей инъекции тип инжектируемого значения будет `неизвестен` и должен быть явно объявлен через аргумент общего типа:

```ts
const foo = inject<string>('foo') // тип: string | undefined
```

Обратите внимание, что вводимое значение всё ещё может быть `неопределённым`, поскольку нет гарантии, что провайдер предоставит это значение во время выполнения.

Тип `undefined` может быть удален путём предоставления значения по умолчанию:

```ts
const foo = inject<string>('foo', 'bar') // тип: string
```

Если вы уверены, что значение всегда будет предоставлено, вы также можете принудительно привести значение:

```ts
const foo = inject('foo') as string
```

## Типизация ссылок на элементы в шаблоне {#typing-template-refs}

В Vue 3.5 и `@vue/language-tools` 2.1 (обеспечивающем работу языкового сервиса IDE и `vue-tsc`) тип ссылок, созданных с помощью `useTemplateRef()` в SFC, может быть **автоматически выведен** для статических ссылок на основе того, в каком элементе используется соответствующий атрибут `ref`.

В случаях, когда автоматический вывод невозможен, вы всё равно можете привести шаблонную ссылку к явному типу через общий аргумент:

```ts
const el = useTemplateRef<HTMLInputElement>('el')
```

<details>
<summary>Использование до версии 3.5</summary>

Рефы должны создаваться с явным аргументом общего типа и начальным значением `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

Чтобы получить правильный интерфейс DOM, вы можете посмотреть страницы вроде [MDN](https://developer.mozilla.org/ru/docs/Web/HTML/Element/input).

Обратите внимание, что для обеспечения строгой безопасности типов при обращении к `el.value` необходимо использовать опциональную цепочку или защиту типов. Это связано с тем, что начальное значение ref имеет значение `null` до тех пор, пока компонент не будет смонтирован, а также может быть установлено в значение `null`, если элемент, на который ссылается ссылка, будет размонтирован с помощью `v-if`.

## Типизация ссылок на компоненты {#typing-component-template-refs}

В Vue 3.5 и `@vue/language-tools` 2.1 (обеспечивающем работу языкового сервиса IDE и `vue-tsc`), тип ссылок, созданных с помощью `useTemplateRef()` в SFC, может быть **автоматически выведен** для статических ссылок на основе того, в каком элементе или компоненте используется соответствующий атрибут `ref`.

В случаях, когда автоматический вывод невозможен (например, использование не-SFC или динамических компонентов), вы всё равно можете привести ссылку на шаблон к явному типу с помощью универсального аргумента.

Чтобы получить тип экземпляра импортируемого компонента, нам нужно сначала получить его тип через typeof, а затем использовать встроенную в TypeScript утилиту InstanceType для извлечения типа экземпляра:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

В случаях, когда точный тип компонента недоступен или не важен, вместо него можно использовать `ComponentPublicInstance`. Это будет включать только те свойства, которые являются общими для всех компонентов, например `$el`:

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance>('child')
```

Бывают случаи, когда компонент, на который ссылаются, является [универсальным](/guide/typescript/overview.html#generic-components). Например, `MyGenericModal`:

```vue
<!-- MyGenericModal.vue -->
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

На такие компоненты нужно ссылаться с помощью `ComponentExposed` из библиотеки [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers), так как `InstanceType` не будет работать.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal = useTemplateRef<ComponentExposed<typeof MyGenericModal>>('modal')

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

Обратите внимание, что в `@vue/language-tools` 2.1+ типы статических рефов могут быть выведены автоматически, и вышеописанное необходимо только в крайних случаях.
