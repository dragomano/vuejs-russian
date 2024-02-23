# Правила приоритета C: Рекомендуется {#priority-c-rules-recommended}

Если существует несколько одинаково хороших вариантов, можно сделать произвольный выбор, чтобы обеспечить последовательность. В этих правилах мы описываем каждый приемлемый вариант и предлагаем выбор по умолчанию. Это значит, что вы можете не стесняться делать другой выбор в своей собственной кодовой базе, если вы последовательны и у вас есть веские причины. Пожалуйста, у вас есть веская причина! Приспособившись к общественному стандарту, вы:

1. Научите свой мозг легче разбирать большинство встречающихся вам кодов сообщества
2. Научитесь копировать и вставлять большинство примеров кодов сообщества без изменений
3. Часто бывает, что новые сотрудники уже привыкли к предпочитаемому вами стилю кодирования, по крайней мере, в отношении Vue

## Порядок опций компонента/экземпляра {#component-instance-options-order}

**Опции компонента/экземпляра должны быть упорядочены последовательно.**

Это порядок по умолчанию, который мы рекомендуем для опций компонентов. Они разделены на категории, так что вы будете знать, куда добавлять новые свойства плагинов.

1. **Глобальная осведомленность** (требует знаний, выходящих за рамки компонента)

   - `name`

2. **Опции компилятора шаблонов** (изменяет способ компиляции шаблонов)

   - `compilerOptions`

3. **Зависимости шаблона** (активы, используемые в шаблоне)

   - `components`
   - `directives`

4. **Композиция** (объединяет свойства в опции)

   - `extends`
   - `mixins`
   - `provide`/`inject`

5. **Интерфейс** (интерфейс компонента)

   - `inheritAttrs`
   - `props`
   - `emits`

6. **Composition API** (точка входа для использования Composition API)

   - `setup`

7. **Локальное состояние** (локальные реактивные свойства)

   - `data`
   - `computed`

8. **События** (обратные вызовы, запускаемые реактивными событиями)

   - `watch`
   - События жизненного цикла (в порядке их вызова)
     - `beforeCreate`
     - `created`
     - `beforeMount`
     - `mounted`
     - `beforeUpdate`
     - `updated`
     - `activated`
     - `deactivated`
     - `beforeUnmount`
     - `unmounted`
     - `errorCaptured`
     - `renderTracked`
     - `renderTriggered`

9. **Нереактивные свойства** (свойства экземпляра, не зависящие от системы реактивности)

   - `methods`

10. **Рендеринг** (декларативное описание отрисовки компонента)
    - `template`/`render`

## Порядок атрибутов элемента {#element-attribute-order}

**Атрибуты элементов (включая компоненты) должны быть упорядочены последовательно.**

Это порядок по умолчанию, который мы рекомендуем для опций компонентов. Они разделены на категории, так что вы будете знать, куда добавлять пользовательские атрибуты и директивы.

1. **Определение** (предоставляет параметры компонента)

   - `is`

2. **Отрисовка списка** (создает несколько вариантов одного и того же элемента)

   - `v-for`

3. **Условия** (отображается/показывается ли элемент)

   - `v-if`
   - `v-else-if`
   - `v-else`
   - `v-show`
   - `v-cloak`

4. **Отрисовка модификаторов** (изменяет способ отображения элемента)

   - `v-pre`
   - `v-once`

5. **Глобальная осведомленность** (требует знаний, выходящих за рамки компонента)

   - `id`

6. **Уникальные атрибуты** (атрибуты, требующие уникальных значений)

   - `ref`
   - `key`

7. **Двухстороннее связывание** (комбинирование связывания и событий)

   - `v-model`

8. **Другие атрибуты** (все неопределенные связанные и несвязанные атрибуты)

9. **События** (слушатели событий компонента)

   - `v-on`

10. **Контент** (переопределяет содержимое элемента)
    - `v-html`
    - `v-text`

## Пустые строки в параметрах компонентов/объектов {#empty-lines-in-component-instance-options}

**Вы можете добавить одну пустую строку между многострочными свойствами, особенно если параметры не помещаются на экране без прокрутки.**

Когда компоненты начинают казаться тесными или трудночитаемыми, добавьте пробелы между многострочными свойствами, чтобы их было легче прочесть. В некоторых редакторах, таких как Vim, подобные опции форматирования также облегчают навигацию с помощью клавиатуры.

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
// Отсутствие пробелов также допустимо, если компонент
// по-прежнему легко читается и ориентируется.
props: {
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },
  focused: {
    type: Boolean,
    default: false
  },
  label: String,
  icon: String
})
const formattedValue = computed(() => {
  // ...
})
const inputClasses = computed(() => {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
defineProps({
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
})

const formattedValue = computed(() => {
  // ...
})

const inputClasses = computed(() => {
  // ...
})
```

</div>

</div>

## Порядок элементов верхнего уровня однофайлового компонента {#single-file-component-top-level-element-order}

**[Однофайловые компоненты](/guide/scaling-up/sfc) должны всегда последовательно упорядочивать теги `<script>`, `<template>` и `<style>`, причем `<style>` должен быть последним, поскольку как минимум один из двух других всегда необходим.**.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```vue-html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

</div>
