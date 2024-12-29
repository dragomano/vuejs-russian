<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Список кодов ошибок в продакшене {#error-reference}

## Ошмбки во время выполнения {#runtime-errors}

В продакшен-сборках 3-й аргумент, передаваемый следующим API-обработчикам ошибок, будет представлять собой короткий код вместо полной информационной строки:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (Composition API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (Options API)

В следующей таблице коды сопоставлены с их оригинальными полными информационными строками.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Ошибки во время компиляции {#compiler-errors}

В следующей таблице приведено соответствие между кодами ошибок компилятора и их исходными сообщениями.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
