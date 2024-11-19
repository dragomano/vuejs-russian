# События {#emits}

Помимо получения пропсов, дочерний компонент может передавать родительскому события:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// объявляем доступные события
const emit = defineEmits(['response'])

// emit с аргументом
emit('response', 'привет из дочернего компонента')
</script>
```

</div>

<div class="html">

```js
export default {
  // объявляем доступные события
  emits: ['response'],
  setup(props, { emit }) {
    // emit с аргументом
    emit('response', 'привет из дочернего компонента')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // объявляем доступные события
  emits: ['response'],
  created() {
    // emit с аргументом
    this.$emit('response', 'привет из дочернего компонента')
  }
}
```

</div>

Первым аргументом <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> является имя события. Любые дополнительные аргументы передаются слушателю событий.

Родитель может прослушивать события, испускаемые потомками, используя `v-on` — здесь обработчик получает дополнительный аргумент от вызова дочернего emit и присваивает его локальному состоянию:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Теперь попробуйте сделать это сами в редакторе.
