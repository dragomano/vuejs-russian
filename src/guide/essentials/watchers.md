# Наблюдатели {#watchers}

## Базовое использование {#basic-example}

Вычисляемые свойства позволяют нам декларативно вычислять производные значения. Однако бывают случаи, когда нам необходимо выполнить «побочные эффекты» в ответ на изменения состояния — например, изменить DOM или изменить другую часть состояния на основе результата асинхронной операции.

<div class="options-api">

С помощью Options API мы можем использовать свойство [`watch`](/api/options-state#watch) для запуска функции при изменении реактивного свойства:

```js
export default {
  data() {
    return {
      question: '',
      answer: 'Вопросы обычно содержат вопросительный знак. ;-)',
      loading: false
    }
  },
  watch: {
    // при каждом изменении вопроса будет запускаться эта функция
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.getAnswer()
      }
    }
  },
  methods: {
    async getAnswer() {
      this.loading = true
      this.answer = 'Думаю...'
      try {
        const res = await fetch('https://yesno.wtf/api')
        this.answer = (await res.json()).answer
      } catch (error) {
        this.answer = 'Ошибка! Не удалось связаться с API. ' + error
      } finally {
        this.loading = false
      }
    }
  }
}
```

```vue-html
<p>
  Задайте вопрос «да/нет»:
  <input v-model="question" :disabled="loading" />
</p>
<p>{{ answer }}</p>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9VE1v2zAM/SucLnaw1D70lqUbsiKH7rB1W4++aDYdq5ElTx9xgiD/fbT8lXZFAQO2+Mgn8pH0mW2aJjl4ZCu2trkRjfucKTw22jgosOReOjhnCqDgjseL/hvAoPNGjSeAvx6tE1qtIIqWo5Er26Ih088BteCt51KeINfKcaGAT5FQc7NP4NPNYiaQmhdC7VZQcmlxMF+61yUcWu7yajVmkabQVqjwgGZmzSuudmiX4CphofQqD+ZWSAnGqz5y9I4VtmOuS9CyGA9T3QCihGu3RKhc+gJtHH2JFld+EG5Mdug2QYZ4MSKhgBd11OgqXdipEm5PKoer0Jk2kA66wB044/EF1GtOSPRUCbUnryRJosnFnK4zpC5YR7205M9bLhyUSIrGUeVcY1dpekKrdNK6MuWNiKYKXt8V98FElDxbknGxGLCpZMi7VkGMxmjzv0pz1tvO4QPcay8LULoj5RToKoTN40MCEXyEQDJTl0KFmXpNOqsUxudN+TNFzzqdJp8ODutGcod0Alg34QWwsXsaVtIjVXqe9h5bC9V4B4ebWhco7zI24hmDVSEs/yOxIPOQEFnTnjzt2emS83nYFrhcevM6nRJhS+Ys9aoUu6Av7WqoNWO5rhsh0fxownplbBqhjJEmuv0WbN2UDNtDMRXm+zfsz/bY2TL2SH1Ec8CMTZjjhqaxh7e/v+ORvieQqvaSvN8Bf6HV0veSdG5fvSoo7Su/kO1D3f13SKInuz06VHYsahzzfl0yRj+s+3dKn9O9TW7HPrPLP624lFU=)

Свойство `watch` также поддерживает путь, разделённый точками, в качестве ключа:

```js
export default {
  watch: {
    // Примечание: только простые пути. Выражения не поддерживаются.
    'some.nested.key'(newValue) {
      // ...
    }
  }
}
```

</div>

<div class="composition-api">

С помощью Composition API мы можем использовать функцию [`watch`](/api/reactivity-core#watch) для запуска обратного вызова при каждом изменении части реактивного состояния:

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Вопросы обычно содержат вопросительный знак. ;-)')
const loading = ref(false)

// watch работает напрямую с ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.includes('?')) {
    loading.value = true
    answer.value = 'Думаю...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Ошибка! Не удалось связаться с API. ' + error
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <p>
    Задайте вопрос «да/нет»:
    <input v-model="question" :disabled="loading" />
  </p>
  <p>{{ answer }}</p>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9U8Fy0zAQ/ZVFF9tDah96C2mZ0umhHKBAj7oIe52oUSQjyXEyGf87KytyoDC9JPa+p+e3b1cndtd15b5HtmQrV1vZeXDo++6Wa7nrjPVwAovtAgbh6w2M0Fqzg4xOZFxzXRvtPPzq0XlpNNwEbp5lRUKEdgPaVP925jnoXS+UOgKxvJAaxEVjJ+y2hA9XxUVFGdFIvT7LtEI5JIzrqjrbGozdOmikxdqTKqmIQOV6gvOkvQDhjrqGXOOQvCzAqCa9FHBzCyeuAWT7F6uUulZ9gy7PPmZFETmQjJV7oXoke972GJHY+Axkzxupt4FalhRcYHh7TDIQcqA+LTriikFIDy0G59nG+84tq+qITpty8G0lOhmSiedefSaPZ0mnfHFG50VRRkbkj1BPceVorbFzF/+6fQj4O7g3vWpAm6Ao6JzfINw9PZaQwXuYNJJuK/U0z1nxdTLT0M7s8Ec/I3WxquLS0brRi8ddp4RHegNYhR0M/Du3pXFSAJU285osI7aSuus97K92pkF1w1nCOYNlI534qbCh8tkOVasoXkV1+sjplLZ0HGN5Vc1G2IJ5R8Np5XpKlK7J1CJntdl1UqH92k0bzdkyNc8ZRWGGz1MtbMQi1esN1tv/1F/cIdQ4e6LJod0jZzPmhV2jj/DDjy94oOcZpK57Rew3wO/ojOpjJIH2qdcN2f6DN7l9nC47RfTsHg4etUtNpZUeJz5ndPPv32j9Yve6vE6DZuNvu1R2Tg==)

### Типы источников Watch {#watch-source-types}

Первым аргументом `watch` могут быть различные типы реактивных «источников»: Это может быть ссылка (включая вычисляемые ссылки), реактивный объект, геттер-функция или массив из нескольких источников:

```js
const x = ref(0)
const y = ref(0)

// одиночная ссылка
watch(x, (newX) => {
  console.log(`x — ${newX}`)
})

// геттер
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`сумма x + y: ${sum}`)
  }
)

// массив из нескольких источников
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x — ${newX}, y — ${newY}`)
})
```

Обратите внимание, что вы не можете наблюдать за свойством реактивного объекта таким образом:

```js
const obj = reactive({ count: 0 })

// Это не сработает, потому что мы передаем в watch() число
watch(obj.count, (count) => {
  console.log(`count: ${count}`)
})
```

Вместо этого используйте геттер:

```js
// используем геттер:
watch(
  () => obj.count,
  (count) => {
    console.log(`count: ${count}`)
  }
)
```

</div>

## Глубокие наблюдатели {#deep-watchers}

<div class="options-api">

По умолчанию `watch` является неглубоким: обратный вызов сработает только тогда, когда наблюдаемому свойству будет присвоено новое значение — он не сработает при изменении вложенных свойств. Если вы хотите, чтобы обратный вызов срабатывал при всех вложенных мутациях, вам нужно использовать глубокий наблюдатель:

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // Примечание: Здесь `newValue` будет равно `oldValue`
        // при вложенных мутациях до тех пор, пока сам объект
        // не будет заменен
      },
      deep: true
    }
  }
}
```

</div>

<div class="composition-api">

Когда вы вызываете `watch()` непосредственно на реактивном объекте, он неявно создаст глубокий наблюдатель — обратный вызов будет срабатывать на все вложенные мутации:

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // срабатывает при мутациях вложенных свойств
  // Примечание: Здесь `newValue` будет равно `oldValue`,
  // потому что они оба указывают на один и тот же объект!
})

obj.count++
```

Это следует отличать от геттера, возвращающего реактивный объект — в последнем случае обратный вызов сработает только в том случае, если геттер вернет другой объект:

```js
watch(
  () => state.someObject,
  () => {
    // срабатывает только при замене state.someObject
  }
)
```

Однако вы можете заставить второй вариант превратиться в глубокий наблюдатель, явно используя опцию `deep`:

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Примечание: Здесь `newValue` будет равно `oldValue`,
    // *если* state.someObject не был заменен
  },
  { deep: true }
)
```

</div>

:::warning Используйте с осторожностью
Глубокое наблюдение требует обхода всех вложенных свойств в наблюдаемом объекте и может быть дорогостоящим при использовании больших структур данных. Используйте его только в случае необходимости и остерегайтесь последствий для производительности.
:::

## Нетерпеливые наблюдатели {#eager-watchers}

По умолчанию `watch` является ленивым: обратный вызов не будет вызван до тех пор, пока наблюдаемый источник не изменится. Но в некоторых случаях мы можем захотеть, чтобы та же логика обратного вызова выполнялась нетерпеливо — например, мы можем захотеть получить некоторые начальные данные, а затем повторно получить их при каждом изменении состояния.

<div class="options-api">

Мы можем заставить обратный вызов наблюдателя выполняться немедленно, объявив его с помощью объекта с функцией `handler` и параметром `immediate: true` опция:

```js
export default {
  // ...
  watch: {
    question: {
      handler(newQuestion) {
        // будет выполняться непосредственно при создании компонента.
      },
      // принудительное выполнение обратного вызова
      immediate: true
    }
  }
  // ...
}
```

Начальное выполнение функции-обработчика произойдет непосредственно перед хуком `created`. Vue уже обработает свойства `data`, `computed` и `methods`, поэтому эти свойства будут доступны при первом вызове.

</div>

<div class="composition-api">

Мы можем заставить обратный вызов наблюдателя выполняться немедленно, передав ему параметр `immediate: true`:

```js
watch(
  source,
  (newValue, oldValue) => {
    // выполняется сразу, затем снова, когда изменяется `source`.
  },
  { immediate: true }
)
```

</div>

<div class="composition-api">

## `watchEffect()` \*\* {#watcheffect}

Обычно обратный вызов наблюдателя использует точно такое же реактивное состояние, как и источник. Например, рассмотрим следующий код, который использует наблюдатель для загрузки удаленного ресурса при каждом изменении ссылки `todoId`:

```js
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

В частности, обратите внимание, что наблюдатель использует `todoId` дважды: один раз в качестве источника, а затем ещё раз внутри обратного вызова.

Это можно упростить с помощью [`watchEffect()`](/api/reactivity-core#watcheffect). `watchEffect()` позволяет нам автоматически отслеживать реактивные зависимости обратного вызова. Приведённый выше наблюдатель можно переписать в виде:

```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

Здесь обратный вызов будет выполнен немедленно, нет необходимости указывать `immediate: true`. Во время выполнения он будет автоматически отслеживать `todoId.value` как зависимость (аналогично вычисляемым свойствам). Когда `todoId.value` изменится, обратный вызов будет запущен снова. С `watchEffect()` нам больше не нужно явно передавать `todoId` в качестве исходного значения.

Вы можете посмотреть [этот пример](/examples/#fetching-data) `watchEffect()` и реактивной выборки данных в действии.

Для таких примеров, как этот, с одной зависимостью, польза от `watchEffect()` относительно невелика. Но для наблюдателей, у которых есть несколько зависимостей, использование `watchEffect()` снимает бремя необходимости вести список зависимостей вручную. Кроме того, если вам нужно следить за несколькими свойствами во вложенной структуре данных, `watchEffect()` может оказаться более эффективным, чем глубокий наблюдатель, поскольку он будет отслеживать только те свойства, которые используются в обратном вызове, а не рекурсивно отслеживать их все.

:::tip Примечание
`watchEffect` отслеживает зависимости только во время своего **синхронного** выполнения. При использовании его с асинхронным обратным вызовом будут отслеживаться только свойства, доступные до первого тика `await`.
:::

### `watch` в сравнении с `watchEffect` {#watch-vs-watcheffect}

`watch` и `watchEffect` позволяют нам реактивно выполнять побочные эффекты. Их основное отличие заключается в способе отслеживания реактивных зависимостей:

- `watch` отслеживает только явно наблюдаемый источник. Он не будет отслеживать ничего, к чему обращаются внутри обратного вызова. Кроме того, обратный вызов срабатывает только тогда, когда источник действительно изменился. `watch` отделяет отслеживание зависимостей от побочного эффекта, предоставляя нам более точный контроль над тем, когда должен сработать обратный вызов.

- С другой стороны, `watchEffect` объединяет отслеживание зависимостей и побочных эффектов в одну фазу. Он автоматически отслеживает каждое реактивное свойство, к которому обращаются во время его синхронного выполнения. Это удобнее и обычно приводит к более короткому коду, но делает реактивные зависимости менее явными.

</div>

## Время сброса обратного вызова {#callback-flush-timing}

Когда вы изменяете реактивное состояние, это может вызвать как обновления компонентов Vue, так и обратные вызовы наблюдателей, созданные вами.

По умолчанию созданные пользователем обратные вызовы наблюдателя вызываются **перед** обновлениями компонентов Vue. Это означает, что если вы попытаетесь получить доступ к DOM внутри обратного вызова наблюдателя, DOM будет находиться в состоянии до того, как Vue применит какие-либо обновления.

Если вы хотите получить доступ к DOM в обратном вызове наблюдателя **после** обновления Vue, вам нужно указать опцию `flush: 'post'`:

<div class="options-api">

```js
export default {
  // ...
  watch: {
    key: {
      handler() {},
      flush: 'post'
    }
  }
}
```

</div>

<div class="composition-api">

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` также имеет удобный псевдоним, `watchPostEffect()`:

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* выполняется после обновлений Vue */
})
```

</div>

<div class="options-api">

## `this.$watch()` \* {#this-watch}

Также можно принудительно создавать наблюдатели с помощью метода экземпляра [`$watch()`](/api/component-instance#watch):

```js
export default {
  created() {
    this.$watch('question', (newQuestion) => {
      // ...
    })
  }
}
```

Это полезно, когда вам нужно условно настроить наблюдателя или наблюдать за чем-то только в ответ на взаимодействие с пользователем. Это также позволяет остановить наблюдателя раньше времени.

</div>

## Остановка наблюдателя {#stopping-a-watcher}

<div class="options-api">

Наблюдатели, объявленные с помощью свойства `watch` или метода экземпляра `$watch()`, автоматически останавливаются, когда компонент-владелец размонтирован, поэтому в большинстве случаев вам не нужно беспокоиться о том, чтобы останавливать наблюдателя самостоятельно.

В редких случаях, когда вам нужно остановить наблюдателя до того, как компонент-владелец размонтируется, API `$watch()` возвращает функцию для этого:

```js
const unwatch = this.$watch('foo', callback)

// ...когда наблюдатель больше не нужен:
unwatch()
```

</div>

<div class="composition-api">

Наблюдатели, объявленные синхронно внутри `setup()` или `<script setup>`, привязываются к экземпляру компонента-владельца и будут автоматически остановлены, когда компонент-владелец будет размонтирован. В большинстве случаев вам не нужно беспокоиться о том, чтобы самостоятельно остановить наблюдателя.

Ключевым моментом здесь является то, что наблюдатель должен быть создан **синхронно**: Если наблюдатель создается в асинхронном обратном вызове, он не будет привязан к компоненту-владельцу и должен быть остановлен вручную, чтобы избежать утечки памяти. Вот пример:

```vue
<script setup>
import { watchEffect } from 'vue'

// этот будет автоматически остановлен
watchEffect(() => {})

// ...этот - нет!
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>
```

Чтобы вручную остановить наблюдателя, воспользуйтесь возвращаемым обработчиком. Это работает как для `watch`, так и для `watchEffect`:

```js
const unwatch = watchEffect(() => {})

// ...позже, когда необходимость в них отпадет
unwatch()
```

Обратите внимание, что случаев, когда вам нужно создавать наблюдатели асинхронно, должно быть очень мало, и по возможности следует предпочесть синхронное создание. Если вам нужно дождаться каких-то асинхронных данных, вы можете сделать логику `watch` условной:

```js
// данные для асинхронной загрузки
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // делать что-то при загрузке данных
  }
})
```

</div>
