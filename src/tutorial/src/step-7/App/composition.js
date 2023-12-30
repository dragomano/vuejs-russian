import { ref } from 'vue'

export default {
  setup() {
    // присваиваем каждому todo уникальный идентификатор
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: 'Изучить HTML' },
      { id: id++, text: 'Изучить JavaScript' },
      { id: id++, text: 'Изучить Vue' }
    ])

    function addTodo() {
      // ...
      newTodo.value = ''
    }

    function removeTodo(todo) {
      // ...
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
