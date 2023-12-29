# Слушатели событий {#event-listeners}

Мы можем прослушивать события DOM с помощью директивы `v-on`:

```vue-html
<button v-on:click="increment">{{ count }}</button>
```

Из-за частого использования директива `v-on` также имеет сокращённый синтаксис:

```vue-html
<button @click="increment">{{ count }}</button>
```

<div class="options-api">

Здесь `increment` ссылается на функцию, объявленную с помощью свойства `methods`:

<div class="sfc">

```js{7-12}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // обновление состояния компонента
      this.count++
    }
  }
}
```

</div>
<div class="html">

```js{7-12}
createApp({
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      // обновление состояния компонента
      this.count++
    }
  }
})
```

</div>

Внутри метода мы можем получить доступ к экземпляру компонента с помощью `this`. Экземпляр компонента раскрывает свойства данных, объявленные в `data`. Мы можем обновлять состояние компонента, изменяя эти свойства.

</div>

<div class="composition-api">

<div class="sfc">

Здесь `increment` ссылается на функцию, объявленную в `<script setup>`:

```vue{6-9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  // обновление состояния компонента
  count.value++
}
</script>
```

</div>

<div class="html">

Здесь `increment` ссылается на метод в объекте, возвращаемом из `setup()`:

```js{$}
setup() {
  const count = ref(0)

  function increment(e) {
    // обновление состояния компонента
    count.value++
  }

  return {
    count,
    increment
  }
}
```

</div>

Внутри функции мы можем обновлять состояние компонента, изменяя рефссылки.

</div>

Обработчики событий также могут использовать встроенные выражения и упрощать общие задачи с помощью модификаторов. Эти подробности рассматриваются в главе <a target="_blank" href="/guide/essentials/event-handling.html">Обработка событий</a>.

Теперь попробуйте самостоятельно реализовать <span class="options-api">метод</span><span class="composition-api">функцию</span> `increment` и привязать <span class="options-api">его</span><span class="composition-api">её</span> к кнопке с помощью `v-on`.
