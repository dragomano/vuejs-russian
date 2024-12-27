# Options: Отрисовка {#options-rendering}

## template {#template}

Строковый шаблон для компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Подробности**

  Шаблон, предоставленный с помощью опции `template`, будет скомпилирован на лету во время выполнения. Он поддерживается только при использовании сборки Vue, включающей компилятор шаблонов. Компилятор шаблонов **НЕ** включен в сборки Vue, в названии которых есть слово `runtime`, например, `vue.runtime.esm-bundler.js`. Более подробную информацию о различных сборках можно найти в [руководстве по работе с файлами dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use).

  Если строка начинается с `#`, она будет использоваться в качестве `querySelector` и использовать `innerHTML` выбранного элемента в качестве строки шаблона. Это позволяет создавать исходный шаблон с помощью собственных элементов `<template>`.

  Если в том же компоненте присутствует опция `render`, то `template` будет проигнорирован.

  Если в корневом компоненте вашего приложения не указана опция `template` или `render`, Vue попытается использовать `innerHTML` смонтированного элемента в качестве шаблона.

  :::warning Примечание по безопасности
  Используйте только те источники шаблонов, которым вы можете доверять. Не используйте пользовательский контент в качестве шаблона. Подробнее см. в [Руководстве по безопасности](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates).
  :::

## render {#render}

Функция, которая программно возвращает виртуальное DOM-дерево компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Подробности**

  `render` — это альтернатива строковым шаблонам, которая позволяет вам использовать всю программную мощь JavaScript для объявления вывода компонента на экран.

  Предварительно скомпилированные шаблоны, например, в однофайловых компонентах, компилируются в опцию `render` во время сборки. Если в компоненте присутствуют и `render`, и `template`, то `render` будет иметь более высокий приоритет.

- **Смотрите также**
  - [Механизм отрисовки](/guide/extras/rendering-mechanism)
  - [Рендер-функции](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Настройка параметров компилятора среды выполнения для шаблона компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // по умолчанию: 'condense'
      delimiters?: [string, string] // по умолчанию: ['{{', '}}']
      comments?: boolean // по умолчанию: false
    }
  }
  ```

- **Подробности**

  Эта опция конфигурации соблюдается только при использовании полной сборки (т. е. автономный `vue.js`, который может компилировать шаблоны в браузере). Он поддерживает те же опции, что и [app.config.compilerOptions](/api/application#app-config-compileroptions) на уровне приложения, и имеет более высокий приоритет для текущего компонента.

- **Смотрите также** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

Опция для помощи в определении типа при программном использовании слотов в рендер-функциях. Поддерживается только в версии 3.3+.

- **Подробности**

  Значение этой опции во время выполнения не используется. Фактические типы должны быть объявлены через приведение типов с помощью помощника типа `SlotsType`:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
