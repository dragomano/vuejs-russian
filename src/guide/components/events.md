<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // Документация по v-model раньше была частью этой страницы. Попробуем перенаправить устаревшие ссылки.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# События компонента {#component-events}

> Эта страница предполагает, что вы уже прочитали [Основы работы с компонентами](/guide/essentials/component-basics).

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Бесплатный урок по определению пользовательских событий в Vue.js"/>
</div>

## Испускание и прослушивание событий {#emitting-and-listening-to-events}

Компонент может испускать пользовательские события непосредственно в выражениях шаблона (например, в обработчике `v-on`) с помощью встроенного метода `$emit`:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">нажмите меня</button>
```

<div class="options-api">

Метод `$emit()` также доступен на экземпляре компонента как `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Родитель может прослушать его с помощью `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

Модификатор `.once` также поддерживается для слушателей событий компонентов:

```vue-html
<MyComponent @some-event.once="callback" />
```

Как и компоненты и параметры, имена событий обеспечивают автоматическое преобразование регистров. Обратите внимание, что мы создали событие camelCase, но можем прослушать его с помощью слушателя kebab-cased в родителе. Как и в случае с [регистром имён параметров](/guide/components/props#prop-name-casing), мы рекомендуем использовать в шаблонах слушатели событий в шашлычной оболочке.

:::tip Совет
В отличие от собственных событий DOM, события, испускаемые компонентом, **не** пузырятся. Можно прослушивать только события, испускаемые непосредственным дочерним компонентом. Если необходимо взаимодействовать между родственными или глубоко вложенными компонентами, используйте внешнюю шину событий или [глобальное решение для управления состоянием](/guide/scaling-up/state-management).
:::

## Аргументы событий {#event-arguments}

Иногда бывает полезно выдать событию определённое значение. Например, мы можем захотеть, чтобы компонент `<BlogPost>` отвечал за то, на сколько увеличивать текст. В таких случаях мы можем передать `$emit` дополнительные аргументы, чтобы получить это значение:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Увеличить на 1
</button>
```

Затем, когда мы прослушиваем событие в родителе, мы можем использовать встроенную стрелочную функцию в качестве слушателя, что позволит нам получить доступ к аргументу события:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Или, если обработчик события является методом:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Тогда значение будет передано в качестве первого параметра этого метода:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip Примечание
Все дополнительные аргументы, переданные в `$emit()` после имени события, будут переданы слушателю. Например, при использовании `$emit('foo', 1, 2, 3)` функция listener получит три аргумента.
:::

## Объявление испускаемых событий {#declaring-emitted-events}

Компонент может явно объявить события, которые он будет испускать, с помощью <span class="composition-api">макроса [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits) </span><span class="options-api">свойства [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

Метод `$emit`, который мы использовали в `<template>`, недоступен в секции `<script setup>` компонента, но `defineEmits()` возвращает эквивалентную функцию, которую мы можем использовать вместо него:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

Макрос `defineEmits()` **не может** быть использован внутри функции, он должен быть помещен непосредственно в `<script setup>`, как в примере выше.

Если вы используете явную функцию `setup` вместо `<script setup>`, события должны быть объявлены с помощью опции [`emits`](/api/options-state#emits), а функция `emit` выставляется на контексте `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Как и другие свойства контекста `setup()`, `emit` может быть безопасно деструктурирован:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

Опция `emits` и макрос `defineEmits()` также поддерживают объектный синтаксис. Если вы используете TypeScript, вы можете ввести аргументы, что позволит нам выполнить проверку полезной нагрузки испускаемых событий во время выполнения:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string; password: string }) {
    // возвращает `true` или `false` для указания, что
    // проверка пройдена / не пройдена
  }
})
</script>
```

Если вы используете TypeScript с `<script setup>`, можно также объявлять испускаемые события с помощью аннотаций чистого типа:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Подробнее: [Типизация событий компонента](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // возвращает `true` или `false` для указания, что
      // проверка пройдена / не пройдена
    }
  }
}
```

Смотрите также: [Типизация событий компонента](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Хотя это необязательно, рекомендуется определять все испускаемые события, чтобы лучше документировать работу компонента. Это также позволяет Vue исключать известные слушатели из [обычных атрибутов](/guide/components/attrs#v-on-listener-inheritance), избегая краевых случаев, вызванных событиями DOM, вручную диспетчеризируемыми сторонним кодом.

:::tip Примечание
Если в параметре `emits` задано собственное событие (например, `click`), то слушатель теперь будет слушать только события `click`, передаваемые компонентом, и больше не будет реагировать на собственные события `click`.
:::

## Валидация событий {#events-validation}

Аналогично проверке типа параметра, испускаемое событие может быть проверено, если оно определено с помощью синтаксиса объекта, а не синтаксиса массива.

Чтобы добавить проверку, событию назначается функция, которая получает аргументы, переданные вызову <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span>, и возвращает булево число, указывающее, является ли событие действительным или нет.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Без валидации
  click: null,

  // Проверка события submit
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Неверная полезная нагрузка события sumbit!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Без валидации
    click: null,

    // Проверка события submit
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Неверная полезная нагрузка события sumbit!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>

## События как параметры {#events-props}

Вы также можете объявлять и передавать `events` как `props`, префиксируя имя события заглавными буквами с `on`.

Использование `props.onEvent` отличается от использования `emit('event')`, так как в первом случае будет передаваться только обработка слушателя, основанного на свойстве (либо `@event`, либо `:on-event`).

:::warning Предупреждение
Если переданы `:onEvent` и `@event`, то `props.onEvent` может представлять собой массив `functions` вместо `function`, такое поведение не стабильно и может измениться в будущем.
:::

В связи с этим рекомендуется использовать `emit('event')` вместо `props.onEvent` при эмиссии событий.
