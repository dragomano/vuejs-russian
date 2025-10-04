# Экземпляр компонента {#component-instance}

:::info Информация
На этой странице описаны встроенные свойства и методы, открытые для публичного экземпляра компонента, т. е. `this`.

Все свойства, перечисленные на этой странице, доступны для чтения (за исключением вложенных свойств в `$data`).
:::

## $data {#data}

Объект, возвращаемый из свойства [`data`](./options-state#data), на который реагирует компонент. Экземпляр компонента проксирует доступ к свойствам своего объекта данных.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

Объект, представляющий текущий, разрешённый параметр компонента.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **Подробности**

  Будут включены только параметры, объявленные с помощью свойства [`props`](./options-state#props). Экземпляр компонента проксирует доступ к свойствам на своем объекте `props`.

## $el {#el}

Корневой узел DOM, которым управляет экземпляр компонента.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $el: any
  }
  ```

- **Подробности**

  `$el` будет `неопределённым` (`undefined`) до тех пор, пока компонент не будет [смонтирован](./options-lifecycle#mounted).

  - Для компонентов с одним корневым элементом `$el` будет указывать на этот элемент.
  - Для компонентов с корневым текстовым узлом, `$el` будет указывать на текстовый узел.
  - Для компонентов с несколькими корневыми узлами `$el` будет узлом-заполнителем DOM, который Vue использует для отслеживания позиции компонента в DOM (текстовый узел или узел комментария в режиме гидратации SSR).

  :::tip Совет
  Для согласованности рекомендуется использовать [ссылки на элементы шаблона](/guide/essentials/template-refs) для прямого доступа к элементам, а не полагаться на `$el`.
  :::

## $options {#options}

Разрешённые параметры компонента, используемые для инстанцирования текущего экземпляра компонента.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **Подробности**

  Объект `$options` отображает разрешённые опции для текущего компонента и является результатом слияния всех возможных источников:

  - Глобальные примеси
  - Компонент, `расширяющий` (`extends`) базовый
  - Примеси компонента

  Обычно он используется для поддержки пользовательских опций компонентов:

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **Смотрите также** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

Родительский экземпляр, если у текущего экземпляра он есть. Для самого корневого экземпляра это будет `null`.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

Экземпляр корневого компонента текущего дерева компонентов. Если у текущего экземпляра нет родителей, это значение будет равно самому себе.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

Объект, представляющий [слоты](/guide/components/slots), переданные родительским компонентом.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **Подробности**

  Обычно используется при ручном создании [рендер-функций](/guide/extras/render-function), но также может использоваться для определения наличия слота.

  Каждый слот отображается на `this.$slots` в виде функции, которая возвращает массив узлов Virtual DOM под ключом, соответствующим имени слота. Слот по умолчанию отображается как `this.$slots.default`.

  Если слот является [слотом с ограниченной областью видимости](/guide/components/slots#scoped-slots), то аргументы, переданные в функции слота, доступны слоту как его параметры.

- **Смотрите также** [Рендер-функции - Отрисовка слотов](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

Объект элементов DOM и экземпляров компонентов, зарегистрированных через [ссылки на элементы шаблона](/guide/essentials/template-refs).

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **Смотрите также**

  - [Ссылки на элементы шаблона](/guide/essentials/template-refs)
  - [Специальные атрибуты - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

Объект, содержащий передаваемые атрибуты компонента.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **Подробности**

  [Передаваемые атрибуты](/guide/components/attrs) это атрибуты и обработчики событий, переданные родительским компонентом, но не объявленные дочерним компонентом в качестве свойства или события.

  По умолчанию всё, что содержится в `$attrs`, будет автоматически наследоваться корневым элементом компонента, если корневой элемент только один. Это поведение отключается, если компонент имеет несколько корневых узлов, и может быть явно отключено с помощью опции [`inheritAttrs`](./options-misc#inheritattrs).

- **Смотрите также**

  - [Передаваемые атрибуты](/guide/components/attrs)

## $watch() {#watch}

Императивный API для создания наблюдателей.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // по умолчанию: false
    deep?: boolean // по умолчанию: false
    flush?: 'pre' | 'post' | 'sync' // по умолчанию: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **Подробности**

  Первый аргумент — это `source`. Это может быть строка имени свойства компонента, простая строка пути, разделённая точками, или [функция-геттер](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/get#описание).

  Второй аргумент — функция обратного вызова. Обратный вызов получает новое значение и старое значение наблюдаемого источника.

  - **`immediate`**: запуск обратного вызова непосредственно при создании наблюдателя. При первом вызове старое значение будет `undefined`.
  - **`deep`**: принудительный глубокий обход источника, если он является объектом, чтобы обратный вызов срабатывал при глубоких мутациях. Смотрите главу [Глубокие наблюдатели](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: регулировка времени сброса обратного вызова. См. [Время сброса обратного вызова](/guide/essentials/watchers#callback-flush-timing) и [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: отладка зависимостей наблюдателя. См. раздел [Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging).

- **Пример**

  Следим за именем свойства:

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  Следим за путём, использующим точку:

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  Использование метода получения для более сложных выражений:

  ```js
  this.$watch(
    // Каждый раз, когда выражение `this.a + this.b` дает
    // другой результат, будет вызываться обработчик.
    // Это как если бы мы наблюдали за вычисляемым свойством,
    // не определяя само вычисляемое свойство.
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  Остановка наблюдателя:

  ```js
  const unwatch = this.$watch('a', cb)

  // позже...
  unwatch()
  ```

- **Смотрите также**
  - [Options - `watch`](/api/options-state#watch)
  - [Руководство - Наблюдатели](/guide/essentials/watchers)

## $emit() {#emit}

Запуск пользовательского события на текущем экземпляре. Любые дополнительные аргументы будут переданы в функцию обратного вызова слушателя.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **Пример**

  ```js
  export default {
    created() {
      // только событие
      this.$emit('foo')
      // с дополнительными аргументами
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **Смотрите также**

  - [Компоненты - События](/guide/components/events)
  - [Свойство `emits`](./options-state#emits)

## $forceUpdate() {#forceupdate}

Принудительное повторное отображение экземпляра компонента.

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **Подробности**

  Это нужно делать крайне редко, учитывая полностью автоматическую систему реактивности Vue. Единственный случай, когда он может понадобиться, — это когда вы явно создали нереактивное состояние компонента с помощью расширенных Reactivity API.

## $nextTick() {#nexttick}

Привязанная к экземпляру версия глобального [`nextTick()`](./general#nexttick).

- **Тип**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(
      callback?: (this: ComponentPublicInstance) => void
    ): Promise<void>
  }
  ```

- **Подробности**

  Единственное отличие от глобальной версии `nextTick()` заключается в том, что обратный вызов, переданный в `this.$nextTick()`, будет иметь контекст `this`, привязанный к текущему экземпляру компонента.

- **Смотрите также** [`nextTick()`](./general#nexttick)
