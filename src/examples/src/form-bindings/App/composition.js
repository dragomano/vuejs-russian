import { ref } from 'vue'

export default {
  setup() {
    const text = ref('Отредактируй меня')
    const checked = ref(true)
    const checkedNames = ref(['Жека'])
    const picked = ref('Раз')
    const selected = ref('A')
    const multiSelected = ref(['A'])

    return {
      text,
      checked,
      checkedNames,
      picked,
      selected,
      multiSelected
    }
  }
}
