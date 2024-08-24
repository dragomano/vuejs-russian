# Отрисовка списков {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Бесплатный урок по отрисовке списков во Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Бесплатный урок по отрисовке списков во Vue.js"/>
</div>

## `v-for` {#v-for}

Мы можем использовать директиву `v-for` для вывода списка элементов на основе массива. Директива `v-for` требует специального синтаксиса в виде `item in items`, где `items` — массив исходных данных, а `item` — **псевдоним** для элемента массива, по которому выполняется итерация:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

Внутри области видимости `v-for` шаблонные выражения имеют доступ ко всем свойствам родительской области видимости. Кроме того, `v-for` также поддерживает необязательный второй псевдоним для индекса текущего элемента:

<div class="composition-api">

```js
const parentMessage = ref('Родитель')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Родитель',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Родитель'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

Область видимости переменной `v-for` похожа на следующий JavaScript:

```js
const parentMessage = 'Родитель'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // имеет доступ к внешней области `parentMessage`
  // но `item` и `index` доступны только здесь
  console.log(parentMessage, item.message, index)
})
```

Обратите внимание, что значение `v-for` совпадает с сигнатурой функции обратного вызова `forEach`. Фактически, вы можете использовать деструктуризацию псевдонима элемента `v-for` аналогично деструктуризации аргументов функции:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- с псевдонимом index -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

Для вложенных `v-for` скопинг также работает аналогично вложенным функциям. Каждая область видимости `v-for` имеет доступ к родительским областям видимости:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Вы также можете использовать `of` в качестве разделителя вместо `in`, чтобы это было ближе к синтаксису JavaScript для итераторов:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` с объектом {#v-for-with-an-object}

Вы также можете использовать `v-for` для перебора свойств объекта. Порядок итерации будет основан на результате вызова `Object.values()` для объекта:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'Как делать списки во Vue',
  author: 'Джейн Доу',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'Как делать списки во Vue',
      author: 'Джейн Доу',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Вы также можете указать второй псевдоним для имени свойства (например, `key`):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

И ещё один для индекса:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` с диапазоном {#v-for-with-a-range}

`v-for` также может принимать целое число. В этом случае он будет повторять шаблон `m` раз, основываясь на диапазоне `1...n`.

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Обратите внимание, что `n` начинается с начального значения `1`, а не `0`.

## `v-for` на `<template>` {#v-for-on-template}

Подобно шаблону `v-if`, вы также можете использовать тег `<template>` с `v-for` для отображения блока из нескольких элементов. Например:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` с `v-if` {#v-for-with-v-if}

:::warning Примечание
Не рекомендуется использовать `v-if` и `v-for` для одного и того же элемента из-за неявного приоритета. Подробности см. в [Руководстве по стилю](/style-guide/rules-essential#avoid-v-if-with-v-for).
:::

Когда они существуют на одном узле, `v-if` имеет более высокий приоритет, чем `v-for`. Это означает, что условие `v-if` не будет иметь доступа к переменным из области видимости `v-for`:

```vue-html
<!--
Это приведет к ошибке, потому что свойство «todo»
не определено в экземпляре.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Это можно исправить, переместив `v-for` в обёртывающий тег `<template>` (который также является более явным):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## Сохранение состояния с помощью `key` {#maintaining-state-with-key}

Когда Vue обновляет список элементов, отображаемых с помощью `v-for`, по умолчанию он использует стратегию «исправления на месте». Если порядок элементов данных изменился, вместо перемещения элементов DOM в соответствии с порядком элементов Vue исправит каждый элемент на месте и убедится, что он отражает то, что должно отображаться по этому конкретному индексу.

Этот режим по умолчанию эффективен, но **подходит только в том случае, если выходные данные отрисовки списка не зависят от состояния дочернего компонента или временного состояния DOM (например, входных значений формы)**.

Чтобы дать Vue подсказку, позволяющую отслеживать идентичность каждого узла и, таким образом, повторно использовать и изменять порядок существующих элементов, вам необходимо предоставить уникальный атрибут `key` для каждого элемента:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

При использовании `<template v-for>` ключ `key` должен быть помещен в контейнер `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Примечание
`key` — это специальный атрибут, связанный с `v-bind`. Его не следует путать с переменной имени свойства при [использовании `v-for` с объектом](#v-for-with-an-object).
:::

[Рекомендуется](/style-guide/rules-essential#use-keyed-v-for) предоставлять атрибут `key` с `v-for` всегда, когда это возможно, если только итерируемое содержимое DOM не является простым (т. е. не содержит компонентов или элементов DOM с состоянием), либо вы намеренно полагаетесь на поведение по умолчанию для повышения производительности.

Привязка `key` ожидает примитивные значения, то есть строки и числа. Не используйте объекты в качестве клавиш `v-for`. Подробную информацию об использовании атрибута `key` см. в [документации по API `key`](/api/built-in-special-attributes#key).

## `v-for` с компонентом {#v-for-with-a-component}

> Этот раздел предполагает знание [Компонентов](/guide/essentials/component-basics). Не стесняйтесь пропустить его и вернуться позже.

Вы можете напрямую использовать `v-for` на компоненте, как на любом обычном элементе (не забудьте указать `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Однако это не приведёт к автоматической передаче данных компоненту, поскольку компоненты имеют собственные изолированные области видимости. Чтобы передать итерированные данные в компонент, мы также должны использовать `props`:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Причина отказа от автоматической инжекции `item` в компонент заключается в том, что это делает компонент тесно связанным с тем, как работает `v-for`. Явное указание на то, откуда берутся данные, делает компонент пригодным для повторного использования в других ситуациях.

<div class="composition-api">

Посмотрите [этот пример простого списка дел](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=) чтобы посмотреть, как вывести список компонентов с помощью `v-for`, передавая каждому экземпляру разные данные.

</div>
<div class="options-api">

Посмотрите [этот пример простого списка дел](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=) чтобы посмотреть, как вывести список компонентов с помощью `v-for`, передавая каждому экземпляру разные данные.

</div>

## Обнаружение изменений в массиве {#array-change-detection}

### Мутационные методы {#mutation-methods}

Vue умеет определять, когда вызываются методы мутации реактивного массива, и запускать необходимые обновления. К таким методам мутации относятся:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Замена массива {#replacing-an-array}

Методы мутации, как следует из названия, мутируют исходный массив, на котором они вызываются. Для сравнения, существуют и немутирующие методы, например `filter()`, `concat()` и `slice()`, которые не изменяют исходный массив, но **всегда возвращают новый массив**. При работе с немутирующими методами мы должны заменить старый массив на новый:

<div class="composition-api">

```js
// `items` - ссылка со значением массива
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Вы можете подумать, что это приведёт к тому, что Vue выбросит существующий DOM и заново отобразит весь список — к счастью, это не так. Vue реализует несколько умных эвристик для максимального повторного использования элементов DOM, поэтому замена массива на другой массив, содержащий перекрывающиеся объекты, является очень эффективной операцией.

## Отображение отфильтрованных/отсортированных результатов {#displaying-filtered-sorted-results}

Иногда мы хотим отобразить отфильтрованную или отсортированную версию массива, не изменяя и не сбрасывая исходные данные. В этом случае можно создать вычисляемое свойство, возвращающее отфильтрованный или отсортированный массив.

Например:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

В ситуациях, когда вычисление свойств не представляется возможным (например, внутри вложенных циклов `v-for`), вы можете использовать метод:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Будьте осторожны с `reverse()` и `sort()` в вычисляемом свойстве! Эти два метода мутируют исходный массив, чего следует избегать в вычисляемых геттерах. Перед вызовом этих методов создайте копию исходного массива:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
