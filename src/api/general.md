# Global API: Общее {#global-api-general}

## version {#version}

Возвращает текущую версию Vue.

- **Тип:** `string`

- **Пример**

  ```js
  import { version } from 'vue'

  console.log(version)
  ```

## nextTick() {#nexttick}

Утилита для ожидания следующего обновления DOM.

- **Тип**

  ```ts
  function nextTick(callback?: () => void): Promise<void>
  ```

- **Подробности**

  Когда вы изменяете реактивное состояние во Vue, результирующие обновления DOM не применяются синхронно. Вместо этого Vue буферизирует их до «следующего тика», чтобы каждый компонент обновлялся только один раз, независимо от того, сколько изменений состояния вы произвели.

  `nextTick()` можно использовать сразу после изменения состояния, чтобы дождаться завершения обновления DOM. Вы можете либо передать обратный вызов в качестве аргумента, либо ожидать возвращения Promise.

- **Пример**

  <div class="composition-api">

  ```vue
  <script setup>
  import { ref, nextTick } from 'vue'

  const count = ref(0)

  async function increment() {
    count.value++

    // DOM ещё не обновлен
    console.log(document.getElementById('counter').textContent) // 0

    await nextTick()
    // DOM обновлен
    console.log(document.getElementById('counter').textContent) // 1
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>
  <div class="options-api">

  ```vue
  <script>
  import { nextTick } from 'vue'

  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      async increment() {
        this.count++

        // DOM ещё не обновлен
        console.log(document.getElementById('counter').textContent) // 0

        await nextTick()
        // DOM обновлен
        console.log(document.getElementById('counter').textContent) // 1
      }
    }
  }
  </script>

  <template>
    <button id="counter" @click="increment">{{ count }}</button>
  </template>
  ```

  </div>

- **Смотрите также** [`this.$nextTick()`](/api/component-instance#nexttick)

## defineComponent() {#definecomponent}

Помощник типов для определения компонента Vue с выводом типов.

- **Тип**

  ```ts
  // синтаксис options
  function defineComponent(
    component: ComponentOptions
  ): ComponentConstructor

  // синтаксис функции (требует 3.3+)
  function defineComponent(
    setup: ComponentOptions['setup'],
    extraOptions?: ComponentOptions
  ): () => any
  ```

  > Для удобства чтения тип упрощён.

- **Подробности**

  В качестве первого аргумента ожидается объект опций компонента. Возвращаемым значением будет тот же объект `options`, так как функция, по сути, не работает во время выполнения и предназначена только для определения типа.

  Обратите внимание, что тип возврата немного особенный: это будет тип конструктора, типом экземпляра которого является тип экземпляра компонента, определённый на основе опций. Используется для вывода типа, когда возвращаемый тип используется в качестве тега в TSX.

  Можно извлечь тип экземпляра компонента (эквивалентный типу `this` в его опциях) из возвращаемого типа `defineComponent()` следующим образом:

  ```ts
  const Foo = defineComponent(/* ... */)

  type FooInstance = InstanceType<typeof Foo>
  ```

  ### Сигнатура функции <sup class="vt-badge" data-text="3.3+" /> {#function-signature}

  У `defineComponent()` также есть альтернативная подпись, предназначенная для использования с Composition API и [рендер-функциями или JSX](/guide/extras/render-function.html).

  Вместо передачи объекта `options` ожидается функция. Эта функция работает так же, как и функция Composition API [`setup()`](/api/composition-api-setup.html#composition-api-setup): она получает параметры и контекст. Возвращаемое значение должно быть рендер-функцией — поддерживаются как `h()`, так и JSX:

  ```js
  import { ref, h } from 'vue'

  const Comp = defineComponent(
    (props) => {
      // используем здесь API Composition, как в <script setup>
      const count = ref(0)

      return () => {
        // рендер-функция или JSX
        return h('div', count.value)
      }
    },
    // дополнительные опции, например, props или emits
    {
      props: {
        /* ... */
      }
    }
  )
  ```

  В основном эта сигнатура используется в TypeScript (и, в частности, в TSX), поскольку она поддерживает дженерики:

  ```tsx
  const Comp = defineComponent(
    <T extends string | number>(props: { msg: T; list: T[] }) => {
      // используем здесь API Composition, как в <script setup>
      const count = ref(0)

      return () => {
        // рендер-функция или JSX
        return <div>{count.value}</div>
      }
    },
    // В настоящее время всё ещё требуется ручное объявление параметров во время выполнения
    {
      props: ['msg', 'list']
    }
  )
  ```

  В будущем мы планируем создать плагин Babel, который будет автоматически определять и внедрять параметры времени выполнения (как в случае с `defineProps` в SFC), так что объявление параметров времени выполнения можно будет опустить.

  ### Заметка о webpack Treeshaking {#note-on-webpack-treeshaking}

  Поскольку `defineComponent()` — это вызов функции, это может выглядеть так, что это приведёт к побочным эффектам для некоторых инструментов сборки, например, webpack. Это позволит предотвратить древовидное сотрясение компонента, даже если он никогда не используется.

  Чтобы сообщить webpack, что этот вызов функции безопасен для древовидного изменения, вы можете добавить комментарий `/*#__PURE__*/` перед вызовом функции:

  ```js
  export default /*#__PURE__*/ defineComponent(/* ... */)
  ```

  Обратите внимание, что это не обязательно, если вы используете Vite, потому что Rollup (базовый пакет производства, используемый Vite) достаточно умён, чтобы определить, что `defineComponent()` на самом деле не имеет побочных эффектов, без необходимости ручных аннотаций.

- **Смотрите также** [Руководство - Использование Vue с TypeScript](/guide/typescript/overview#general-usage-notes)

## defineAsyncComponent() {#defineasynccomponent}

Определите асинхронный компонент, который загружается только при рендеринге. В качестве аргумента может выступать либо функция загрузчика, либо объект options для более сложного управления поведением загрузки.

- **Тип**

  ```ts
  function defineAsyncComponent(
    source: AsyncComponentLoader | AsyncComponentOptions
  ): Component

  type AsyncComponentLoader = () => Promise<Component>

  interface AsyncComponentOptions {
    loader: AsyncComponentLoader
    loadingComponent?: Component
    errorComponent?: Component
    delay?: number
    timeout?: number
    suspensible?: boolean
    onError?: (
      error: Error,
      retry: () => void,
      fail: () => void,
      attempts: number
    ) => any
  }
  ```

- **Смотрите также** [Руководство - Асинхронные компоненты](/guide/components/async)

## defineCustomElement() {#definecustomelement}

Этот метод принимает тот же аргумент, что и [`defineComponent`](#definecomponent), но вместо него возвращает собственный конструктор класса [CustomElement](https://developer.mozilla.org/ru/docs/Web/API/Web_components/Using_custom_elements).

- **Тип**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Для удобства чтения тип упрощён.

- **Подробности**

  В дополнение к обычным параметрам компонента, `defineCustomElement()` также поддерживает специальный параметр `styles`, который должен быть массивом вставленных CSS-строк, для предоставления CSS, который должен быть внедрён в теневой корень элемента.

  Возвращаемое значение — это пользовательский конструктор элемента, который можно зарегистрировать с помощью [`customElements.define()`](https://developer.mozilla.org/ru/docs/Web/API/CustomElementRegistry/define).

- **Пример**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* параметры компонента */
  })

  // Регистрируем пользовательский элемент
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Смотрите также**

  - [Руководство - Создание пользовательских элементов с помощью Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Также обратите внимание, что `defineCustomElement()` требует [специальной конфигурации](/guide/extras/web-components#sfc-as-custom-element) при использовании с однофайловыми компонентами.
