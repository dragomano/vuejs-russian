---
outline: deep
---

# Рендеринг на стороне сервера (SSR) {#server-side-rendering-ssr}

## Обзор {#overview}

### Что такое SSR? {#what-is-ssr}

Vue.js — это фреймворк для создания приложений на стороне клиента. По умолчанию компоненты Vue создают и манипулируют DOM в браузере в качестве вывода. Однако можно также преобразовать те же компоненты в HTML-строки на сервере, отправить их непосредственно в браузер и, наконец, «гидратировать». Статическая разметка превращается в полностью интерактивное приложение на клиенте.

Приложение Vue.js с серверным рендерингом также можно считать «изоморфным» или «универсальный», в том смысле, что большая часть кода вашего приложения выполняется на сервере **и** клиенте.

### Почему SSR? {#why-ssr}

По сравнению с клиентскими одностраничными приложениями (SPA), преимущество SSR заключается, прежде всего, в следующем:

- **Ускоренное освоение контента**: Это особенно заметно на медленном интернете или медленных устройствах. Серверной рендеризованной разметке не нужно ждать, пока весь JavaScript будет загружен и выполнен, чтобы отобразиться, поэтому пользователь увидит полностью рендеризованную страницу раньше. Кроме того, при первом посещении поиск данных осуществляется на стороне сервера, который, скорее всего, имеет более быстрое соединение с вашей базой данных, чем клиент. Это, как правило, приводит к улучшению [основных показателей Web](https://web.dev/vitals/), повышению удобства работы пользователей и может иметь решающее значение для приложений, в которых время просмотра контента напрямую связано с коэффициентом конверсии.

- **Унифицированная ментальная модель**: Вы можете использовать один и тот же язык и одну и ту же декларативную, компонентно-ориентированную модель мышления для разработки всего приложения, а не прыгать туда-сюда между внутренней системой шаблонов и внешним фреймворком.

- **Улучшение SEO**: поисковики увидят непосредственно полностью отрисованную страницу.

  :::tip Примечание
  На данный момент Google и Bing прекрасно индексируют синхронные JavaScript-приложения. Ключевое слово здесь — синхронный. Если ваше приложение запускается с помощью загрузочного спиннера, а затем получает контент через Ajax, краулер не будет ждать, пока вы закончите. Это означает, что если на страницах, для которых важно SEO, контент подхватывается асинхронно, SSR может быть необходим.
  :::

При использовании SSR также необходимо учитывать некоторые компромиссы:

- Ограничения развития. Код, специфичный для браузера, может быть использован только внутри определённых хуков жизненного цикла. Некоторые внешние библиотеки могут нуждаться в особом обращении, чтобы их можно было запустить в приложении с серверным рендерингом.

- Более сложные требования к настройке и развёртыванию сборки. В отличие от полностью статичного SPA, которое можно развернуть на любом статичном файловом сервере, серверно-рендерное приложение требует наличия среды, в которой может работать сервер Node.js.

- Больше нагрузки на сервер. Рендеринг полноценного приложения в Node.js будет более требовательным к процессору, чем простое обслуживание статических файлов, поэтому если вы ожидаете большой трафик, будьте готовы к соответствующей нагрузке на сервер и грамотно используйте стратегии кэширования.

Прежде чем использовать SSR в своем приложении, первым делом задайте себе вопрос, действительно ли он вам нужен. В основном это зависит от того, насколько важно для вашего приложения «время до контента». Например, если вы создаете внутреннюю приборную панель, где лишние несколько сотен миллисекунд при начальной загрузке не имеют большого значения, SSR будет излишеством. Тем не менее, в случаях, когда время просмотра контента является абсолютно критичным, SSR может помочь вам достичь наилучших показателей начальной загрузки.

### SSR в сравнении с SSG {#ssr-vs-ssg}

**Статическая генерация сайта (SSG)**, также называемая предварительным рендерингом, — ещё одна популярная техника создания быстрых сайтов. Если данные, необходимые для серверного рендеринга страницы, одинаковы для каждого пользователя, то вместо того, чтобы рендерить страницу каждый раз, когда приходит запрос, мы можем сделать это только один раз, заранее, в процессе сборки. Предварительно отрендеренные страницы создаются и обслуживаются как статические HTML-файлы.

SSG сохраняет те же характеристики, что и приложения SSR: он обеспечивает отличную производительность по времени до контента. В то же время, это дешевле и проще в развёртывании, чем приложения SSR, потому что на выходе получаются статичный HTML и ресурсы. Ключевое слово здесь — **статичный**: SSG можно применять только к страницам, предоставляющим статичные данные, т. е. данные, которые известны на момент сборки и не могут меняться между запросами. Каждый раз, когда данные меняются, требуется новое развёртывание.

Если вы используете SSR только для улучшения SEO горстки маркетинговых страниц (например, `/`, `/about`, `/contact` и т. д.), то вам, вероятно, нужен SSG, а не SSR. SSG также отлично подходит для сайтов, основанных на контенте, таких как сайты документации или блоги. На самом деле, этот сайт, который вы сейчас читаете, статически сгенерирован с помощью [VitePress](https://vitepress.dev/), генератора статических сайтов на основе Vue.

## Базовый учебник {#basic-tutorial}

### Рендеринг приложения {#rendering-an-app}

Давайте посмотрим на самый простой пример Vue SSR в действии.

1. Создайте новый каталог и перейдите в него с помощью команды `cd`.
2. Запустите `npm init -y`
3. Добавьте `"тип": "module"` в `package.json`, чтобы Node.js работал в [режиме модулей ES](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Запустите `npm install vue`
5. Создайте файл `example.js`:

```js
// Это выполняется в Node.js на сервере.
import { createSSRApp } from 'vue'
// API рендеринга сервера Vue находится в разделе `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Затем запустите:

```sh
> node example.js
```

В командной строке должно появиться следующее сообщение:

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) принимает экземпляр приложения Vue и возвращает Promise, который разрешается в отрендеренный HTML приложения. Также можно осуществлять потоковый рендеринг с помощью [Node.js Stream API](https://nodejs.org/api/stream.html) или [Web Streams API](https://developer.mozilla.org/ru/docs/Web/API/Streams_API). Ознакомьтесь с [Справочником по API SSR](/api/ssr) для получения подробной информации.

Затем мы можем перенести код Vue SSR в обработчик запросов к серверу, который обернёт разметку приложения полным HTML страницы. На следующих этапах мы будем использовать [`express`](https://expressjs.com/):

- Запустите `npm install express`
- Создайте файл `server.js`:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

Наконец, запустите `node server.js` и посетите сайт `http://localhost:3000`. Вы должны увидеть, что страница с кнопкой работает.

[Попробовать на StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Гидратация клиентской части {#client-hydration}

Если вы нажмете на кнопку, то заметите, что число не изменится. HTML полностью статичен на клиенте, поскольку мы не загружаем Vue в браузере.

Чтобы сделать приложение на стороне клиента интерактивным, Vue необходимо выполнить этап **гидратации**. Во время гидратации создается то же приложение Vue, которое было запущено на сервере, каждый компонент сопоставляется с узлами DOM, которыми он должен управлять, и подключаются слушатели событий DOM.

Чтобы смонтировать приложение в режиме гидратации, нужно использовать [`createSSRApp()`](/api/application#createssrapp) вместо `createApp()`:

```js{2}
// это запускается в браузере.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...то же приложение, что и на сервере
})

// Установка приложения SSR на клиенте предполагает,
// что HTML был предварительно отрендерен, и вместо монтирования
// новых узлов DOM будет произведена гидратация.
app.mount('#app')
```

### Структура кода {#code-structure}

Обратите внимание, что нам нужно использовать ту же реализацию приложения, что и на сервере. Именно здесь нам нужно начать думать о структуре кода в приложении SSR — как разделить один и тот же код приложения между сервером и клиентом?

Здесь мы продемонстрируем самый простой вариант. Для начала давайте выделим логику создания приложения в отдельный файл `app.js`:

```js
// app.js (совместно используемый сервером и клиентом)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Этот файл и его зависимости являются общими для сервера и клиента — мы называем их **универсальным кодом**. При написании универсального кода необходимо обратить внимание на ряд моментов, о которых мы расскажем [ниже](#writing-ssr-friendly-code).

Наш клиент импортирует универсальный код, создает приложение и выполняет монтаж:

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

А сервер использует ту же логику создания приложения в обработчике запроса:

```js{2,5} [server.js]
// (неактуальный код опущен)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Кроме того, чтобы загрузить файлы клиента в браузер, нам также необходимо:

1. Отправьте клиентские файлы, добавив `server.use(express.static('.'))` в `server.js`.
2. Загрузите запись клиента, добавив `<script type="module" src="/client.js"></script>` в оболочку HTML.
3. Поддержка использования типа `import * from 'vue'` в браузере путём добавления [карты импорта](https://github.com/WICG/import-maps) в HTML-оболочку.

[Попробуйте выполнить пример на StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). Кнопка стала интерактивной!

## Решения более высокого уровня {#higher-level-solutions}

Переход от примера к приложению SSR, готовому к продакшену, подразумевает гораздо большее. Нам потребуется:

- Поддержка однофайловых компонентов Vue и других требований к шагам сборки. Фактически, нам нужно будет согласовать две сборки для одного и того же приложения: одну для клиента и одну для сервера.

  :::tip Примечание
  Компоненты Vue компилируются по-другому, когда используются для SSR — шаблоны компилируются в конкатенации строк вместо рендер-функций Virtual DOM для более эффективной работы отрисовки.
  :::

- В обработчике запроса сервера отобразите HTML с правильными ссылками на активы на стороне клиента и оптимальными подсказками ресурсов. Нам также может понадобиться переключаться между режимами SSR и SSG, или даже смешивать оба режима в одном приложении.

- Универсальное управление маршрутизацией, получением данных и хранением состояний.

Полная реализация будет довольно сложной и зависит от инструментария сборки, с которым вы решили работать. Поэтому мы настоятельно рекомендуем выбирать решения более высокого уровня, которые абстрагируют вас от сложностей. Ниже мы представим несколько рекомендуемых SSR-решений в экосистеме Vue.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) — это высокоуровневый фреймворк, построенный поверх экосистемы Vue, который обеспечивает оптимизированный опыт разработки для написания универсальных Vue-приложений. А ещё лучше — использовать его в качестве генератора статических сайтов! Мы настоятельно рекомендуем попробовать.

### Quasar {#quasar}

[Quasar](https://quasar.dev) — это комплексное решение на основе Vue, позволяющее создавать SPA, SSR, PWA, мобильные приложения, десктопные приложения и браузерные расширения, используя одну кодовую базу. Он не только выполняет настройку сборки, но и предоставляет полную коллекцию UI-компонентов, соответствующих Material Design.

### Vite SSR {#vite-ssr}

Vite предоставляет встроенную [поддержку рендеринга Vue на стороне сервера](https://dragomano.github.io/vite-docs/guide/ssr.html), но она намеренно низкоуровневая. Если вы хотите использовать Vite напрямую, обратите внимание на [vite-plugin-ssr](https://vite-plugin-ssr.com/), плагин сообщества, который абстрагирует вас от многих сложных деталей.

Вы также можете найти пример проекта Vue + Vite SSR с ручной настройкой [здесь](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue), который может послужить базой для построения. Обратите внимание, что это рекомендуется только в том случае, если у вас есть опыт работы с SSR или инструментами сборки и вы действительно хотите иметь полный контроль над высокоуровневой архитектурой.

## Написание SSR-дружественного кода {#writing-ssr-friendly-code}

Независимо от настройки сборки или выбора фреймворка более высокого уровня, есть несколько принципов, которые применяются во всех приложениях Vue SSR.

### Реактивность на сервере {#reactivity-on-the-server}

Во время SSR каждый URL-адрес запроса соответствует желаемому состоянию нашего приложения. Здесь нет взаимодействия с пользователем и обновления DOM, поэтому реактивность на сервере не нужна. По умолчанию реактивность отключена во время SSR для повышения производительности.

### Хуки жизненного цикла компонентов {#component-lifecycle-hooks}

Поскольку динамические обновления отсутствуют, хуки жизненного цикла, такие как <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> или <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> **НЕ** будут вызываться во время SSR и будут выполняться только на клиенте.<span class="options-api"> Единственные хуки, которые вызываются во время SSR, это `beforeCreate` и `created`.</span>

Вам следует избегать кода, который создает побочные эффекты, требующие очистки в <span class="options-api">`beforeCreate` и `created`</span><span class="composition-api">`setup()` или корневой области `<script setup>`</span>. Примером таких побочных эффектов является настройка таймеров с помощью `setInterval`. В коде, предназначенном только для клиентской стороны, мы можем установить таймер, а затем отключить его в <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> или <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Однако, поскольку хуки размонтирования никогда не будут вызываться во время SSR, таймеры будут существовать вечно. Чтобы избежать этого, перенесите код побочных эффектов в <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

### Доступ к API для конкретной платформы {#access-to-platform-specific-apis}

Универсальный код не может предполагать доступ к API, специфичным для конкретной платформы, поэтому если ваш код напрямую использует глобалы только для браузера, такие как `window` или `document`, они будут вызывать ошибки при выполнении в Node.js, и наоборот.

Для задач, которые разделяются между сервером и клиентом, но имеют разные API платформы, рекомендуется обернуть специфические для платформы реализации в универсальный API или использовать библиотеки, которые сделают это за вас. Например, вы можете использовать [`node-fetch`](https://github.com/node-fetch/node-fetch), чтобы использовать один и тот же API fetch на сервере и клиенте.

Для API, предназначенных только для браузеров, распространённым подходом является ленивый доступ к ним внутри хуков жизненного цикла, предназначенных только для клиентов, таких как <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Обратите внимание, что если сторонняя библиотека не написана с учётом универсального использования, её может быть сложно интегрировать в приложение с серверным рендерингом. Вы _можете_ заставить его работать, подражая некоторым глобалам, но это будет халтурно и может помешать коду определения окружения других библиотек.

### Загрязнение состояния при перекрёстных запросах {#cross-request-state-pollution}

В главе «Управление состоянием» мы представили [простой паттерн управления состоянием с использованием Reactivity API](state-management#simple-state-management-with-reactivity-api). В контексте SSR этот паттерн требует некоторых дополнительных корректировок.

Паттерн объявляет общее состояние в корневой области видимости модуля JavaScript. Это делает их **синглтонами** — т. е. на протяжении всего жизненного цикла нашего приложения существует только один экземпляр реактивного объекта. Это работает, как и ожидалось, в чисто клиентском приложении Vue, поскольку модули в нашем приложении инициализируются заново при каждом посещении страницы браузера.

Однако в контексте SSR модули приложения обычно инициализируются на сервере только один раз, при его загрузке. Одни и те же экземпляры модулей будут повторно использоваться при нескольких запросах к серверу, как и наши объекты состояния синглтонов. Если мы мутируем общее состояние синглтонов с данными, специфичными для одного пользователя, они могут случайно просочиться в запрос от другого пользователя. Мы называем это **загрязнением состояния при перекрёстных запросах**.

Технически мы можем заново инициализировать все модули JavaScript при каждом запросе, как это делается в браузерах. Однако инициализация модулей JavaScript может быть дорогостоящей, поэтому это значительно повлияет на производительность сервера.

Рекомендуемое решение — создавать новый экземпляр всего приложения, включая маршрутизатор и глобальные хранилища, при каждом запросе. Затем, вместо того чтобы напрямую импортировать его в наши компоненты, мы предоставляем общее состояние с помощью [provide на уровне приложения](/guide/components/provide-inject#app-level-provide) и инжектируем его в компоненты, которым оно необходимо:

```js
// app.js (совместно используемый сервером и клиентом)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// вызывается при каждом запросе
export function createApp() {
  const app = createSSRApp(/* ... */)
  // создание нового экземпляра хранилища по запросу
  const store = createStore(/* ... */)
  // обеспечиваем хранение на уровне приложения
  app.provide('store', store)
  // также разворачиваем хранилище для гидратации целей
  return { app, store }
}
```

Библиотеки управления состояниями, такие как Pinia, разработаны с учётом этого. За более подробной информацией обратитесь к [Руководству по SSR в Pinia](https://pinia-ru.netlify.app/ssr/).

### Несоответствие гидратации {#hydration-mismatch}

Если структура DOM предварительно отрендеренного HTML не совпадает с ожидаемым результатом работы клиентского приложения, возникает ошибка несоответствия гидратации. Чаще всего несоответствие гидратации возникает по следующим причинам:

1. Шаблон содержит неправильную структуру вложенности HTML, и отрисованный HTML был «исправлен» собственным поведением браузера по разбору HTML. Например, часто встречается ситуация, когда [`<div>` не может быть размещён внутри `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>привет</div></p>
   ```

   Если мы создадим это в нашем серверном HTML, браузер прервёт первый `<p>`, когда встретится `<div>`, и разберёт его в следующую структуру DOM:

   ```html
   <p></p>
   <div>привет</div>
   <p></p>
   ```

2. Данные, используемые во время рендеринга, содержат случайно сгенерированные значения. Поскольку одно и то же приложение будет запущено дважды — один раз на сервере, другой раз на клиенте, — не гарантируется, что случайные значения будут одинаковыми при двух запусках. Существует два способа избежать несовпадений, вызванных случайными значениями:

   1. Используйте `v-if` + `onMounted` для отрисовки части, зависящей от случайных значений, только на клиенте. Ваш фреймворк может иметь встроенные функции, облегчающие эту задачу, например, компонент `<ClientOnly>` в VitePress.

   2. Используйте библиотеку генератора случайных чисел, поддерживающую генерацию с семенами, и гарантируйте, что сервер и клиент используют одно и то же семя (например, включив семя в сериализованное состояние и получив его на клиенте).

3. Сервер и клиент находятся в разных часовых поясах. Иногда нам может потребоваться перевести временную метку в местное время пользователя. Однако часовой пояс во время работы сервера и часовой пояс во время работы клиента не всегда совпадают, и мы можем не знать достоверно часовой пояс пользователя во время работы сервера. В таких случаях преобразование местного времени также должно выполняться только для клиента.

Когда Vue столкнется с несоответствием гидратации, он попытается автоматически восстановить и настроить предварительно отрендеренный DOM так, чтобы он соответствовал состоянию на стороне клиента. Это приведёт к некоторому снижению производительности отрисовки из-за отбрасывания неверных узлов и установки новых, но в большинстве случаев приложение продолжит работать так, как ожидалось. Тем не менее, лучше всего устранять несоответствия в процессе разработки.

#### Подавление несоответствий гидратации <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

В Vue 3.5+ можно выборочно подавлять неизбежные несоответствия гидратации с помощью атрибута [`data-allow-mismatch`](/api/ssr#data-allow-mismatch).

### Пользовательские директивы {#custom-directives}

Поскольку большинство пользовательских директив подразумевают прямые манипуляции с DOM, они игнорируются во время SSR. Однако если вы хотите указать, как должна отображаться пользовательская директива (т. е. какие атрибуты она должна добавить к отрисованному элементу), вы можете использовать хук директивы `getSSRProps`:

```js
const myDirective = {
  mounted(el, binding) {
    // реализация на стороне клиента:
    // напрямую обновляем DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // реализация на стороне сервера:
    // возвращает параметры для отображаться.
    // getSSRProps получает только привязку к директиве.
    return {
      id: binding.value
    }
  }
}
```

### Телепорты {#teleports}

Телепорты требуют особого обращения во время SSR. Если приложение содержит телепорты, то телепортированное содержимое не будет являться частью строки рендеринга. Более простым решением является условное отображение телепорта при монтировании.

Если вам нужно гидрировать телепортированное содержимое, то оно отображается в свойстве `teleports` объекта контекста ssr:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'телепортированное содержимое' }
```

Вам нужно внедрить разметку телепорта в нужное место в HTML конечной страницы, аналогично тому, как вы внедряете разметку основного приложения.

:::tip Совет
При совместном использовании телепортов и SSR избегайте указания на `body` — обычно `<body>` содержит другой рендеренный сервером контент, из-за которого телепорты не могут определить правильное начальное место для гидратации.

Вместо этого предпочтите специальный контейнер, например, `<div id="teleported"></div>`, который содержит только телепортированное содержимое.
:::
