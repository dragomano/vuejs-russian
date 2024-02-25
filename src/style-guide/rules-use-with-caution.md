# Правила приоритета D: Используйте с осторожностью {#priority-d-rules-use-with-caution}

Некоторые функции Vue существуют для того, чтобы учесть редкие крайние случаи или сгладить миграцию с унаследованной кодовой базы. Однако при чрезмерном использовании они могут усложнить сопровождение кода или даже стать источником ошибок. Эти правила проливают свет на потенциально рискованные функции, описывая, когда и почему их следует избегать.

## Селекторы элементов с `scoped` {#element-selectors-with-scoped}

**Селекторы элементов следует избегать с `scoped`.**

Предпочитайте селекторы классов селекторам элементов в `scoped` стилях, потому что большое количество селекторов элементов работает медленно.

::: details Подробное объяснение
Чтобы охватить стили, Vue добавляет уникальный атрибут к элементам компонента, например `data-v-f3f3eg9`. Затем селекторы изменяются таким образом, чтобы выбирались только элементы с этим атрибутом (например, `button[data-v-f3f3eg9]`).

Проблема заключается в том, что большое количество селекторов элементов-атрибутов (например, `button[data-v-f3f3eg9]`) будет значительно медленнее, чем селекторы с атрибутами классов (например, `.btn-close[data-v-f3f3eg9]`), поэтому при любой возможности следует отдавать предпочтение селекторам классов.
:::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

</div>

## Неявное общение родительских и дочерних элементов {#implicit-parent-child-communication}

**Для связи между родительским и дочерним компонентами следует использовать параметры и события, а не `this.$parent` или мутирующие параметры.**

Идеальное приложение Vue — параметры вниз, события вверх. Придерживаясь этой конвенции, вы значительно упростите понимание компонентов. Однако есть крайние случаи, когда мутация параметров или `this.$parent` могут упростить два компонента, которые уже глубоко связаны между собой.

Проблема в том, что существует множество _простых_ случаев, когда эти шаблоны могут предложить удобство. Остерегайтесь: Не поддавайтесь соблазну променять простоту (возможность понять поток вашего состояния) на краткосрочное удобство (написание меньшего количества кода).

<div class="options-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(
        (todo) => todo.id !== vm.todo.id
      )
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```

</div>

</div>

<div class="composition-api">

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input v-model="todo.text" />
</template>
```

```vue
<script setup>
import { getCurrentInstance } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const instance = getCurrentInstance()

function removeTodo() {
  const parent = instance.parent
  if (!parent) return

  parent.props.todos = parent.props.todos.filter((todo) => {
    return todo.id !== props.todo.id
  })
}
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo">×</button>
  </span>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['input'])
</script>

<template>
  <input :value="todo.text" @input="emit('input', $event.target.value)" />
</template>
```

```vue
<script setup>
defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <span>
    {{ todo.text }}
    <button @click="emit('delete')">×</button>
  </span>
</template>
```

</div>

</div>
