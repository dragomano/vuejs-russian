# Правила приоритета A: Важно {#priority-a-rules-essential}

Эти правила помогут избежать ошибок, поэтому выучите их и соблюдайте во что бы то ни стало. Исключения возможны, но они должны быть очень редкими и делаться только теми, кто обладает экспертными знаниями JavaScript и Vue.

## Используйте многословные имена компонентов {#use-multi-word-component-names}

Имена пользовательских компонентов всегда должны быть многословными, за исключением корневых компонентов `App`. Это [предотвращает конфликты](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) с существующими и будущими элементами HTML, поскольку все элементы HTML состоят из одного слова.

<div class="style-example style-example-bad">
<h3>Bad</h3>

```vue-html
<!-- в предварительно скомпилированных шаблонах -->
<Item />

<!-- в DOM-шаблонах -->
<item></item>
```

</div>

<div class="style-example style-example-good">
<h3>Good</h3>

```vue-html
<!-- в предварительно скомпилированных шаблонах -->
<TodoItem />

<!-- в DOM-шаблонах -->
<todo-item></todo-item>
```

</div>

## Используйте подробные определения пропсов {#use-detailed-prop-definitions}

В зафиксированном коде определения пропсов всегда должны быть как можно более подробными, с указанием как минимум типа (типов).

::: details Подробное объяснение
Подробные [определения пропсов](/guide/components/props#prop-validation) имеют два преимущества:

- Они документируют API компонента, чтобы было понятно, как его использовать.
- В процессе разработки Vue предупредит вас, если компонент будет предоставлен с неправильно отформатированными параметрами, что поможет вам выявить потенциальные источники ошибок.
  :::

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
// Это нормально только при создании прототипов
props: ['status']
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
props: {
  status: String
}
```

```js
// Ещё лучше!
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
// Это нормально только при создании прототипов
const props = defineProps(['status'])
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
const props = defineProps({
  status: String
})
```

```js
// Ещё лучше!
const props = defineProps({
  status: {
    type: String,
    required: true,

    validator: (value) => {
      return ['syncing', 'synced', 'version-conflict', 'error'].includes(
        value
      )
    }
  }
})
```

</div>

</div>

## Используйте `v-for` с ключом {#use-keyed-v-for}

`key` с `v-for` _всегда_ требуется для компонентов, чтобы сохранить внутреннее состояние компонента в поддереве. Однако даже для элементов полезно поддерживать предсказуемое поведение, как, например, [постоянство объекта](https://bost.ocks.org/mike/constancy/) в анимации.

::: details Подробное объяснение
Допустим, у вас есть список дел:

<div class="options-api">

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Учимся использовать v-for'
      },
      {
        id: 2,
        text: 'Учимся использовать key'
      }
    ]
  }
}
```

</div>

<div class="composition-api">

```js
const todos = ref([
  {
    id: 1,
    text: 'Учимся использовать v-for'
  },
  {
    id: 2,
    text: 'Учимся использовать key'
  }
])
```

</div>

Затем отсортируйте их в алфавитном порядке. При обновлении DOM Vue оптимизирует отрисовку, чтобы выполнить как можно меньше мутаций DOM. Это может означать удаление первого элемента todo, а затем добавление его в конец списка.

Проблема в том, что есть случаи, когда важно не удалять элементы, которые останутся в DOM. Например, вы можете захотеть использовать `<transition-group>` для анимации сортировки списка или сохранения фокуса, если отображаемый элемент является `<input>`. В этих случаях добавьте уникальный ключ для каждого элемента (например, `:key="todo.id"`) подскажет Vue, как вести себя более предсказуемо.

По нашему опыту, лучше _всегда_ добавлять уникальный ключ, чтобы вы и ваша команда просто не беспокоились об этих крайних случаях. Тогда в редких, критичных к производительности сценариях, где постоянство объектов не нужно, вы можете сделать сознательное исключение.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

</div>

## Избегайте использования `v-if` вместе с `v-for` {#avoid-v-if-with-v-for}

**Никогда не используйте `v-if` в том же элементе, что и `v-for`.**.

Есть два распространённых случая, когда это может быть заманчиво:

- Чтобы отфильтровать элементы в списке (например, `v-for="user in users" v-if="user.isActive"`). В этих случаях замените `users` новым вычисляемым свойством, которое возвращает ваш отфильтрованный список (например, `activeUsers`).

- Чтобы не отображать список, если он должен быть скрыт (например, `v-for="user in users" v-if="shouldShowUsers"`). В этих случаях переместите `v-if` в элемент-контейнер (например, `ul`, `ol`).

::: details Подробное объяснение
Когда Vue обрабатывает директивы, `v-if` имеет более высокий приоритет, чем `v-for`, так что этот шаблон:

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

выбросит ошибку, потому что директива `v-if` будет оценена первой, а итерационная переменная `user` в данный момент не существует.

Это можно исправить, выполнив итерацию по вычисляемому свойству, например, так:

<div class="options-api">

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

</div>

<div class="composition-api">

```js
const activeUsers = computed(() => {
  return users.filter((user) => user.isActive)
})
```

</div>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

В качестве альтернативы мы можем использовать тег `<template>` с `v-for` для обёртывания элемента `<li>`:

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```vue-html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

</div>

## Используйте стилизацию с привязкой к компонентам {#use-component-scoped-styling}

Для приложений стили в компоненте верхнего уровня `App` и в компонентах компоновки могут быть глобальными, но все остальные компоненты всегда должны быть привязаны к конкретной области.

Это актуально только для [Однофайловых компонентов](/guide/scaling-up/sfc). Они _не_ требуют использования атрибута [`scoped`](https://vue-loader.vuejs.org/ru/guide/scoped-css.html). Для масштабирования можно использовать [CSS-модули](https://vue-loader.vuejs.org/ru/guide/css-modules.html), стратегию, основанную на классах, например [BEM](http://getbem.com/), или другую библиотеку/соглашение.

**Библиотеки компонентов, однако, должны предпочесть стратегию, основанную на классах, вместо использования атрибута `scoped`.**.

Это упрощает переопределение внутренних стилей, позволяя использовать понятные для человека имена классов, которые не имеют слишком высокой специфичности, но при этом с большой вероятностью не приведут к конфликту.

::: details Подробное объяснение
Если вы разрабатываете большой проект, работаете с другими разработчиками или иногда включаете сторонние HTML/CSS (например, от Auth0), последовательная сортировка гарантирует, что ваши стили будут применяться только к тем компонентам, для которых они предназначены.

Помимо атрибута `scoped`, использование уникальных имён классов может гарантировать, что CSS сторонних разработчиков не будет применяться к вашему собственному HTML. Например, во многих проектах используются имена классов `button`, `btn` или `icon`, поэтому даже если вы не используете такую стратегию, как BEM, добавление префикса для конкретного приложения и/или компонента (например, `ButtonClose-icon`) может обеспечить некоторую защиту.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<template>
  <button class="button button-close">×</button>
</template>

<!-- Using the `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- Использование модулей CSS -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```vue-html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- Использование конвенции BEM -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```

</div>
