---
footer: false
---

# Введение {#introduction}

:::info Вы читаете документацию по Vue 3!

- Поддержка Vue 2 закончилась 31 декабря 2023 года. Подробнее о [о расширенной долгосрочной поддержке Vue 2](https://v2.vuejs.org/lts/).
- Обновляетесь с Vue 2? Ознакомьтесь с [Руководством по миграции](https://v3-migration.vuejs.org/).
  :::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">Изучайте Vue с помощью видеоуроков на <span>VueMastery.com</span></p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## Что такое Vue? {#what-is-vue}

Vue (произносится /vjuː/, как **view**) — это JavaScript-фреймворк для создания пользовательских интерфейсов. Он построен поверх стандартных HTML, CSS и JavaScript и предоставляет декларативную и компонентную модель программирования, которая поможет вам эффективно разрабатывать пользовательские интерфейсы, как простые, так и сложные.

Вот минимальный пример:

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Счётчик: {{ count }}
  </button>
</div>
```

**Результат**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Счётчик: {{ count }}
  </button>
</div>

Приведённый выше пример демонстрирует две основные возможности Vue:

- **Декларативная отрисовка**: Vue расширяет стандартный HTML синтаксисом шаблонов, который позволяет нам декларативно описывать вывод HTML на основе состояния JavaScript.

- **Реактивность**: Vue автоматически отслеживает изменения состояния JavaScript и эффективно обновляет DOM, когда изменения происходят.

Возможно, у вас уже есть вопросы - не волнуйтесь. Мы рассмотрим все мельчайшие детали в остальной части документации. А пока читайте дальше, чтобы иметь общее представление о том, что предлагает Vue.

:::tip Предварительные условия
Остальная часть документации предполагает базовое знание HTML, CSS и JavaScript. Если вы новичок в фронтенд-разработке, возможно, это не лучшая идея сразу переходить к фреймворку в качестве первого шага — освойте основы, а затем возвращайтесь! Вы можете проверить свой уровень знаний с помощью этих обзоров для [JavaScript](https://developer.mozilla.org/ru/docs/Web/JavaScript/Language_overview), [HTML](https://developer.mozilla.org/ru/docs/Learn/HTML/Introduction_to_HTML) и [CSS](https://developer.mozilla.org/ru/docs/Learn/CSS/First_steps), если необходимо. Предыдущий опыт работы с другими фреймворками помогает, но не обязателен.
:::

## Прогрессивный фреймворк {#the-progressive-framework}

Vue — это фреймворк и экосистема, которая охватывает большинство общих функций, необходимых для разработки фронтенда. Но веб чрезвычайно разнообразен — вещи, которые мы создаем в нем, могут кардинально отличаться по форме и масштабу. Учитывая это, Vue создан для того, чтобы быть гибким и постепенно адаптируемым. В зависимости от вашего сценария использования, Vue можно применять по-разному:

- Улучшение статического HTML без этапа сборки
- Встраивание в качестве веб-компонентов на любой странице
- Одностраничное приложение (SPA)
- Fullstack / серверная отрисовка (SSR)
- Jamstack / генерация статического сайта (SSG)
- Нацеленность на настольные и мобильные компьютеры, WebGL и даже терминал

Если вас пугают эти понятия, не волнуйтесь! Учебник и руководство требуют только базовых знаний HTML и JavaScript, и вы сможете следовать им, не будучи экспертом ни в одной из этих областей.

Если вы опытный разработчик, интересующийся тем, как лучше интегрировать Vue в свой стек, или вам интересно узнать, что означают эти термины, мы обсуждаем их более подробно в [Способах использования Vue](/guide/extras/ways-of-using-vue).

Несмотря на гибкость, основные знания о том, как работает Vue, являются общими для всех этих вариантов использования. Даже если вы сейчас только новичок, знания, полученные на этом пути, останутся полезными, когда вы будете расти для достижения более амбициозных целей в будущем. Если вы опытный пользователь, вы можете выбрать оптимальный способ использования Vue, исходя из проблем, которые вы пытаетесь решить, сохраняя при этом ту же производительность. Вот почему мы называем Vue «прогрессивным фреймворком»: это среда, которая может расти вместе с вами и адаптироваться к вашим потребностям.

## Однофайловые компоненты {#single-file-components}

В большинстве проектов Vue с инструментами сборки мы создаем компоненты Vue, используя HTML-подобный формат файлов, называемый **Single-File Component** (также известный как файлы `*.vue`, сокращенно **SFC**), или _однофайловый компонент_. Vue SFC, как следует из названия, заключает логику компонента (JavaScript), шаблон (HTML) и стили (CSS) в один файл. Вот предыдущий пример, записанный в формате SFC:

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
  <button @click="count++">Счётчик: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Счётчик: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

SFC — это определяющая особенность Vue, и ее рекомендуется использовать для разработки компонентов Vue, **если** ваш вариант использования требует настройки сборки. Вы можете узнать больше о том, [как и почему SFC](/guide/scaling-up/sfc) в соответствующем разделе, а пока просто знайте, что Vue выполнит за вас все настройки инструментов сборки.

## Стили API {#api-styles}

Компоненты Vue могут быть созданы в двух различных стилях API: **Options API** и **Composition API**.

### Options API {#options-api}

С помощью API Options мы определяем логику компонента, используя объект опций, таких как `data`, `methods` и `mounted`. Свойства, определяемые опциями, отображаются через `this` внутри функций, которые указывают на экземпляр компонента:

```vue
<script>
export default {
  // Свойства, возвращаемые из data(), становятся реактивным состоянием
  // и будут доступны через `this`.
  data() {
    return {
      count: 0
    }
  },

  // Методы - это функции, которые изменяют состояние и вызывают обновления.
  // Их можно привязать к шаблонам в качестве обработчиков событий.
  methods: {
    increment() {
      this.count++
    }
  },

  // Хуки вызываются на разных этапах жизненного цикла компонента.
  // Эта функция будет вызвана, когда компонент будет смонтирован.
  mounted() {
    console.log(`Начальное значение: ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Счётчик: {{ count }}</button>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### Composition API {#composition-api}

С помощью Composition API мы определяем логику компонента, используя импортированные API-функции. В SFC с API Composition обычно используется [`<script setup>`](/api/sfc-script-setup). Атрибут `setup` — это подсказка, которая заставляет Vue выполнять преобразования во время компиляции, что позволяет нам использовать Composition API с меньшим количеством шаблонов. Например, импорты и переменные/функции верхнего уровня, объявленные в `<script setup>`, можно напрямую использовать в шаблоне.

Вот тот же компонент, с точно таким же шаблоном, но с использованием Composition API и `<script setup>`:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// реактивное состояние
const count = ref(0)

// функции, изменяющие состояние и запускающие обновления
function increment() {
  count.value++
}

// хуки жизненного цикла
onMounted(() => {
  console.log(`Начальное значение: ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Счётчик: {{ count }}</button>
</template>
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### Что выбрать? {#which-to-choose}

Оба стиля API способны полностью покрыть общие случаи использования. Это разные интерфейсы, работающие на одной и той же базовой системе. Фактически, API Options реализован поверх API Composition! Фундаментальные концепции и знания о Vue являются общими для двух стилей.

В основе API Options лежит концепция «экземпляра компонента» (`this`, как показано в примере), что обычно лучше согласуется с ментальной моделью, основанной на классах, для пользователей, знакомых с концепцией ООП. Кроме того, он более удобен для новичков за счёт абстрагирования от деталей реактивности и организации кода с помощью групп опций.

Composition API ориентирован на объявление переменных реактивного состояния непосредственно в области видимости функции и комбинирование состояния из нескольких функций для решения сложных задач. Он более свободный и требует понимания того, как работает реактивность в Vue, чтобы использовать его эффективно. В свою очередь, его гибкость позволяет использовать более мощные паттерны для организации и повторного использования логики.

Подробнее о сравнении двух стилей и потенциальных преимуществах Composition API можно узнать в [ЧаВо про Composition API](/guide/extras/composition-api-faq).

Если вы новичок в Vue, вот наши общие рекомендации:

- В целях обучения выбирайте тот стиль, который кажется вам более понятным. Опять же, большинство основных концепций являются общими для этих двух стилей. Вы всегда сможете подобрать другой стиль позже.

- Для производственного использования:

  - Выбирайте Options API, если вы не используете инструменты для сборки или планируете использовать Vue в основном в сценариях с низкой сложностью, например, для прогрессивного улучшения.

  - Выбирайте Composition API + однофайловые компоненты, если планируете создавать полноценные приложения на Vue.

На этапе обучения не обязательно придерживаться только одного стиля. В остальной части документации будут приведены примеры кода в обоих стилях, и вы сможете переключаться между ними в любое время с помощью переключателей в блоке **Стиль API** в верхней части левой боковой панели.

## У вас всё ещё есть вопросы? {#still-got-questions}

Загляните в наш [ЧаВо](/about/faq).

## Выберите свой путь обучения {#pick-your-learning-path}

У разных разработчиков разные стили обучения. Не стесняйтесь выбирать тот путь обучения, который вам больше нравится, хотя мы рекомендуем изучить все материалы, если это возможно!

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Попробуйте учебник</p>
    <p class="next-steps-caption">Для тех, кто предпочитает учиться на практике.</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">Прочитайте руководство</p>
    <p class="next-steps-caption">В руководстве подробно рассматривается каждый аспект системы.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Посмотрите примеры</p>
    <p class="next-steps-caption">Изучите примеры основных функций и общих задач пользовательского интерфейса.</p>
  </a>
</div>
