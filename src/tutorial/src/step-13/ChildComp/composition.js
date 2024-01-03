export default {
  emits: ['response'],
  setup(props, { emit }) {
    emit('response', 'привет из дочернего компонента')
    return {}
  }
}
