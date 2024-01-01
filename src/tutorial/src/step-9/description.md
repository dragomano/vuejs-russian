# Жизненный цикл и ссылки на шаблоны {#lifecycle-and-template-refs}

До сих пор Vue справлялся со всеми обновлениями DOM за нас, благодаря реактивности и декларативному рендерингу. Однако неизбежно возникнут ситуации, когда нам придется работать с DOM вручную.

Мы можем запросить **шаблонную ссылку** — т. е. ссылку на элемент в шаблоне — с помощью <a target="_blank" href="/api/built-in-special-attributes.html#ref">специального атрибута `ref`</a>:

```vue-html
<p ref="pElementRef">привет</p>
```

<div class="composition-api">

Чтобы получить доступ к ссылке, нам нужно объявить <span class="html">и предоставить</span> ссылку с соответствующим именем:

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

Обратите внимание, что ссылка инициализируется значением `null`. Это происходит потому, что элемент ещё не существует, когда выполняется <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span>. Ссылка на шаблон доступна только после того, как компонент будет **смонтирован**.

Чтобы запустить код после монтирования, мы можем использовать функцию `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // компонент смонтирован
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // компонент смонтирован
    })
  }
})
```

</div>
</div>

<div class="options-api">

Элемент будет представлен в `this.$refs` как `this.$refs.pElementRef`. Однако вы сможете получить к нему доступ только после того, как компонент будет **смонтирован**.

Чтобы запустить код после монтирования, мы можем использовать свойство `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // компонент смонтирован
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // компонент смонтирован
  }
})
```

</div>
</div>

Это называется **хуком жизненного цикла** — он позволяет нам зарегистрировать обратный вызов, который будет вызываться в определенные моменты жизненного цикла компонента. Существуют и другие хуки, такие как <span class="options-api">`created` и `updated`</span><span class="composition-api">`onUpdated` и `onUnmounted`</span>. Посмотрите <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Диаграмму жизненного цикла</a> для получения более подробной информации.

Теперь попробуйте добавить хук <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>, обратившись к элементу `<p>` через <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span>, и выполнить над ним некоторые прямые операции DOM (например, изменить его `textContent`).
