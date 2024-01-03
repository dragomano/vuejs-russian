export default {
  emits: ['response'],
  created() {
    this.$emit('response', 'привет из дочернего компонента')
  }
}
