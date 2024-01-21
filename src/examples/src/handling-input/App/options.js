export default {
  data() {
    return {
      message: 'Привет, мир!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message.split('').reverse().join('')
    },
    notify() {
      alert('навигация была заблокирована.')
    }
  }
}
