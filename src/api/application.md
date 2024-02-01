# API приложения {#application-api}

## createApp() {#createapp}

Создает экземпляр приложения.

- **Тип**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Подробности**

  Первым аргументом является корневой компонент. Второй необязательный аргумент — это параметр, который будет передан корневому компоненту.

- **Пример**

  С встроенным корневым компонентом:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* параметры корневого компонента */
  })
  ```

  С импортируемым компонентом:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Смотрите также** [Руководство - Создание приложения Vue](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Создает экземпляр приложения в режиме [гидратации SSR](/guide/scaling-up/ssr#client-hydration). Используется точно так же, как и `createApp()`.

## app.mount() {#app-mount}

Монтирует экземпляр приложения в элемент контейнера.

- **Тип**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Подробности**

  В качестве аргумента может выступать либо реальный элемент DOM, либо CSS-селектор (будет использоваться первый найденный элемент). Возвращает экземпляр корневого компонента.

  Если у компонента определёны шаблон или функция рендеринга, они заменят все существующие узлы DOM внутри контейнера. В противном случае, если доступен компилятор времени выполнения, в качестве шаблона будет использоваться `innerHTML` контейнера.

  В режиме гидратации SSR этот метод гидратирует существующие узлы DOM внутри контейнера. Если есть [несоответствия](/guide/scaling-up/ssr#hydration-mismatch), существующие узлы DOM будут изменены, чтобы соответствовать ожидаемому результату.

  Для каждого экземпляра приложения `mount()` может быть вызван только один раз.

- **Пример**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  Также может подключаться к реальному элементу DOM:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Размонтирует смонтированный экземпляр приложения, запуская хуки жизненного цикла размонтирования для всех компонентов в дереве компонентов приложения.

- **Тип**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.component() {#app-component}

Регистрирует глобальный компонент, если переданы строка имени и определение компонента, или извлекает уже зарегистрированный компонент, если передано только имя.

- **Тип**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // регистрируем объект параметров
  app.component('my-component', {
    /* ... */
  })

  // получаем зарегистрированный компонент
  const MyComponent = app.component('my-component')
  ```

- **Смотрите также** [Регистрация компонентов](/guide/components/registration)

## app.directive() {#app-directive}

Регистрирует глобальную пользовательскую директиву, если переданы строка имени и определение директивы, или извлекает уже зарегистрированную, если передано только имя.

- **Тип**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* ... */
  })

  // регистрируем (директива объекта)
  app.directive('my-directive', {
    /* хуки для пользовательских директив */
  })

  // регистрируем (сокращение директивы функции)
  app.directive('my-directive', () => {
    /* ... */
  })

  // получаем зарегистрированную директиву
  const myDirective = app.directive('my-directive')
  ```

- **Смотрите также** [Пользовательские директивы](/guide/reusability/custom-directives)

## app.use() {#app-use}

Устанавливает [плагин](/guide/reusability/plugins).

- **Тип**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Подробности**

  В качестве первого аргумента ожидает плагин, а в качестве второго — дополнительные опции плагина.

  Плагин может быть либо объектом с методом `install()`, либо просто функцией, которая будет использоваться в качестве метода `install()`. Опции (второй аргумент `app.use()`) будут переданы методу `install()` плагина.

  Если `app.use()` вызывается для одного и того же плагина несколько раз, плагин будет установлен только один раз.

- **Пример**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Смотрите также** [Плагины](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Применяет глобальную примесь (с привязкой к приложению). Глобальная примесь применяет включенные в неё параметры к каждому экземпляру компонента в приложении.

:::warning Не рекомендуется
Примеси поддерживаются в Vue 3 в основном для обратной совместимости, благодаря их широкому использованию в экосистемных библиотеках. В коде приложений следует избегать использования примесей, особенно глобальных.

Для повторного использования логики предпочтите [Композитные функции](/guide/reusability/composables).
:::

- **Тип**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Предоставьте значение, которое может быть введено во все компоненты-потомки в приложении.

- **Тип**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Подробности**

  В качестве первого аргумента ожидает ключ инъекции, а в качестве второго — предоставленное значение. Возвращает сам экземпляр приложения.

- **Пример**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'привет')
  ```

  Внутри компонента в приложении:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'привет'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'привет'
    }
  }
  ```

  </div>

- **Смотрите также**
  - [Provide / Inject](/guide/components/provide-inject)
  - [Provide на уровне приложения](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext()<sup class="vt-badge" data-text="3.3+" /> {#app-runwithcontext}

Выполните обратный вызов с текущим приложением в качестве контекста инъекции.

- **Тип**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Подробности**

  Ожидает функцию обратного вызова и немедленно запускает её. Во время синхронного выполнения обратного вызова методы `inject()` могут искать инъекции из значений, предоставленных текущим приложением, даже если в данный момент нет активного экземпляра компонента. Также будет возвращено значение обратного вызова.

- **Пример**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Указывает версию Vue, в которой было создано приложение. Это полезно в [плагинах](/guide/reusability/plugins), где вам может понадобиться условная логика, основанная на разных версиях Vue.

- **Тип**

  ```ts
  interface App {
    version: string
  }
  ```

- **Пример**

  Выполнение проверки версии внутри плагина:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
    }
  }
  ```

- **Смотрите также** [Глобальный API - version](/api/general#version)

## app.config {#app-config}

Каждый экземпляр приложения предоставляет объект `config`, который содержит настройки конфигурации для этого приложения. Вы можете изменить его свойства (описанные ниже) перед монтированием приложения.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Назначаем глобальный обработчик для непойманных ошибок, распространяющихся изнутри приложения.

- **Тип**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` - это информация об ошибке, специфичная для Vue,
      // например, в каком хуке жизненного цикла возникла ошибка
      info: string
    ) => void
  }
  ```

- **Подробности**

  Обработчик ошибок получает три аргумента: ошибка, экземпляр компонента, вызвавшего ошибку, и информационная строка, указывающая тип источника ошибки.

  Он может фиксировать ошибки из следующих источников:

  - Отрисовщики компонентов
  - Обработчики событий
  - Хуки жизненного цикла
  - Функция `setup()`
  - Наблюдатели
  - Хуки для пользовательских директив
  - Хуки переходов

- **Пример**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // обрабатываем ошибку, например, сообщаем в службу
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Назначаем пользовательский обработчик предупреждений от Vue.

- **Тип**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Подробности**

  В качестве первого аргумента обработчик предупреждения получает сообщение о предупреждении, в качестве второго — экземпляр исходного компонента, а в качестве третьего — строку трассировки компонента.

  С его помощью можно отфильтровать конкретные предупреждения, чтобы уменьшить многословность консоли. Все предупреждения Vue должны быть устранены в процессе разработки, так что это рекомендуется только во время отладки, чтобы сосредоточиться на конкретных предупреждениях из многих, и должно быть удалено после завершения отладки.

  :::tip Примечание
  Предупреждения работают только во время разработки, поэтому в рабочем режиме этот конфиг игнорируется.
  :::

- **Пример**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` это трассировка иерархии компонентов
  }
  ```

## app.config.performance {#app-config-performance}

Установите значение `true`, чтобы включить отслеживание производительности компонентов при инициализации, компиляции, отрисовке и патчах в панели производительности/таймлайна инструментов разработчика браузера. Работает только в режиме разработки и в браузерах, поддерживающих API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Тип:** `boolean`

- **Смотрите также** [Руководство - Производительность](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Настройка параметров компилятора времени выполнения. Значения, установленные для этого объекта, будут переданы компилятору шаблонов в браузере и повлияют на каждый компонент в настроенном приложении. Обратите внимание, что вы также можете переопределить эти опции для каждого компонента с помощью опции [`compilerOptions`](/api/options-rendering#compileroptions).

::: warning Важно
Эта опция конфигурации соблюдается только при использовании полной сборки (т. е. автономный `vue.js`, который может компилировать шаблоны в браузере). Если вы используете сборку только во время выполнения с настройкой сборки, параметры компилятора должны быть переданы в `@vue/compiler-dom` через конфигурации инструмента сборки.

- Для `vue-loader`: [передаются через опцию загрузчика `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Также смотрите, [как настроить его в `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Для `vite`: [передаются через опции `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Указывает метод проверки для распознавания собственных пользовательских элементов.

- **Тип:** `(tag: string) => boolean`

- **Подробности**

  Должен возвращать `true`, если тег должен рассматриваться как собственный пользовательский элемент. Для совпавшего тега Vue отобразит его как собственный элемент, а не попытается разрешить его как компонент Vue.

  Нативные HTML и SVG-теги не нужно сопоставлять в этой функции — парсер Vue распознает их автоматически.

- **Пример**

  ```js
  // рассматривайте все теги, начинающиеся с 'ion-', как пользовательские элементы
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Смотрите также** [Vue и веб-компоненты](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Настраивает поведение обработки пробельных символов в шаблоне.

- **Тип:** `'condense' | 'preserve'`

- **По умолчанию:** `'condense'`

- **Подробности**

  Vue удаляет/сокращает пробельные символы в шаблонах для получения более эффективного скомпилированного вывода. По умолчанию используется стратегия «condense» со следующим поведением:

  1. Ведущие и завершающие пробельные символы внутри элемента сжимаются в один пробел.
  2. Символы пробелов между элементами, содержащими новые строки, удаляются.
  3. Последовательные пробельные символы в текстовых узлах сжимаются в один пробел.

  Установка этого параметра в значение `preserve` отключит (2) и (3).

- **Пример**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Настраивает разделители, используемые для интерполяции текста в шаблоне.

- **Тип:** `[string, string]`

- **По умолчанию:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Подробности**

  Обычно это используется для того, чтобы избежать конфликта с серверными фреймворками, которые также используют синтаксис усов («mustache»).

- **Пример**

  ```js
  // Разделители изменены на стиль строк шаблонов ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Настраивает обработку HTML-комментариев в шаблонах.

- **Тип:** `boolean`

- **По умолчанию:** `false`

- **Подробности**

  По умолчанию Vue удаляет комментарии в процессе работы. Установка этого параметра в `true` заставит Vue сохранять комментарии даже в продакшене. Комментарии всегда сохраняются во время разработки. Эта опция обычно используется, когда Vue используется с другими библиотеками, которые полагаются на HTML-комментарии.

- **Пример**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Объект, который можно использовать для регистрации глобальных свойств, доступ к которым можно получить для любого экземпляра компонента внутри приложения.

- **Тип**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Подробности**

  Это замена `Vue.prototype` из Vue 2, которая больше не присутствует в Vue 3. Как и всё глобальное, это следует использовать с осторожностью.

  Если глобальное свойство конфликтует с собственным свойством компонента, то собственное свойство компонента будет иметь более высокий приоритет.

- **Использование**

  ```js
  app.config.globalProperties.msg = 'привет'
  ```

  Это делает `msg` доступным внутри любого шаблона компонента в приложении, а также на `this` любого экземпляра компонента:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'привет'
    }
  }
  ```

- **Смотрите также** [Руководство - Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Объект для определения стратегий объединения для пользовательских опций компонентов.

- **Тип**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Подробности**

  Некоторые плагины/библиотеки добавляют поддержку пользовательских опций компонентов (путём внедрения глобальных примесей). Для этих опций может потребоваться специальная логика объединения, когда необходимо «объединить» одну и ту же опцию из нескольких источников (например, примеси или наследование компонентов).

  Функцию стратегии слияния можно зарегистрировать для пользовательской опции, назначив её на объект `app.config.optionMergeStrategies`, используя имя опции в качестве ключа.

  Функция стратегии слияния получает в качестве первого и второго аргументов значение этой опции, определённой для родительского и дочернего экземпляров соответственно.

- **Пример**

  ```js
  const app = createApp({
    // свойство из self
    msg: 'Vue',
    // свойство из a mixin
    mixins: [
      {
        msg: 'Привет, '
      }
    ],
    mounted() {
      // объединённые свойства, разворачиваемые через this.$options
      console.log(this.$options.msg)
    }
  })

  // определяем пользовательскую стратегию слияния для `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // выводим 'Привет, Vue'
  ```

- **Смотрите также** [Экземпляр компонента - `$options`](/api/component-instance#options)
