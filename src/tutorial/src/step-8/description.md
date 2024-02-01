# Вычисляемое свойство {#computed-property}

Давайте продолжим работу над списком дел, составленным на предыдущем этапе. Здесь мы уже добавили функцию переключения для каждого дела. Это делается путём добавления свойства `done` к каждому объекту todo и использования `v-model` для привязки его к флажку:

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

Следующее улучшение, которое мы можем добавить, — это возможность скрывать уже выполненные задания. У нас уже есть кнопка, которая переключает состояние `hideCompleted`. Но как отобразить различные элементы списка в зависимости от этого состояния?

<div class="options-api">

Представляем <a target="_blank" href="/guide/essentials/computed.html">вычисляемое свойство</a>. Мы можем объявить свойство, которое реактивно вычисляется из других свойств, используя опцию `computed`:

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // возвращает отфильтрованные задачи в зависимости от значения `this.hideCompleted`
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // возвращает отфильтрованные задачи в зависимости от значения `this.hideCompleted`
    }
  }
})
```

</div>

</div>
<div class="composition-api">

Представляем <a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>. Мы можем создать вычисляемую ссылку, которая обновляет свое `.value` на основе других реактивных источников данных:

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // возвращает отфильтрованные задачи в зависимости от значений
  // `todos.value` и `hideCompleted.value`
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // возвращает отфильтрованные задачи в зависимости от значений
      // `todos.value` и `hideCompleted.value`
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

Вычисляемое свойство отслеживает другие реактивные состояния, используемые в его вычислении, как зависимости. Оно кэширует результат и автоматически обновляет его при изменении зависимостей.

Теперь попробуйте добавить вычисляемое свойство `filteredTodos` и реализовать его логику вычислений! Если вы сделаете всё правильно, отметка задачи при скрытии завершённых элементов должна мгновенно скрывать и её.
