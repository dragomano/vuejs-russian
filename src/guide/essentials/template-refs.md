# Ссылки на элементы шаблона {#template-refs}

Хотя декларативная модель отрисовки Vue абстрагирует большую часть прямых операций с DOM, всё же могут быть случаи, когда нам понадобится прямой доступ к базовым элементам DOM. Для этого мы можем использовать специальный атрибут `ref`:

```vue-html
<input ref="input">
```

`ref` — это специальный атрибут, аналогичный атрибуту `key`, о котором говорилось в главе `v-for`. Он позволяет получить прямую ссылку на конкретный элемент DOM или экземпляр дочернего компонента после его установки. Это может быть полезно, когда вы хотите, например, программно сфокусировать ввод на компоненте `mount` или инициализировать стороннюю библиотеку на элементе.

## Доступ к рефам {#accessing-the-refs}

<div class="composition-api">

Чтобы получить реф с помощью Composition API, используйте хелпер [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
// первый аргумент должен соответствовать значению ref в шаблоне
const input = useTemplateRef('my-input')
onMounted(() => {
  input.value.focus()
})
</script>
<template>
  <input ref="my-input" />
</template>
```

При использовании TypeScript поддержка IDE Vue и `vue-tsc` будут автоматически определять тип `input.value` на основе того, в каком элементе или компоненте используется соответствующий атрибут `ref`.

<details>
<summary>Использование до версии 3.5</summary>

В версиях до 3.5, где `useTemplateRef()` не была введена, нам нужно объявить реф с именем, которое соответствует значению атрибута ссылки на элемент шаблона:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// объявляем ref для хранения ссылки на элемент шаблона
// имя должно соответствовать значению атрибута ref в разметке
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Если вы не используете `<script setup>`, не забудьте также вернуть реф из `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

Полученная ссылка доступна через `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Обратите внимание, что вы можете получить доступ к ссылке только **после того, как компонент смонтирован.** Если вы попытаетесь получить доступ к <span class="options-api">`$refs.input`</span><span class="composition- api">`input`</span> в выражении шаблона это будет <span class="options-api">`undefine`</span><span class="composition-api">`null`</span> при первой отрисовке. Это потому, что элемент не существует до первой отрисовки!

<div class="composition-api">

Если вы пытаетесь следить за изменениями ссылки на шаблон, не забудьте учесть случай, когда ссылка имеет значение `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // ещё не смонтирован, или элемент был размонтирован (например, с помощью v-if)
  }
})
```

Смотрите также: [Типизация ссылок на элементы шаблона](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Рефы внутри `v-for` {#refs-inside-v-for}

> Требуется версия 3.5 или выше

<div class="composition-api">

Когда `ref` используется внутри `v-for`, он должен содержать массив, который будет заполнен элементами после монтирования:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
const list = ref([
  /* ... */
])
const itemRefs = useTemplateRef('items')
onMounted(() => console.log(itemRefs.value))
</script>
<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Использование до версии 3.5</summary>

В версиях до 3.5, где `useTemplateRef()` не был введён, нам нужно объявить реф с именем, которое соответствует значению атрибута ссылки на элемент шаблона. Реф также должен содержать массив значений:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

Когда `ref` используется внутри `v-for`, результирующее значение ref будет представлять собой массив, содержащий соответствующие элементы:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

Следует отметить, что массив ref **не** гарантирует тот же порядок, что и исходный массив.

## Ссылка на функцию {#function-refs}

Вместо строкового ключа атрибут `ref` можно привязать к функции, которая будет вызываться при каждом обновлении компонента и обеспечит вам полную гибкость в выборе места хранения ссылки на элемент. В качестве первого аргумента функция получает ссылку на элемент:

```vue-html
<input :ref="(el) => { /* присвоить el свойству или ссылке */ }">
```

Обратите внимание, что мы используем динамическую привязку `:ref`, поэтому мы можем передать ей функцию вместо строки с именем ref. Когда элемент будет размонтирован, аргумент станет `null`. Конечно, вы можете использовать метод вместо встроенной функции.

## Ссылка на компонент {#ref-on-component}

> Этот раздел предполагает знание [Компонентов](/guide/essentials/component-basics). Не стесняйтесь пропустить его и вернуться позже.

`ref` можно использовать и для дочернего компонента. В этом случае ссылка будет принадлежать экземпляру компонента:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'
const childRef = useTemplateRef('child')
onMounted(() => {
  // childRef.value будет содержать экземпляр <Child />
})
</script>
<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Использование до версии 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value будет содержать экземпляр <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child будет содержать экземпляр <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Если дочерний компонент использует API Options или не использует `<script setup>`, то экземпляр</span><span class="options-api">Экземпляр</span>, на который ссылаются, будет идентичен `this` дочернего компонента, что означает, что родительский компонент будет иметь полный доступ к каждому свойству и методу дочернего компонента. Это позволяет легко создавать тесно связанные детали реализации между родительским и дочерним компонентами, поэтому ссылки на компоненты следует использовать только в случае крайней необходимости — в большинстве случаев вы должны попытаться реализовать взаимодействие родитель/потомок, используя стандартные интерфейсы props и emit.

<div class="composition-api">

Исключением является то, что компоненты, использующие `<script setup>`, по умолчанию являются **приватными**: Родительский компонент, ссылающийся на дочерний компонент с помощью `<script setup>`, не сможет получить доступ ни к чему, если дочерний компонент не решит раскрыть публичный интерфейс с помощью макроса `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Макросы компилятора, такие как defineExpose, не нужно импортировать
defineExpose({
  a,
  b
})
</script>
```

Когда родитель получает экземпляр этого компонента через ссылки шаблона, полученный экземпляр будет иметь форму `{ a: число, b: число }` (ссылки автоматически разворачиваются, как и в обычных экземплярах).

Обратите внимание, что `defineExpose` должен быть вызван до любой операции `await`. В противном случае свойства и методы, предоставленные после операции `await`, будут недоступны.

Смотрите также: [Типизация ссылок на компоненты](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Опция `expose` может быть использована для ограничения доступа к дочернему экземпляру:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

В приведённом выше примере родитель, ссылающийся на этот компонент через шаблон ref, сможет получить доступ только к `publicData` и `publicMethod`.

</div>
