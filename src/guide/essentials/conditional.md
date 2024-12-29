# Отрисовка по условию {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Бесплатный урок по условной отрисовке Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Бесплатный урок по условной отрисовке Vue.js"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

Директива `v-if` используется для условного отображения блока. Блок будет отображаться только в том случае, если выражение директивы возвращает истинное значение.

```vue-html
<h1 v-if="awesome">Vue — это потрясающе!</h1>
```

## `v-else` {#v-else}

Вы можете использовать директиву `v-else` для указания блока _else_ для `v-if`:

```vue-html
<button @click="awesome = !awesome">Переключить</button>

<h1 v-if="awesome">Vue — это потрясающе!</h1>
<h1 v-else>О нет 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Переключить</button>
  <h1 v-if="awesome">Vue — это потрясающе!</h1>
  <h1 v-else>О нет 😢</h1>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Элемент `v-else` должен следовать непосредственно за элементом `v-if` или `v-else-if` — в противном случае он не будет распознан.

## `v-else-if` {#v-else-if}

Как следует из названия, `v-else-if` служит в качестве _блока else if_ для `v-if`. Его также можно соединить в цепочку несколько раз:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Не A/B/C
</div>
```

Как и `v-else`, элемент `v-else-if` должен непосредственно следовать за элементом `v-if` или `v-else-if`.

## `v-if` на элементе `<template>` {#v-if-on-template}

Поскольку `v-if` — это директива, она должна быть прикреплена к одному элементу. Но что, если мы хотим переключить несколько элементов? В этом случае мы можем использовать `v-if` на элементе `<template>`, который служит невидимой обёрткой. Конечный результат отрисовки не будет включать элемент `<template>`.

```vue-html
<template v-if="ok">
  <h1>Заголовок</h1>
  <p>Параграф 1</p>
  <p>Параграф 2</p>
</template>
```

`v-else` и `v-else-if` также могут быть использованы в `<template>`.

## `v-show` {#v-show}

Ещё одним вариантом условного отображения элемента является директива `v-show`. Использование в основном одинаково:

```vue-html
<h1 v-show="ok">Привет!</h1>
```

Разница в том, что элемент с `v-show` всегда будет отображаться и оставаться в DOM; `v-show` переключает только CSS-свойство `display` элемента.

`v-show` не поддерживает элемент `<template>` и не работает с `v-else`.

## `v-if` в сравнении с `v-show` {#v-if-vs-v-show}

`v-if` является «настоящей» условной отрисовкой, поскольку гарантирует, что слушатели событий и дочерние компоненты внутри условного блока будут правильно уничтожены и созданы заново во время переключений.

`v-if` также является **ленивым**: Если условие ложно при первой отрисовке, это ничего не даст — условный блок не будет отрисовываться до тех пор, пока условие не станет истинным в первый раз.

По сравнению с этим `v-show` намного проще — элемент отображается всегда, независимо от начального состояния, с переключением на основе CSS.

Вообще говоря, `v-if` имеет более высокую стоимость переключения, а `v-show` — более высокую стоимость начальной отрисовки. Поэтому отдайте предпочтение `v-show`, если вам нужно переключать что-то очень часто, и `v-if`, если условие вряд ли изменится во время выполнения.

## `v-if`с `v-for` {#v-if-with-v-for}

::: warning Примечание
**Не** рекомендуется использовать `v-if` и `v-for` для одного и того же элемента из-за неявного приоритета. Подробности см. в [Руководстве по стилю](/style-guide/rules-essential#avoid-v-if-with-v-for).
:::

Когда `v-if` и `v-for` используются для одного и того же элемента, `v-if` будет оценен первым. Подробности см. в [Руководстве по отрисовке списков](list#v-for-with-v-if).
