# Composition API: <br>Внедрение зависимостей {#composition-api-dependency-injection}

## provide() {#provide}

Предоставляет значение, которое может быть инжектировано компонентами-потомками.

- **Тип**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **Подробности**

  `provide()` принимает два аргумента: ключ, который может быть строкой или символом, и значение для инъекции.

  При использовании TypeScript ключом может быть символ, преобразованный в `InjectionKey` — служебный тип, предоставляемый Vue, который расширяет `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

  Подобно API регистрации хуков жизненного цикла, `provide()` должен вызываться синхронно на этапе `setup()` компонента.

- **Пример**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // provide со статическим значением
  provide('path', '/project/')

  // provide с реактивным значением
  const count = ref(0)
  provide('count', count)

  // provide с ключами Symbol
  provide(countSymbol, count)
  </script>
  ```

- **Смотрите также**
  - [Руководство - Provide / Inject](/guide/components/provide-inject)
  - [Руководство - Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

Вставляет значение, предоставленное компонентом-предком или приложением (через `app.provide()`).

- **Тип**

  ```ts
  // без значения по умолчанию
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // со значением по умолчанию
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // с фабрикой
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **Подробности**

  Первым аргументом является ключ инъекции. Vue пройдётся по родительской цепочке, чтобы найти предоставленное значение с соответствующим ключом. Если несколько компонентов в родительской цепочке предоставляют один и тот же ключ, ближайший к инжектирующему компоненту будет «теневым» для тех, кто находится выше по цепочке. Если значение с подходящим ключом не найдено, `inject()` возвращает значение `undefined`, если не указано значение по умолчанию.

  Второй аргумент является необязательным и представляет собой значение по умолчанию, которое будет использоваться, если не найдено ни одного подходящего значения.

  Вторым аргументом также может быть фабричная функция, возвращающая значения, которые дорого создавать. В этом случае в качестве третьего аргумента необходимо передать `true`, чтобы указать, что функция должна использоваться в качестве фабрики, а не самого значения.

  Подобно API регистрации хуков жизненного цикла, `inject()` должен вызываться синхронно на этапе `setup()` компонента.

  При использовании TypeScript ключ может быть типа `InjectionKey` — это тип, предоставляемый Vue и расширяющий `Symbol`, который можно использовать для синхронизации типа значения между `provide()` и `inject()`.

- **Пример**

  Предположим, что родительский компонент предоставил значения, как показано в предыдущем примере с `provide()`:

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // инжектируем статическое значение без значения по умолчанию
  const path = inject('path')

  // инжектируем реактивное значение
  const count = inject('count')

  // инжектируем с ключами Symbol
  const count2 = inject(countSymbol)

  // инжектируем со значением по умолчанию
  const bar = inject('path', '/default-path')

  // инъектируем со значением функции по умолчанию
  const fn = inject('function', () => {})

  // инжектируем со значением фабрики по умолчанию
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```

* **Смотрите также**
  - [Руководство - Provide / Inject](/guide/components/provide-inject)
  - [Руководство - Типизация Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() <sup class="vt-badge" data-text="3.3+" /> {#has-injection-context}

Возвращает true, если [inject()](#inject) можно использовать без предупреждения о том, что он вызван не в том месте (например, за пределами `setup()`). Этот метод предназначен для библиотек, которые хотят использовать `inject()` внутри библиотеки, не вызывая предупреждения для конечного пользователя.

- **Тип**

  ```ts
  function hasInjectionContext(): boolean
  ```
