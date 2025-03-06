# Provide / Inject {#provide-inject}

> Эта страница предполагает, что вы уже прочитали [Основы компонентов](/guide/essentials/component-basics).

## Сквозная передача пропсов {#prop-drilling}

Обычно, когда нам нужно передать данные от родительского компонента к дочернему, мы используем [пропсы](/guide/components/props). Однако представьте себе случай, когда у нас большое дерево компонентов, и глубоко вложенному компоненту нужно что-то от компонента дальнего предка. При использовании только пропсов нам пришлось бы передавать один и тот же пропс по всей родительской цепочке:

![диаграмма сквозной передачи пропсов](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Обратите внимание, что хотя компонент `<Footer>` может вообще не заботиться об этих пропсах, ему всё равно нужно объявить и передать их, чтобы `<DeepChild>` мог получить к ним доступ. Если родительская цепочка длиннее, то на пути к ней будет затронуто больше компонентов. Это называется _сквозной передачей_. и с ним определённо не очень весело иметь дело.

Мы можем решить проблему сквозной передачи пропсов с помощью `provide` и `inject`. Родительский компонент может служить **провайдером зависимостей** для всех своих потомков. Любой компонент в дереве-потомке, независимо от его глубины, может **инжектировать** зависимости, предоставленные компонентами, расположенными выше в его родительской цепочке.

![Схема Provide/inject](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Чтобы предоставить данные потомкам компонента, используйте функцию [`provide()`](/api/composition-api-dependency-injection#provide):

```vue
<script setup>
import { provide } from 'vue'

provide(/* ключ */ 'message', /* значение */ 'hello!')
</script>
```

Если вы не используете `<script setup>`, убедитесь, что `provide()` вызывается синхронно внутри `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* ключ */ 'message', /* значение */ 'hello!')
  }
}
```

Функция `provide()` принимает два аргумента. Первый аргумент называется **ключ инъекции**, который может быть строкой или `символом`. Ключ инъекции используется компонентами-потомками для поиска нужного значения для инъекции. Один компонент может вызывать `provide()` несколько раз с разными ключами инъекции для предоставления различных значений.

Второй аргумент — это предоставленное значение. Значение может быть любого типа, включая реактивное состояние, такое как refs:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Предоставление реактивных значений позволяет компонентам-потомкам, использующим предоставленное значение, устанавливать реактивное соединение с компонентом-провайдером.

</div>

<div class="options-api">

Чтобы предоставить данные потомкам компонента, используйте опцию [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'привет!'
  }
}
```

Для каждого свойства в объекте `provide` ключ используется дочерними компонентами для поиска нужного значения для инъекции, а значение — это то, что в итоге будет инъецировано.

Если нам нужно предоставить состояние экземпляра, например, данные, объявленные через `data()`, то `provide` должен использовать значение функции:

```js{7-12}
export default {
  data() {
    return {
      message: 'привет!'
    }
  },
  provide() {
    // используем синтаксис функции, чтобы получить доступ к `this`.
    return {
      message: this.message
    }
  }
}
```

Однако обратите внимание, что это **не** делает инъекцию реактивной. О том, как [сделать инъекции реактивными](#working-with-reactivity), мы поговорим ниже.

</div>

## Provide на уровне приложения {#app-level-provide}

Помимо предоставления данных в компоненте, мы также можем предоставлять их на уровне приложения:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* ключ */ 'message', /* значение */ 'hello!')
```

Предоставления на уровне приложения доступны для всех компонентов, отображаемых в приложении. Это особенно полезно при написании [плагинов](/guide/reusability/plugins), так как плагины обычно не могут предоставлять значения с помощью компонентов.

## Inject {#inject}

<div class="composition-api">

Чтобы внедрить данные, предоставленные компонентом-предком, используйте функцию [`inject()`](/api/composition-api-dependency-injection#inject):

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Если предоставленное значение является ссылкой, оно будет инжектировано как есть и **не** будет автоматически разворачиваться. Это позволяет компоненту-инжектору сохранять реактивную связь с компонентом-провайдером.

[Полный пример provide + inject с реактивностью](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Опять же, если не используется `<script setup>`, `inject()` следует вызывать синхронно только внутри `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Чтобы внедрить данные, предоставленные компонентом-предком, используйте опцию [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // инжектированное значение
  }
}
```

Инъекции разрешаются **перед** собственным состоянием компонента, поэтому вы можете получить доступ к инжектированным свойствам в `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // исходные данные на основе инжектированного значения
      fullMessage: this.message
    }
  }
}
```

Если несколько родителей предоставляют данные с одинаковым ключом, `inject` будет использовать данные от первого родителя в цепочке предков.

[Полный пример `provide` + `inject`](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Инжектирование псевдонимов \* {#injection-aliasing}

При использовании синтаксиса массива для `inject`, инжектируемые свойства отображаются на экземпляре компонента по одному и тому же ключу. В приведённом выше примере свойство было предоставлено под ключом `"message"` и инжектировано как `this.message`. Локальный ключ — это тот же ключ, что и ключ инъекции.

Если мы хотим внедрить свойство, используя другой локальный ключ, нам нужно использовать объектный синтаксис для опции `inject`:

```js
export default {
  inject: {
    /* локальный ключ */ localMessage: {
      from: /* инжектируемый ключ */ 'message'
    }
  }
}
```

Здесь компонент найдет свойство с ключом `"message"`, а затем выставит его как `this.localMessage`.

</div>

### Значения по умолчанию для инъекций {#injection-default-values}

По умолчанию `inject` предполагает, что инжектируемый ключ предоставляется где-то в родительской цепочке. В случае, если ключ не указан, будет выдано предупреждение во время выполнения.

Если мы хотим, чтобы инжектируемое свойство работало с необязательными провайдерами, нам нужно объявить значение по умолчанию, аналогично props:

<div class="composition-api">

```js
// `value` будет содержать "значение по умолчанию"
// если не было предоставлено данных, соответствующих «сообщению»
const value = inject('сообщение', 'значение по умолчанию')
```

В некоторых случаях значение по умолчанию может потребоваться создать путём вызова функции или инстанцирования нового класса. Чтобы избежать лишних вычислений или побочных эффектов в случае, если необязательное значение не используется, мы можем использовать фабричную функцию для создания значения по умолчанию:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Третий параметр указывает, что значение по умолчанию должно рассматриваться как фабричная функция.

</div>

<div class="options-api">

```js
export default {
  // Синтаксис объекта необходим при объявлении значений по умолчанию для инъекций
  inject: {
    message: {
      from: 'message', // это необязательно, если вы используете один и тот же ключ для инъекций
      default: 'default value'
    },
    user: {
      // используйте фабричную функцию для непервичных значений, которые дорого создавать,
      // или для значений, которые должны быть уникальными для каждого экземпляра компонента.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Работа с реактивностью {#working-with-reactivity}

<div class="composition-api">

При использовании реактивного предоставления / инъекции значений, **рекомендуется держать любые мутации реактивного состояния внутри _провайдера_, когда это возможно**. Это гарантирует, что предоставленное состояние и его возможные мутации будут находиться в одном компоненте, что упрощает их поддержку в будущем.

Бывают случаи, когда нам необходимо обновить данные компонента-инжектора. В таких случаях мы рекомендуем предоставлять функцию, которая отвечает за изменение состояния:

```vue{7-9,13}
<!-- внутри компонента провайдера -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- в компоненте инжектора -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Наконец, вы можете обернуть предоставленное значение с помощью [`readonly()`](/api/reactivity-core#readonly), если хотите убедиться, что данные, переданные через `provide`, не могут быть изменены компонентом-инжектором.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Чтобы инъекции были реактивно связаны с провайдером, нам нужно предоставить вычисляемое свойство с помощью функции [computed()](/api/reactivity-core#computed):

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // явно предоставляем вычисляемое свойство
      message: computed(() => this.message)
    }
  }
}
```

[Полный пример provide + inject с реактивностью](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

Функция `computed()` обычно используется в компонентах Composition API, но также может быть использована для дополнения некоторых случаев использования в Options API. Вы можете узнать больше о его использовании, прочитав [Основы реактивности](/guide/essentials/reactivity-fundamentals) и [Вычисляемые свойства](/guide/essentials/computed) переключив стиль API на Composition API.

</div>

## Работа с символьными клавишами {#working-with-symbol-keys}

До сих пор в примерах мы использовали ключи для инъекции строк. Если вы работаете в большом приложении с большим количеством поставщиков зависимостей или создаете компоненты, которые будут использоваться другими разработчиками, лучше всего использовать ключи инъекции Symbol, чтобы избежать возможных коллизий.

Рекомендуется экспортировать символы в отдельный файл:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// в компоненте провайдера
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* данные для предоставления */
})
```

```js
// в компоненте инжектора
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

См. также: [Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// в компоненте провайдера
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* данные для предоставления */
      }
    }
  }
}
```

```js
// в компоненте инжектора
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
