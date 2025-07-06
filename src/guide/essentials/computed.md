# Вычисляемые свойства {#computed-properties}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/computed-properties-in-vue-3" title="Бесплатный урок по вычисляемым свойствам Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-computed-properties-in-vue-with-the-composition-api" title="Бесплатный урок по вычисляемым свойствам Vue.js"/>
</div>

## Базовый пример {#basic-example}

Выражения в шаблонах очень удобны, но они предназначены для простых операций. Добавление слишком большого количества логики в ваши шаблоны может сделать их раздутыми и трудными в обслуживании. Например, если у нас есть объект с вложенным массивом:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'Джон Доу',
        books: [
          'Vue 2 - Расширенное руководство',
          'Vue 3 - Базовое руководство',
          'Vue 4 - Мистика'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'Джон Доу',
  books: [
    'Vue 2 - Расширенное руководство',
    'Vue 3 - Базовое руководство',
    'Vue 4 - Мистика'
  ]
})
```

</div>

И мы хотим отображать разные сообщения в зависимости от того, есть ли у `author` уже несколько книг или нет:

```vue-html
<p>Опубликованные книги:</p>
<span>{{ author.books.length > 0 ? 'Да' : 'Нет' }}</span>
```

На этом этапе шаблон становится немного загроможденным. Нам нужно посмотреть на него секунду, прежде чем понять, что он выполняет вычисления в зависимости от `author.books`. Что ещё более важно, мы, вероятно, не захотим повторяться, если нам понадобится включить это вычисление в шаблон более одного раза.

Вот почему для сложной логики, включающей реактивные данные, рекомендуется использовать **вычисляемое свойство**. Вот тот же пример, подвергнутый рефакторингу:

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'Джон Доу',
        books: [
          'Vue 2 - Расширенное руководство',
          'Vue 3 - Базовое руководство',
          'Vue 4 - Мистика'
        ]
      }
    }
  },
  computed: {
    // вычисляемый геттер
    publishedBooksMessage() {
      // `this` указывает на экземпляр компонента
      return this.author.books.length > 0 ? 'Да' : 'Нет'
    }
  }
}
```

```vue-html
<p>Опубликованные книги:</p>
<span>{{ publishedBooksMessage }}</span>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

Здесь мы объявили вычисляемое свойство `publishedBooksMessage`.

Попробуйте изменить значение массива `books` в приложении `data` и вы увидите, как соответственно меняется `publishedBooksMessage`.

Вы можете привязать данные к вычисляемым свойствам в шаблонах, как и к обычному свойству. Vue знает, что `this.publishedBooksMessage` зависит от `this.author.books`, поэтому он обновит все привязки, которые зависят от `this.publishedBooksMessage`, при изменении `this.author.books`.

Смотрите также: [Типизация вычисляемых свойств](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'Джон Доу',
  books: [
    'Vue 2 - Расширенное руководство',
    'Vue 3 - Базовое руководство',
    'Vue 4 - Мистика'
  ]
})

// вычисляемая ссылка
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Да' : 'Нет'
})
</script>

<template>
  <p>Опубликованные книги:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)

Здесь мы объявили вычисляемое свойство `publishedBooksMessage`. Функция `computed()` ожидает передачи [геттера](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/get#описание), а возвращаемое значение представляет собой **вычисляемую ссылку**. Как и в случае с обычными ссылками, вы можете получить доступ к вычисляемому результату через `publishedBooksMessage.value`. Вычисляемые ссылки также автоматически разворачиваются в шаблонах, поэтому вы можете ссылаться на них без `.value` в выражениях шаблона.

Вычисляемое свойство автоматически отслеживает свои реактивные зависимости. Vue знает, что вычисление `publishedBooksMessage` зависит от `author.books`, поэтому он будет обновлять любые привязки, которые зависят от `publishedBooksMessage`, при изменении `author.books`.

Смотрите также: [Типизация `computed()`](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## Вычисляемое кэширование против методов {#computed-caching-vs-methods}

Возможно, вы заметили, что мы можем добиться того же результата, вызвав метод в выражении:

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// в компоненте
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Да' : 'Нет'
  }
}
```

</div>

<div class="composition-api">

```js
// в компоненте
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Да' : 'Нет'
}
```

</div>

Вместо вычисляемого свойства мы можем определить ту же функцию, что и метод. Что касается конечного результата, то эти два подхода действительно совершенно одинаковы. Однако разница в том, что **вычисляемые свойства кэшируются на основе их реактивных зависимостей.** Вычисляемое свойство будет повторно анализироваться только тогда, когда некоторые из его реактивных зависимостей изменятся. Это означает, что пока `author.books` не изменился, множественный доступ к `publishedBooksMessage` немедленно вернет ранее вычисленный результат без необходимости повторного запуска геттера.

Это также означает, что следующее вычисляемое свойство никогда не будет обновляться, поскольку `Date.now()` не является реактивной зависимостью:

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

Для сравнения, вызов метода **всегда** запускает функцию всякий раз, когда происходит повторная отрисовка.

Зачем нам кэширование? Представьте, что у нас есть дорогостоящий `список` вычисляемых свойств, который требует циклического перебора огромного массива и выполнения большого количества вычислений. Тогда у нас могут быть другие вычисляемые свойства, которые, в свою очередь, зависят от `списка`. Без кэширования мы бы выполняли метод получения `списка` намного больше раз, чем необходимо! В случаях, когда вам не требуется кэширование, вместо этого используйте вызов метода.

## Записываемые вычисляемые свойства {#writable-computed}

Вычисляемые свойства по умолчанию доступны только для получения. Если вы попытаетесь присвоить новое значение вычисляемому свойству, вы получите предупреждение во время выполнения. В редких случаях, когда вам нужно «записываемое» вычисляемое свойство, вы можете создать его, предоставив как метод получения (геттер), так и метод установки (сеттер):

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // геттер
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // сеттер
      set(newValue) {
        // Примечание: используем синтаксис деструктурирующего присваивания
        ;[this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

Теперь, когда вы запускаете `this.fullName = 'Джон Доу'`, будет вызван сеттер, а `this.firstName` и `this.lastName` будут обновлены соответственно.

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // геттер
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // сеттер
  set(newValue) {
    // Примечание: используем синтаксис деструктурирующего присваивания
    ;[firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Теперь, когда вы запускаете `fullName.value = 'Джон Доу'`, будет вызван сеттер, а `firstName` и `lastName` будут обновлены соответственно.

</div>

## Получение предыдущего значения {#previous}

- Поддерживается только в версии 3.4+

<p class="options-api">
Если вам понадобится, вы можете получить предыдущее значение, возвращённое вычисляемым свойством, обратившись ко второму аргументу геттера:
</p>

<p class="composition-api">
Если вам понадобится, вы можете получить предыдущее значение, возвращённое вычисляемым свойством, обратившись к первому аргументу геттера:
</p>

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    // Это вычисление вернёт значение count, если оно меньше или равно 3.
    // Когда count будет >=4, будет возвращено последнее значение, которое выполнило наше условие
    // пока счетчик не станет меньше или равен 3
    alwaysSmall(_, previous) {
      if (this.count <= 3) {
        return this.count;
      }

      return previous;
    }
  }
}
```
</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

// Это вычисление вернёт значение count, если оно меньше или равно 3.
// Когда count будет >=4, будет возвращено последнее значение, которое выполнило наше условие
// пока счетчик не станет меньше или равен 3
const alwaysSmall = computed((previous) => {
  if (count.value <= 3) {
    return count.value;
  }

  return previous;
})
</script>
```
</div>

Если вы используете вычисляемое свойство с возможностью записи:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 2
    }
  },
  computed: {
    alwaysSmall: {
      get(_, previous) {
        if (this.count <= 3) {
          return this.count;
        }

        return previous;
      },
      set(newValue) {
        this.count = newValue * 2;
      }
    }
  }
}
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(2)

const alwaysSmall = computed({
  get(previous) {
    if (count.value <= 3) {
      return count.value;
    }

    return previous;
  },
  set(newValue) {
    count.value = newValue * 2;
  }
})
</script>
```

</div>

## Лучшие практики {#best-practices}

### Геттеры не должны иметь побочных эффектов {#getters-should-be-side-effect-free}

Важно помнить, что вычисляемые функции-геттеры должны выполнять только чистые вычисления и не иметь побочных эффектов. Например, **не делайте асинхронные запросы и не изменяйте DOM внутри вычисляемого метода получения!** Думайте о вычисляемом свойстве как о декларативно описывающем способ получения значения на основе других значений — его единственной обязанностью должно быть вычисление и возврат этого значения. Позже в руководстве мы обсудим, как мы можем выполнять побочные эффекты в ответ на изменения состояния с помощью [наблюдателей](./watchers).

### Избегайте изменения вычисляемого значения {#avoid-mutating-computed-value}

Возвращаемое значение вычисляемого свойства является производным состоянием. Думайте об этом как о временном снимке: каждый раз, когда изменяется исходное состояние, создается новый снимок. Изменять снимок не имеет смысла, поэтому вычисляемое возвращаемое значение следует рассматривать как доступное только для чтения и никогда не изменять — вместо этого обновите исходное состояние, от которого оно зависит, чтобы инициировать новые вычисления.
