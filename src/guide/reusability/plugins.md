# Плагины {#plugins}

## Введение {#introduction}

Плагины — это самодостаточный код, который обычно добавляет во Vue функциональность на уровне приложений. Вот так мы устанавливаем плагин:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* дополнительные опции */
})
```

Плагин определяется либо как объект, который открывает метод `install()`, либо как функция, которая сама выполняет функцию установки. Функция install получает [экземпляр приложения](/api/application) вместе с дополнительными опциями, переданными в `app.use()`, если таковые имеются:

```js
const myPlugin = {
  install(app, options) {
    // настройка приложения
  }
}
```

Строго определённая область применения плагина отсутствует, но общие сценарии, в которых плагины могут быть полезны, включают:

1. Регистрация одного или нескольких глобальных компонентов или пользовательских директив с помощью [`app.component()`](/api/application#app-component) и [`app.directive()`](/api/application#app-directive).

2. Назначение ресурса [инжектируемым](/guide/components/provide-inject) во всём приложении, с помощью вызова [`app.provide()`](/api/application#app-provide).

3. Добавление некоторых глобальных свойств или методов экземпляра, с прикреплением к [`app.config.globalProperties`](/api/application#app-config-globalproperties).

4. Библиотека, которая должна выполнять некоторую комбинацию вышеперечисленных действий (например, [vue-router](https://github.com/vuejs/vue-router-next)).

## Написание плагина {#writing-a-plugin}

Чтобы лучше понять, как создавать собственные плагины Vue.js, мы создадим очень упрощённую версию плагина, который отображает строки `i18n` (сокращение от [Internationalization](https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%BD%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F_%D0%B8_%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)).

Начнем с настройки объекта плагина. Рекомендуется создать его в отдельном файле и экспортировать, как показано ниже, чтобы сохранить логику в отдельном файле.

```js [plugins/i18n.js]
export default {
  install: (app, options) => {
    // Код плагина находится здесь
  }
}
```

Мы хотим создать функцию перевода. Эта функция получит разделённую точками строку `key`, которую мы будем использовать для поиска переведённой строки в опциях, предоставленных пользователем. Это предполагаемое использование в шаблонах:

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

Поскольку эта функция должна быть глобально доступна во всех шаблонах, мы сделаем её такой, прикрепив к `app.config.globalProperties` в нашем плагине:

```js{3-10} [plugins/i18n.js]
export default {
  install: (app, options) => {
    // внедряем глобально доступный метод $translate()
    app.config.globalProperties.$translate = (key) => {
      // Получение вложенного свойства в `options`
      // с использованием `key` в качестве пути
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

Наша функция `$translate` возьмет строку типа `greetings.hello`, заглянет в конфигурацию, предоставленную пользователем, и вернет переведённое значение.

Объект, содержащий переведённые ключи, должен быть передан плагину при установке через дополнительные параметры в `app.use()`:

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

Теперь наше исходное выражение `$translate('greetings.hello')` будет заменено на `Bonjour!` во время выполнения.

См. также: [Расширение глобальных свойств](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip Совет
Используйте глобальные свойства редко, так как можно быстро запутаться, если в приложении используется слишком много глобальных свойств, созданных разными плагинами.
:::

### Provide / Inject с плагинами {#provide-inject-with-plugins}

Плагины также позволяют нам использовать `provide` для предоставления пользователям доступа к функции или атрибуту. Например, мы можем предоставить приложению доступ к параметру `options`, чтобы использовать объект переводов.

```js{3} [plugins/i18n.js]
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

Пользователи плагинов теперь смогут внедрять опции плагина в свои компоненты с помощью ключа `i18n`:

<div class="composition-api">

```vue{4}
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js{2}
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>

### Пакет для NPM

Если вы хотите создать и опубликовать свой плагин, чтобы им могли воспользоваться другие пользователи, смотрите раздел [Режим библиотеки](https://dragomano.github.io/vite-docs/guide/build.html#library-mode) в документации Vite.