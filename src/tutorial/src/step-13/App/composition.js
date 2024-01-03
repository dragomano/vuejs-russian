import { ref } from 'vue'
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  },
  setup() {
    const childMsg = ref('Сообщений пока нет')

    return {
      childMsg
    }
  }
}
