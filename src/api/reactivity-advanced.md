# Reactivity API: Дополнительно {#reactivity-api-advanced}

## shallowRef() {#shallowref}

Неглубокая версия [`ref()`](./reactivity-core#ref).

- **Тип**

  ```ts
  function shallowRef<T>(value: T): ShallowRef<T>

  interface ShallowRef<T> {
    value: T
  }
  ```

- **Подробности**

  В отличие от `ref()`, внутреннее значение неглубокой ссылки хранится и раскрывается как есть, и не может быть сделано глубоко реактивным. Только доступ к `.value` является реактивным.

  `shallowRef()` обычно используется для оптимизации производительности больших структур данных или интеграции с внешними системами управления состоянием.

- **Пример**

  ```js
  const state = shallowRef({ count: 1 })

  // не вызывает изменений
  state.value.count = 2

  // вызывает изменения
  state.value = { count: 2 }
  ```

- **Смотрите также**
  - [Руководство - Уменьшение накладных расходов на реактивность для больших неизменяемых структур](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
  - [Руководство - Интеграция с внешними системами управления состоянием](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

## triggerRef() {#triggerref}

Принудительный запуск эффектов, зависящих от [shallow ref](#shallowref). Обычно это используется после выполнения глубоких мутаций к внутреннему значению неглубокой ссылки.

- **Тип**

  ```ts
  function triggerRef(ref: ShallowRef): void
  ```

- **Пример**

  ```js
  const shallow = shallowRef({
    greet: 'Привет, мир'
  })

  // Логирует "Привет, мир" один раз во время первого прогона
  watchEffect(() => {
    console.log(shallow.value.greet)
  })

  // Это не вызовет эффекта, потому что ссылка неглубокая
  shallow.value.greet = 'Привет, Вселенная'

  // Логирует "Привет, Вселенная"
  triggerRef(shallow)
  ```

## customRef() {#customref}

Создает настраиваемую ссылку с явным контролем над отслеживанием зависимостей и срабатыванием обновлений.

- **Тип**

  ```ts
  function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

  type CustomRefFactory<T> = (
    track: () => void,
    trigger: () => void
  ) => {
    get: () => T
    set: (value: T) => void
  }
  ```

- **Подробности**

  `customRef()` ожидает фабричную функцию, которая получает в качестве аргументов функции `track` и `trigger` и должна возвращать объект с методами `get` и `set`.

  В общем случае, `track()` следует вызывать внутри `get()`, а `trigger()` — внутри `set()`. Однако вы полностью контролируете, когда их следует вызывать и следует ли вообще.

- **Пример**

  Создание отложенной ссылки, которая обновляет значение только через определённый промежуток времени после последнего вызова `set`:

  ```js
  import { customRef } from 'vue'

  export function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  ```

  Использование в компоненте:

  ```vue
  <script setup>
  import { useDebouncedRef } from './debouncedRef'
  const text = useDebouncedRef('hello')
  </script>

  <template>
    <input v-model="text" />
  </template>
  ```

  [Попробовать в Песочнице](https://play.vuejs.org/#eNplUkFugzAQ/MqKC1SiIekxIpEq9QVV1BMXCguhBdsyaxqE/PcuGAhNfYGd3Z0ZDwzeq1K7zqB39OI205UiaJGMOieiapTUBAOYFt/wUxqRYf6OBVgotGzA30X5Bt59tX4iMilaAsIbwelxMfCvWNfSD+Gw3++fEhFHTpLFuCBsVJ0ScgUQjw6Az+VatY5PiroHo3IeaeHANlkrh7Qg1NBL43cILUmlMAfqVSXK40QUOSYmHAZHZO0KVkIZgu65kTnWp8Qb+4kHEXfjaDXkhd7DTTmuNZ7MsGyzDYbz5CgSgbdppOBFqqT4l0eX1gZDYOm057heOBQYRl81coZVg9LQWGr+IlrchYKAdJp9h0C6KkvUT3A6u8V1dq4ASqRgZnVnWg04/QWYNyYzC2rD5Y3/hkDgz8fY/cOT1ZjqizMZzGY3rDPC12KGZYyd3J26M8ny1KKx7c3X25q1c1wrZN3L9LCMWs/+AmeG6xI=)

## shallowReactive() {#shallowreactive}

Неглубокая версия [`reactive()`](./reactivity-core#reactive).

- **Тип**

  ```ts
  function shallowReactive<T extends object>(target: T): T
  ```

- **Подробности**

  В отличие от `reactive()`, здесь нет глубокого преобразования: для неглубокого реактивного объекта реактивными являются только свойства корневого уровня. Значения свойств хранятся и раскрываются как есть — это также означает, что свойства с ref-значениями **НЕ** будут автоматически разворачиваться.

  :::warning Используйте с осторожностью
  Неглубокие структуры данных следует использовать только для состояния корневого уровня компонента. Избегайте вложения его внутрь глубокого реактивного объекта, так как это создаст дерево с непоследовательным поведением реактивности, которое может быть трудно понять и отладить.
  :::

- **Пример**

  ```js
  const state = shallowReactive({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // Мутация собственных свойств состояния является реактивной
  state.foo++

  // ...но не преобразует вложенные объекты
  isReactive(state.nested) // false

  // НЕ реактивная
  state.nested.bar++
  ```

## shallowReadonly() {#shallowreadonly}

Неглубокая версия [`readonly()`](./reactivity-core#readonly).

- **Тип**

  ```ts
  function shallowReadonly<T extends object>(target: T): Readonly<T>
  ```

- **Подробности**

  В отличие от `readonly()`, здесь нет глубокого преобразования: только свойства корневого уровня становятся доступными для чтения. Значения свойств хранятся и раскрываются как есть — это также означает, что свойства с ref-значениями **НЕ** будут автоматически разворачиваться.

  :::warning Используйте с осторожностью
  Неглубокие структуры данных следует использовать только для состояния корневого уровня компонента. Избегайте вложения его внутрь глубокого реактивного объекта, так как это создаст дерево с непоследовательным поведением реактивности, которое может быть трудно понять и отладить.
  :::

- **Пример**

  ```js
  const state = shallowReadonly({
    foo: 1,
    nested: {
      bar: 2
    }
  })

  // Мутация собственных свойств состояния будет неудачной
  state.foo++

  // ...но работает на вложенных объектах
  isReadonly(state.nested) // false

  // работает
  state.nested.bar++
  ```

## toRaw() {#toraw}

Возвращает исходный объект прокси, созданного в Vue.

- **Тип**

  ```ts
  function toRaw<T>(proxy: T): T
  ```

- **Подробности**

  `toRaw()` может возвращать исходный объект из прокси, созданных с помощью [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](#shallowreactive) или [`shallowReadonly()`](#shallowreadonly).

  Это аварийный люк, который можно использовать для временного чтения без накладных расходов на доступ к прокси/отслеживание или записи без запуска изменений. Не рекомендуется хранить постоянную ссылку на исходный объект. Используйте с осторожностью.

- **Пример**

  ```js
  const foo = {}
  const reactiveFoo = reactive(foo)

  console.log(toRaw(reactiveFoo) === foo) // true
  ```

## markRaw() {#markraw}

Помечает объект так, что он никогда не будет преобразован в прокси. Возвращает сам объект.

- **Тип**

  ```ts
  function markRaw<T extends object>(value: T): T
  ```

- **Пример**

  ```js
  const foo = markRaw({})
  console.log(isReactive(reactive(foo))) // false

  // также работает при вложении внутри других реактивных объектов
  const bar = reactive({ foo })
  console.log(isReactive(bar.foo)) // false
  ```

  :::warning Используйте с осторожностью
  `markRaw()` и поверхностные API, такие как `shallowReactive()`, позволяют выборочно отказаться от стандартного глубокого преобразования reactive/readonly и внедрить необработанные, непроксированные объекты в ваш граф состояний. Они могут использоваться по разным причинам:

  - Некоторые значения просто не должны быть реактивными, например, сложные экземпляры классов сторонних производителей или объекты компонентов Vue.

  - Отсутствие преобразования прокси может повысить производительность при отрисовке больших списков с неизменяемыми источниками данных.

  Они считаются продвинутыми, потому что отказ от raw происходит только на корневом уровне, поэтому если вы поместите вложенный немаркированный raw-объект в reactive-объект, а затем снова обратитесь к нему, то получите обратно проксированную версию. Это может привести к **опасности идентичности** — т. е. выполнение операции, основанной на идентификации объекта, но использующей как исходную, так и проксированную версию одного и того же объекта:

  ```js
  const foo = markRaw({
    nested: {}
  })

  const bar = reactive({
    // Хотя `foo` помечен как raw, foo.nested не помечен.
    nested: foo.nested
  })

  console.log(foo.nested === bar.nested) // false
  ```

  Опасности, связанные с личными данными, как правило, встречаются редко. Однако для правильного использования этих API и безопасного предотвращения угроз идентификации требуется четкое понимание того, как работает система реактивности.

  :::

## effectScope() {#effectscope}

Создает объект области видимости эффектов, который может захватывать реактивные эффекты (т. е. вычисляемые свойства и наблюдатели), созданные внутри него, чтобы эти эффекты можно было утилизировать вместе. Подробные примеры использования этого API можно найти в соответствующем [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md).

- **Тип**

  ```ts
  function effectScope(detached?: boolean): EffectScope

  interface EffectScope {
    run<T>(fn: () => T): T | undefined // undefined, если область видимости неактивна
    stop(): void
  }
  ```

- **Пример**

  ```js
  const scope = effectScope()

  scope.run(() => {
    const doubled = computed(() => counter.value * 2)

    watch(doubled, () => console.log(doubled.value))

    watchEffect(() => console.log('Count: ', doubled.value))
  })

  // избавляемся от всех эффектов в области действия
  scope.stop()
  ```

## getCurrentScope() {#getcurrentscope}

Возвращает текущую активную [область действия](#effectscope), если таковая имеется.

- **Тип**

  ```ts
  function getCurrentScope(): EffectScope | undefined
  ```

## onScopeDispose() {#onscopedispose}

Регистрирует обратный вызов dispose для текущей активной [области действия](#effectscope). Обратный вызов будет вызван, когда связанная область действия будет остановлена.

Этот метод можно использовать как не связанную с компонентами замену `onUnmounted` в многократно используемых функциях композиции, поскольку функция `setup()` каждого компонента Vue также вызывается в области видимости эффекта.

- **Тип**

  ```ts
  function onScopeDispose(fn: () => void): void
  ```
