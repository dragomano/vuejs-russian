# Основы компонентов {#components-basics}

Компоненты позволяют нам разделить пользовательский интерфейс на независимые и многократно используемые части и думать о каждой части отдельно. Обычно приложение организовано в виде дерева вложенных друг в друга компонентов:

![Дерево компонентов](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Это очень похоже на то, как мы вкладываем родные HTML-элементы, но Vue реализует собственную модель компонентов, которая позволяет нам инкапсулировать пользовательский контент и логику в каждый компонент. Vue также отлично сочетается с нативными веб-компонентами. Если вам интересно, как соотносятся компоненты Vue и нативные веб-компоненты, [подробнее читайте здесь](/guide/extras/web-components).

## Определение компонента {#defining-a-component}

При использовании этапа сборки мы обычно определяем каждый компонент Vue в отдельном файле с расширением `.vue` — так называемый [однофайловый компонент](/guide/scaling-up/sfc) (сокращённо SFC):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Ты нажал на меня {{ count }} раз.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Ты нажал на меня {{ count }} раз.</button>
</template>
```

</div>

Если не использовать этап сборки, компонент Vue можно определить как обычный объект JavaScript, содержащий специфические для Vue параметры:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Ты нажал на меня {{ count }} раз
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      Ты нажал на меня {{ count }} раз
    </button>`
  // Также можно настроить таргетинг на шаблон в DOM:
  // template: '#my-template-element'
}
```

</div>

Шаблон вставляется сюда в виде строки JavaScript, которую Vue компилирует на лету. Вы также можете использовать селектор ID, указывающий на элемент (обычно это собственные элементы `<template>`) — Vue будет использовать его содержимое в качестве источника шаблона.

В приведённом выше примере определяется один компонент и экспортируется в файл `.js` по умолчанию, но вы можете использовать именованный экспорт для экспорта нескольких компонентов из одного и того же файла.

## Использование компонента {#using-a-component}

:::tip Примечание
До конца этого руководства мы будем использовать синтаксис SFC — независимо от того, используете вы этап сборки или нет. В разделе [Примеры](/examples/) показано использование компонентов в обоих сценариях.
:::

Чтобы использовать дочерний компонент, нам нужно импортировать его в родительский компонент. Если мы поместили наш компонент счётчика в файл `ButtonCounter.vue`, то компонент будет экспортирован в файл по умолчанию:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Вот дочерний компонент!</h1>
  <ButtonCounter />
</template>
```

Чтобы импортированный компонент появился в нашем шаблоне, нам нужно [зарегистрировать](/guide/components/registration) его с помощью свойства `components`. После этого компонент будет доступен в виде тега по ключу, под которым он зарегистрирован.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Вот дочерний компонент!</h1>
  <ButtonCounter />
</template>
```

С помощью `<script setup>` импортированные компоненты автоматически становятся доступными для шаблона.

</div>

Также можно глобально зарегистрировать компонент, сделав его доступным для всех компонентов данного приложения без необходимости импортировать его. Плюсы и минусы глобальной регистрации рассматривается в специальном разделе [Регистрация компонентов](/guide/components/registration).

Компоненты можно использовать сколько угодно раз:

```vue-html
<h1>Здесь много дочерних компонентов!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Обратите внимание, что при нажатии на кнопки каждая из них ведет свой собственный, отдельный `count`. Это происходит потому, что каждый раз, когда вы используете компонент, создается его новый **экземпляр**.

В SFC рекомендуется использовать имена тегов в регистре `PascalCase` для дочерних компонентов, чтобы отличить их от собственных HTML-элементов. Хотя в родном HTML имена тегов не чувствительны к регистру, Vue SFC — это скомпилированный формат, поэтому мы можем использовать в нем имена тегов, чувствительные к регистру. Мы также можем использовать `/>` для закрытия тега.

Если вы создаете свои шаблоны непосредственно в DOM (например, как содержимое собственного элемента `<template>`), шаблон будет подчиняться собственному поведению браузера при разборе HTML. В таких случаях необходимо использовать `kebab-case` и явные закрывающие теги для компонентов:

```vue-html
<!-- если этот шаблон записан в DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Подробнее см. в разделе [Предостережения по разбору шаблонов в DOM](#in-dom-template-parsing-caveats).

## Передача параметров {#passing-props}

Если мы создаем блог, то нам, скорее всего, понадобится компонент, представляющий запись в блоге. Мы хотим, чтобы все посты в блоге имели одинаковое визуальное оформление, но разное содержание. Такой компонент не будет полезен, если вы не сможете передать ему данные, такие как название и содержание конкретного поста, который мы хотим отобразить. Вот тут-то и пригодятся параметры.

Входные параметры — это пользовательские атрибуты, которые вы можете зарегистрировать для компонента. Чтобы передать заголовок компоненту blog post, мы должны объявить его в списке принимаемых компонентом параметров, используя <span class="options-api"> свойство [`props`](/api/options-state#props)</span><span class="composition-api">макрос [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Когда значение передается в атрибут `props`, оно становится свойством данного экземпляра компонента. Значение этого свойства доступно в шаблоне и в контексте `this` компонента, как и любое другое свойство компонента.

</div>
<div class="composition-api">

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` — это макрос компилятора, который доступен только внутри `<script setup>` и не нуждается в явном импорте. Объявленные параметры автоматически отображаются в шаблоне. `defineProps` также возвращает объект, содержащий все переданные компоненту параметры, чтобы при необходимости мы могли получить к ним доступ в JavaScript:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Смотрите также: [Типизация входных параметров компонента](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Если вы не используете `<script setup>`, параметры должны быть объявлены с помощью свойства `props`, и объект `props` будет передан в `setup()` в качестве первого аргумента:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Компонент может иметь сколько угодно параметров, и по умолчанию любому параметру может быть передано любое значение.

После регистрации параметра вы можете передавать ему данные в качестве пользовательского атрибута, например, так:

```vue-html
<BlogPost title="Мое путешествие с Vue" />
<BlogPost title="Ведение блога с помощью Vue" />
<BlogPost title="Почему Vue так интересен" />
```

Однако в обычном приложении у вас, скорее всего, будет массив постов в родительском компоненте:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'Мое путешествие с Vue' },
        { id: 2, title: 'Ведение блога с помощью Vue' },
        { id: 3, title: 'Почему Vue так интересен' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'Мое путешествие с Vue' },
  { id: 2, title: 'Ведение блога с помощью Vue' },
  { id: 3, title: 'Почему Vue так интересен' }
])
```

</div>

Затем нужно вывести компонент для каждого из них, используя `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Обратите внимание, как [синтаксис `v-bind`](/api/built-in-directives#v-bind) (`:title="post.title"`) используется для передачи динамических значений параметров. Это особенно полезно, когда вы не знаете заранее, какой именно контент вы собираетесь отображать.

На данный момент это всё, что вам нужно знать о входных параметрах, но если вы дочитали эту страницу до конца и чувствуете себя комфортно, рекомендуем вернуться позже, чтобы прочитать полное руководство по [Входным параметрам](/guide/components/props).

## Прослушивание событий {#listening-to-events}

По мере развития нашего компонента `<BlogPost>` некоторые функции могут потребовать обратной связи с родительским компонентом. Например, мы можем решить включить функцию доступности, чтобы увеличить текст записей в блоге, оставив при этом размер остальной части страницы по умолчанию.

В родителе мы можем поддержать эту возможность, добавив свойство `postFontSize` через <span class="options-api">data</span><span class="composition-api">ref</span>:

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Это можно использовать в шаблоне для управления размером шрифта всех записей блога:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Теперь давайте добавим кнопку в шаблон компонента `<BlogPost>`.:

```vue{5}
<!-- BlogPost.vue, пропускаем <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Увеличить текст</button>
  </div>
</template>
```

Кнопка ещё ничего не делает — мы хотим, чтобы нажатие на нее сообщило родителю, что он должен увеличить текст всех сообщений. Для решения этой проблемы в компонентах предусмотрена собственная система событий. Родитель может выбрать прослушивание любого события на экземпляре дочернего компонента с помощью `v-on` или `@`, точно так же, как и в случае с собственным событием DOM:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Затем дочерний компонент может вызвать событие на себя, вызвав встроенный метод [**`$emit`**](/api/component-instance#emit), передав имя события:

```vue{5}
<!-- BlogPost.vue, пропускаем <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Увеличить текст</button>
  </div>
</template>
```

Благодаря слушателю `@enlarge-text="postFontSize += 0.1"` родитель получит событие и обновит значение `postFontSize`.

<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Мы можем опционально объявить испускаемые события с помощью <span class="options-api">свойства [`emits`](/api/options-state#emits)</span><span class="composition-api">макроса [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{5}
<!-- BlogPost.vue -->
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{4}
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Здесь документируются и опционально [проверяются](/guide/components/events#events-validation) все события, которые испускает компонент. Это также позволяет Vue избежать неявного применения их в качестве нативных слушателей к корневому элементу дочернего компонента.

<div class="composition-api">

Как и `defineProps`, `defineEmits` используется только в `<script setup>` и не нуждается в импорте. Он возвращает функцию `emit`, которая эквивалентна методу `$emit`. Его можно использовать для эмиссии событий в секции `<script setup>` компонента, где `$emit` недоступен напрямую:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Смотрите также: [Типизация событий компонента](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Если вы не используете `<script setup>`, вы можете объявить испускаемые события с помощью опции `emits`. Вы можете получить доступ к функции `emit` как к свойству контекста установки (передается в `setup()` в качестве второго аргумента):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

На данный момент это всё, что вам нужно знать о событиях пользовательских компонентов, но если вы закончили читать эту страницу и чувствуете себя комфортно, рекомендуем вернуться позже, чтобы прочитать полное руководство по [Пользовательским событиям](/guide/components/events).

## Распространение контента с помощью слотов {#content-distribution-with-slots}

Как и в случае с HTML-элементами, часто бывает полезно передать компоненту содержимое, например, так:

```vue-html
<AlertBox>
  Случилось что-то плохое.
</AlertBox>
```

Что может выглядеть примерно так:

:::danger Это ошибка для демонстрационных целей
Случилось что-то плохое.
:::

Этого можно добиться с помощью пользовательского элемента Vue `<slot>`:

```vue{4}
<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>Это ошибка для демонстрационных целей</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Как вы видите выше, мы используем `<slot>` как место, куда мы хотим поместить содержимое — и это всё. Мы закончили!

<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

На данный момент это всё, что вам нужно знать о слотах, но если вы закончили читать эту страницу и чувствуете себя комфортно, рекомендуем вернуться позже, чтобы прочитать полное руководство по [Слотам](/guide/components/slots).

## Динамические компоненты {#dynamic-components}

Иногда полезно динамически переключаться между компонентами, например, в интерфейсе с вкладками:

<div class="options-api">

[Открыть пример в Песочнице](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Открыть пример в Песочнице](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

Вышеописанное стало возможным благодаря элементу Vue `<component>` со специальным атрибутом `is`:

<div class="options-api">

```vue-html
<!-- Компонент изменяется при изменении CurrentTab -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- Компонент изменяется при изменении CurrentTab -->
<component :is="tabs[currentTab]"></component>
```

</div>

В приведённом выше примере значение, переданное в `:is`, может содержать либо:

- строку с именем зарегистрированного компонента, ИЛИ
- фактический импортированный объект компонента

Вы также можете использовать атрибут `is` для создания обычных HTML-элементов.

При переключении между несколькими компонентами с помощью `<component :is="...">` каждый компонент будет размонтирован при переключении на следующий. Мы можем заставить неактивные компоненты оставаться «живыми» с помощью встроенного компонента [`<KeepAlive>`](/guide/built-ins/keep-alive).

## Предостережения по разбору шаблонов в DOM {#in-dom-template-parsing-caveats}

Если вы пишете свои шаблоны Vue непосредственно в DOM, Vue придется получить строку шаблона из DOM. Это приводит к некоторым оговоркам, связанным с собственным поведением браузеров при разборе HTML.

:::tip Примечание
Следует отметить, что ограничения, рассмотренные ниже, применимы только в том случае, если вы пишете свои шаблоны непосредственно в DOM. Они НЕ применяются, если вы используете шаблоны строк из следующих источников:

- Однофайловые компоненты
- Вложенные строки шаблонов (например, `template: '...'`)
- `<script type="text/x-template">`
  :::

### Нечувствительность к регистру {#case-insensitivity}

HTML-теги и имена атрибутов нечувствительны к регистру, поэтому браузеры интерпретируют любые символы верхнего регистра как строчные. Это означает, что когда вы используете шаблоны в DOM, имена компонентов PascalCase и имена свойств в верблюжьем регистре или имена событий `v-on` должны использовать их эквиваленты в кебабном регистре (с разделителями-дефисами):

```js
// camelCase (верблюжий регистр) в JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- kebab-case в HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Самозакрывающиеся теги {#self-closing-tags}

В предыдущих примерах кода мы уже использовали самозакрывающиеся теги для компонентов:

```vue-html
<MyComponent />
```

Это связано с тем, что анализатор шаблонов Vue рассматривает `/>` как указание на завершение любого тега, независимо от его типа.

Однако в шаблонах внутри DOM мы всегда должны включать явные закрывающие теги:

```vue-html
<my-component></my-component>
```

Это связано с тем, что спецификация HTML позволяет опускать закрывающие теги только для [нескольких определенных элементов](https://html.spec.whatwg.org/multipage/syntax.html#void-elements), наиболее распространенными из которых являются `<input>` и `<img>`. Для всех остальных элементов, если вы опустите закрывающий тег, родной HTML-парсер будет считать, что вы не завершили открывающий тег. Например, следующий фрагмент:

```vue-html
<my-component /> <!-- мы намерены закрыть тег здесь... -->
<span>привет</span>
```

будет разобран как:

```vue-html
<my-component>
  <span>привет</span>
</my-component> <!-- но браузер закроет его здесь. -->
```

### Ограничения на размещение элементов {#element-placement-restrictions}

Некоторые элементы HTML, такие как `<ul>`, `<ol>`, `<table>` и `<select>`, имеют ограничения на то, какие элементы могут появляться внутри них, а некоторые элементы, такие как `<li>`, `<tr>` и `<option>` могут появляться только внутри некоторых других элементов.

Это приведет к проблемам при использовании компонентов с элементами, имеющими такие ограничения. Например:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Пользовательский компонент `<blog-post-row>` будет поднят как недопустимый контент, что приведет к ошибкам в конечном отображаемом выводе. Мы можем использовать специальный атрибут [`is`](/api/built-in-special-attributes#is) в качестве обходного пути:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip Примечание
При использовании в собственных HTML-элементах значение `is` должно иметь префикс `vue:`, чтобы интерпретироваться как компонент Vue. Это необходимо, чтобы избежать путаницы с нативными [настраиваемыми встроенными элементами](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

Это всё, что вам нужно знать о предостережениях по разбору шаблонов в DOM на данный момент — и, собственно, завершение _Основ_ Vue. Поздравляю! Нам предстоит ещё многому научиться, но для начала мы рекомендуем сделать перерыв и поиграть с Vue самостоятельно — построить что-нибудь интересное или посмотреть некоторые из [примеров](/examples/), если вы этого ещё не сделали.

Как только вы почувствуете себя комфортно после полученных знаний, переходите к изучению руководства, чтобы узнать больше о компонентах.
