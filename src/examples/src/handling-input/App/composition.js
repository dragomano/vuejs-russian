import { ref } from 'vue'

export default {
  setup() {
    const message = ref('Привет, мир!')

    function reverseMessage() {
      // Доступ/изменение значения ссылки через
      // его свойство .value.
      message.value = message.value.split('').reverse().join('')
    }

    function notify() {
      alert('навигация была заблокирована.')
    }

    return {
      message,
      reverseMessage,
      notify
    }
  }
}
