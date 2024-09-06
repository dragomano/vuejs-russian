---
outline: deep
---

# Флаги на этапе компиляции {#compile-time-flags}

:::tip Подсказка
Флаги во время компиляции применяются только при использовании сборки Vue `esm-bundler` (т. е. `vue/dist/vue.esm-bundler.js`).
:::

При использовании Vue на этапе сборки можно настроить ряд флагов во время компиляции для включения / отключения определённых функций. Преимущество использования этих флагов заключается в том, что функции, отключенные таким образом, могут быть удалены из конечного пакета с помощью «встряхивания» дерева.

Vue будет работать, даже если эти флаги явно не настроены. Однако рекомендуется всегда настраивать их таким образом, чтобы по возможности можно было надлежащим образом удалить соответствующие функции.

Смотрите [Руководства по настройке](#configuration-guides) о том, как их настроить в зависимости от вашего инструмента сборки.

## `__VUE_OPTIONS_API__` {#VUE_OPTIONS_API}

- **По умолчанию:** `true`

  Включение/отключение поддержки Options API. Отключение этого параметра приведет к уменьшению объема пакетов, но может повлиять на совместимость со сторонними библиотеками, если они полагаются на Options API.

## `__VUE_PROD_DEVTOOLS__` {#VUE_PROD_DEVTOOLS}

- **По умолчанию:** `false`

Включение/отключение поддержки devtools в производственных сборках. Это приведет к увеличению количества кода, включенного в пакет, поэтому рекомендуется включать его только в целях отладки.

## `__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` {#VUE_PROD_HYDRATION_MISMATCH_DETAILS}

- **По умолчанию:** `false`

  Включение/отключение подробных предупреждений о несоответствиях гидратации в производственных сборках. Это приведет к увеличению количества кода, включенного в пакет, поэтому рекомендуется включать его только в целях отладки.

- Доступно только в 3.4+

## Руководства по настройке {#configuration-guides}

### Vite {#vite}

`@vitejs/plugin-vue` автоматически предоставляет значения по умолчанию для этих флагов. Чтобы изменить значения по умолчанию, используйте [параметр `define`](https://vitejs.dev/config/shared-options.html#define) конфигурации Vite:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // включение сведений о несоответствии гидратации в производственную сборку
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
  }
})
```

### vue-cli {#vue-cli}

`@vue/cli-service` автоматически предоставляет значения по умолчанию для некоторых из этих флагов. Для настройки или изменения значений используйте такой код:

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
```

### webpack {#webpack}

Флаги должны быть определены с помощью [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) для webpack:

```js
// webpack.config.js
module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```

### Rollup {#rollup}

Флаги должны быть определены с помощью [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
// rollup.config.js
import replace from '@rollup/plugin-replace'

export default {
  plugins: [
    replace({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    })
  ]
}
```
