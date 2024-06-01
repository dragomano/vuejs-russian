---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Быстрый старт {#quick-start}

## Попробуйте Vue онлайн {#try-vue-online}

- Чтобы быстро познакомиться с Vue, вы можете испытать его прямо в нашей [Песочнице](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Если вы предпочитаете простую HTML-установку без каких-либо шагов по сборке, вы можете использовать этот [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) в качестве отправной точки.

- Если вы уже знакомы с Node.js и концепцией инструментов сборки, вы также можете попробовать полную настройку сборки прямо в браузере на [StackBlitz](https://vite.new/vue).

## Создание приложения {#creating-a-vue-application}

:::tip Предварительные условия

- Знакомство с командной строкой
- Установка [Node.js](https://nodejs.org/) версии 18.3 или выше
  :::

В этом разделе мы расскажем, как создать [одностраничное приложение](/guide/extras/ways-of-using-vue#single-page-application-spa) Vue на вашей локальной машине. Созданный проект будет использовать настройку сборки на основе [Vite](https://vitejs.dev) и позволит нам использовать [однофайловые компоненты](/guide/scaling-up/sfc) (SFCs).

Убедитесь, что у вас установлена актуальная версия [Node.js](https://nodejs.org/), а ваш текущий рабочий каталог — тот, в котором вы собираетесь создать проект. Выполните следующую команду в командной строке (без знака `$`):

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

```sh
$ npm create vue@latest
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

```sh
$ pnpm create vue@latest
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

```sh
$ yarn create vue@latest
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

```sh
$ bun create vue@latest
```

  </VTCodeGroupTab>
</VTCodeGroup>

Эта команда установит и выполнит [create-vue](https://github.com/vuejs/create-vue), официальный инструмент для создания заготовок проектов Vue. Вам будет предложено выбрать несколько дополнительных функций, таких как TypeScript и поддержка тестирования:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Nightwatch / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… No / <span style="color:#89DDFF;text-decoration:underline">Yes</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue DevTools 7 extension for debugging? (experimental) <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Если вы не уверены в выборе, просто выберите `No`, нажав Enter. После создания проекта следуйте инструкциям по установке зависимостей и запуску dev-сервера:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

```sh-vue
$ cd {{'<your-project-name>'}}
$ npm install
$ npm run dev
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

```sh-vue
$ cd {{'<your-project-name>'}}
$ pnpm install
$ pnpm run dev
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

```sh-vue
$ cd {{'<your-project-name>'}}
$ yarn
$ yarn dev
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

```sh-vue
$ cd {{'<your-project-name>'}}
$ bun install
$ bun run dev
```

  </VTCodeGroupTab>
</VTCodeGroup>

Теперь у вас должен работать ваш первый проект Vue! Обратите внимание, что примеры компонентов в сгенерированном проекте написаны с использованием [Composition API](/guide/introduction#composition-api) и `<script setup>`, а не [Options API](/guide/introduction#options-api). Вот несколько дополнительных советов:

- Рекомендуемая настройка IDE — [Visual Studio Code](https://code.visualstudio.com/) + [расширение Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Если вы используете другие редакторы, обратитесь к разделу [Поддержка IDE](/guide/scaling-up/tooling#ide-support).
- Более подробные сведения об инструментах, включая интеграцию с внутренними фреймворками, обсуждаются в [Руководстве по инструментам](/guide/scaling-up/tooling).
- Чтобы узнать больше о базовом инструменте сборки Vite, ознакомьтесь с [Документацией Vite](https://vitejs.dev).
- Если вы решили использовать TypeScript, ознакомьтесь с [Руководством по использованию TypeScript](typescript/overview).

Когда вы будете готовы отправить свое приложение в производство, выполните следующие действия:

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

```sh
$ npm run build
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

```sh
$ pnpm run build
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

```sh
$ yarn build
```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

```sh
$ bun run build
```

  </VTCodeGroupTab>
</VTCodeGroup>

Это создаст готовую к производству сборку вашего приложения в директории проекта `./dist`. Ознакомьтесь с [Руководством по производственному развёртыванию](/guide/best-practices/production-deployment), чтобы узнать больше о доставке приложения в производство.

[Следующие шаги >](#next-steps)

## Использование Vue из CDN {#using-vue-from-cdn}

Можно использовать Vue непосредственно из CDN через тег `script`:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Здесь мы используем [unpkg](https://unpkg.com/), но вы также можете использовать любую CDN, которая обслуживает пакеты npm, например [jsdelivr](https://www.jsdelivr.com/package/npm/vue) или [cdnjs](https://cdnjs.com/libraries/vue). Конечно, можно просто скачать этот файл и подключить его самостоятельно.

При использовании Vue из CDN «этап сборки» отсутствует. Это значительно упрощает настройку и подходит для улучшения статического HTML или интеграции с внутренним фреймворком. Однако вы не сможете использовать синтаксис однофайловых компонентов (SFC).

### Использование глобальной сборки {#using-the-global-build}

По приведённой выше ссылке загружается _глобальная сборка_ Vue, в которой все API верхнего уровня раскрываются как свойства глобального объекта `Vue`. Вот полный пример с использованием глобальной сборки:

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: 'Привет, Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Привет, Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip Совет
Многие примеры для Composition API в руководстве будут использовать синтаксис `<script setup>`, который требует инструментов сборки. Если вы собираетесь использовать Composition API без этапа сборки, обратитесь к использованию опции [`setup()`](/api/composition-api-setup).
:::

</div>

### Использование сборки модуля ES {#using-the-es-module-build}

В остальной части документации мы будем использовать преимущественно синтаксис [модулей ES](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules). Большинство современных браузеров теперь поддерживают ES-модули нативно, поэтому мы можем использовать Vue из CDN через нативные ES-модули, как здесь:

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: 'Привет, Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Привет, Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Обратите внимание, что мы используем `<script type="module">`, а импортированный CDN URL указывает на **сборку модулей ES** Vue.

<div class="options-api">

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Карты импорта {#enabling-import-maps}

В приведённом выше примере мы импортируем из полного URL CDN, но в остальной части документации вы увидите код, подобный этому:

```js
import { createApp } from 'vue'
```

Мы можем указать браузеру, откуда импортировать `vue`, используя [карты импорта](https://caniuse.com/import-maps):

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Привет, Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Привет, Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Демонстрация в Codepen](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

Вы также можете добавить записи для других зависимостей в карту импорта — но убедитесь, что они указывают на версию ES-модулей библиотеки, которую вы собираетесь использовать.

:::tip Поддержка браузера для импорта карт
Импорт карт — относительно новая функция браузера. Убедитесь, что используете браузер в пределах его [диапазона поддержки](https://caniuse.com/import-maps). В частности, он поддерживается только в Safari 16.4+.
:::

:::warning Примечание по использованию в производстве
В примерах использована сборка Vue для разработки - если вы собираетесь использовать Vue из CDN в производстве, обязательно ознакомьтесь с [Руководством по производственному развёртыванию](/guide/best-practices/production-deployment#without-build-tools).

Хотя Vue можно использовать и без системы сборки, альтернативным подходом может стать использование [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue), который лучше подходит для контекста, где вместо него может быть использован [`jquery/jquery`](https://github.com/jquery/jquery) (в прошлом) или [`alpinejs/alpine`](https://alpinejs.dragomano.ru) (в настоящем).
:::

### Разделение модулей {#splitting-up-the-modules}

По мере углубления в руководство нам может понадобиться разделить наш код на отдельные файлы JavaScript, чтобы ими было легче управлять. Например:

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>Счётчик {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>Счётчик {{ count }}</div>`
}
```

</div>

Если вы напрямую откроете приведенный выше `index.html` в браузере, то обнаружите, что он выдает ошибку, поскольку модули ES не могут работать по протоколу `file://`, который браузер использует, когда вы открываете локальный файл.

По соображениям безопасности модули ES могут работать только по протоколу `http://`, который используется браузерами при открытии страниц в Интернете. Для того чтобы модули ES работали на нашей локальной машине, нам нужно обслуживать `index.html` по протоколу `http://` с помощью локального HTTP-сервера.

Чтобы запустить локальный HTTP-сервер, сначала убедитесь, что у вас установлен [Node.js](https://nodejs.org/en/), затем запустите `npx serve` из командной строки в той же директории, где находится ваш HTML-файл. Вы также можете использовать любой другой HTTP-сервер, который может обслуживать статические файлы с правильными типами MIME.

Вы могли заметить, что шаблон импортируемого компонента вставляется в виде строки JavaScript. Если вы используете VS Code, вы можете установить расширение [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) и префиксировать строки комментарием `/*html*/`, чтобы получить подсветку синтаксиса для них.

## Следующие шаги {#next-steps}

Если вы пропустили [Введение](/guide/introduction), мы настоятельно рекомендуем прочитать его, прежде чем переходить к остальной части документации.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Продолжайте изучать руководство</p>
    <p class="next-steps-caption">В руководстве подробно рассматривается каждый аспект системы.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Попробуйте учебник</p>
    <p class="next-steps-caption">Для тех, кто предпочитает учиться на практике.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Посмотрите примеры</p>
    <p class="next-steps-caption">Изучите примеры основных функций и общих задач пользовательского интерфейса.</p>
  </a>
</div>
