# Reactivity API: Ядро {#reactivity-api-core}

:::info Смотрите также
Чтобы лучше понять API Reactivity, рекомендуется прочитать следующие главы руководства:

- [Основы реактивности](/guide/essentials/reactivity-fundamentals) (со стилем API, установленным на Composition API)
- [Реактивность в деталях](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

Принимает внутреннее значение и возвращает реактивный и изменяемый объект ref, который имеет единственное свойство `.value`, указывающее на внутреннее значение.

- **Тип**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **Подробности**

  Объект ref является изменяемым — т. е. вы можете присваивать новые значения `.value`. Он также является реактивным — т. е. любые операции чтения `.value` отслеживаются, а операции записи вызывают соответствующие эффекты.

  Если в качестве значения ссылки назначен объект, он становится глубоко реактивным с помощью [reactive()](#reactive). Это также означает, что если объект содержит вложенные ссылки, они будут глубоко развёрнуты.

  Чтобы избежать глубокого преобразования, используйте [`shallowRef()`](./reactivity-advanced#shallowref).

- **Пример**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **Смотрите также**
  - [Руководство - Основы реактивности с `ref()`](/guide/essentials/reactivity-fundamentals#ref)
  - [Руководство - Типизация `ref()`](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

Принимает [функцию-геттер](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/get#описание) и возвращает реактивный объект [ref](#ref), доступный только для чтения, для возвращаемого значения из геттера. Он также может принимать объект с помощью функций `get` и `set` для создания записываемого объекта ref.

- **Тип**

  ```ts
  // свойство только для чтения
  function computed<T>(
    getter: () => T,
    // см. ссылку "Отладка вычисляемых свойств" ниже
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // свойство, доступное для записи
  function computed<T>(
    options: {
      get: () => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **Пример**

  Создание вычисляемой ссылки, доступной только для чтения:

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // ошибка
  ```

  Создание вычисляемой ссылки с возможностью записи:

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  Отладка:

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Смотрите также**
  - [Руководство - Вычисляемые свойства](/guide/essentials/computed)
  - [Руководство - Отладка вычисляемых свойств](/guide/extras/reactivity-in-depth#computed-debugging)
  - [Руководство - Типизация `computed()`](/guide/typescript/composition-api#typing-computed)
  - [Руководство - Производительность - Стабильность вычисляемых свойств](/guide/best-practices/performance#computed-stability)

## reactive() {#reactive}

Возвращает реактивный прокси объекта.

- **Тип**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **Подробности**

  Реактивное преобразование — «глубокое»: он влияет на все вложенные свойства. Реактивный объект также глубоко разворачивает любые свойства, которые являются [refs](#ref), сохраняя при этом реактивность.

  Также следует отметить, что разворачивание ссылки не происходит, когда к ней обращаются как к элементу реактивного массива или нативного типа коллекции, например `Map`.

  Чтобы избежать глубокого преобразования и сохранить реактивность только на корневом уровне, используйте [shallowReactive()](./reactivity-advanced#shallowreactive).

  Возвращаемый объект и его вложенные объекты обёрнуты [ES Proxy](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy) и **НЕ** равны исходным объектам. Рекомендуется работать исключительно с реактивным прокси и не полагаться на исходный объект.

- **Пример**

  Создание реактивного объекта:

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  Ссылка разворачивается:

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ссылка будет развёрнута
  console.log(obj.count === count.value) // true

  // это приведёт к обновлению `obj.count`.
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // это также приведет к обновлению `count` ref
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

  Обратите внимание, что ссылки **НЕ** разворачиваются при обращении к ним как к элементам массива или коллекции:

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // здесь нужно .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // здесь нужно .value
  console.log(map.get('count').value)
  ```

  При назначении [ref](#ref) свойству `reactive` эта ссылка также будет автоматически развёрнута:

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **Смотрите также**
  - [Руководство - Основы реактивности](/guide/essentials/reactivity-fundamentals)
  - [Руководство - Типизация `reactive()`](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

Принимает объект (реактивный или обычный) или [ref](#ref) и возвращает доступный для чтения прокси к оригиналу.

- **Тип**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **Подробности**

  Прокси-сервер, доступный только для чтения, является глубоким: все вложенные свойства, к которым осуществляется доступ, также будут доступны только для чтения. Он также имеет такое же поведение при разворачивании ссылки, как и `reactive()`, за исключением того, что разворачиваемые значения также становятся доступными для чтения.

  Чтобы избежать глубокого преобразования, используйте [shallowReadonly()](./reactivity-advanced#shallowreadonly).

- **Пример**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // работает для отслеживания реактивности
    console.log(copy.count)
  })

  // мутирующий оригинал вызовет наблюдателей, полагающихся на копию
  original.count++

  // мутирование копии будет неудачным и приведет к предупреждению
  copy.count++ // предупреждение!
  ```

## watchEffect() {#watcheffect}

Выполняет функцию немедленно, при этом реактивно отслеживая её зависимости, и повторно запускает её при изменении зависимостей.

- **Тип**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): WatchHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // по умолчанию: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  interface WatchHandle {
    (): void // вызываемый, как и `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

- **Подробности**

  Первый аргумент — функция эффекта, которую нужно запустить. Функция эффекта получает функцию, которая может быть использована для регистрации обратного вызова очистки. Обратный вызов cleanup будет вызван непосредственно перед следующим повторным запуском эффекта и может быть использован для очистки недействительных побочных эффектов, например, отложенный async-запрос (см. пример ниже).

  Второй аргумент — необязательный объект options, который можно использовать для настройки времени очистки эффекта или для отладки его зависимостей.

  По умолчанию наблюдатели запускаются непосредственно перед отрисовкой компонента. Установка `flush: 'post'` отложит работу наблюдателя до окончания отрисовки компонента. Дополнительную информацию см. в разделе [Время сброса обратного вызова](/guide/essentials/watchers#callback-flush-timing). В редких случаях может потребоваться немедленный запуск наблюдателя при изменении реактивной зависимости, например чтобы аннулировать кэш. Этого можно добиться с помощью функции `flush: 'sync'`. Однако этот параметр следует использовать с осторожностью, поскольку он может привести к проблемам с производительностью и согласованностью данных при одновременном обновлении нескольких свойств.

  Возвращаемое значение — функция-обработчик, которую можно вызвать, чтобы остановить повторное выполнение эффекта.

- **Пример**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> выводит 0

  count.value++
  // -> выводит 1
  ```

  Остановка наблюдателя:

  ```js
  const stop = watchEffect(() => {})

  // когда наблюдатель больше не нужен:
  stop()
  ```

  Приостановка/возобновление работы наблюдателя: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watchEffect(() => {})

  // временная приостановка работы наблюдателя
  pause()

  // возобновление работы
  resume()

  // остановка
  stop()
  ```

  Очистка от побочных эффектов:

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван, если `id` изменится, отменяя
    // предыдущий запрос, если он ещё не завершен
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Устранение побочных эффектов в версии 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watchEffect(async () => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван, если `id` изменится, отменяя
    // предыдущий запрос, если он ещё не завершен
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

  Параметры:

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **Смотрите также**
  - [Руководство - Наблюдатели](/guide/essentials/watchers#watcheffect)
  - [Руководство - Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

Псевдоним [`watchEffect()`](#watcheffect) с параметром `flush: 'post'`.

## watchSyncEffect() {#watchsynceffect}

Псевдоним [`watchEffect()`](#watcheffect) с параметром `flush: 'sync'`.

## watch() {#watch}

Наблюдает за одним или несколькими реактивными источниками данных и вызывает функцию обратного вызова при изменении источников.

- **Тип**

  ```ts
  // наблюдение за одним источником
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): WatchHandle

  // наблюдение за несколькими источниками
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): WatchHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // геттер
    | (T extends object ? T : never) // реактивный объект

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // по умолчанию: false
    deep?: boolean | number // по умолчанию: false
    flush?: 'pre' | 'post' | 'sync' // по умолчанию: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // по умолчанию: false (3.4+)
  }

  interface WatchHandle {
    (): void // вызываемый, как и `stop`
    pause: () => void
    resume: () => void
    stop: () => void
  }
  ```

  > Типы упрощены для удобства чтения.

- **Подробности**

  По умолчанию `watch()` является ленивым — т. е. обратный вызов вызывается только при изменении источника наблюдения.

  Первый аргумент — это **источник** наблюдателя. Источник может быть одним из следующих:

  - Функция геттера, возвращающая значение
  - Реактивная ссылка
  - Реактивный объект
  - ...или массив из перечисленных выше.

  Второй аргумент — обратный вызов, который будет вызван при изменении источника. Обратный вызов получает три аргумента: новое значение, старое значение и функция для регистрации обратного вызова очистки побочного эффекта. Обратный вызов cleanup будет вызван непосредственно перед следующим повторным запуском эффекта и может быть использован для очистки недействительных побочных эффектов, например, отложенный асинхронный запрос.

  При просмотре нескольких источников обратный вызов получает два массива, содержащих новые/старые значения, соответствующие массиву источника.

  Третий необязательный аргумент — это объект options, который поддерживает следующие опции:

  - **`immediate`**: запустить обратный вызов непосредственно при создании наблюдателя. При первом вызове старое значение будет `undefined`.
  - **`deep`**: принудительный глубокий обход источника, если он является объектом, чтобы обратный вызов срабатывал при глубоких мутациях. В версии 3.5+ это также может быть число, указывающее на максимальную глубину обхода. Смотрите [Глубокие наблюдатели](/guide/essentials/watchers#deep-watchers).
  - **`flush`**: настроить время обратного вызова на промывку. Смотрите разделы [Время сброса обратного вызова](/guide/essentials/watchers#callback-flush-timing) и [`watchEffect()`](/api/reactivity-core#watcheffect).
  - **`onTrack / onTrigger`**: отладка зависимостей наблюдателя. Смотрите раздел [Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging).
  - **`once`**: (3.4+) запустить обратный вызов только один раз. Наблюдатель автоматически останавливается после первого выполнения обратного вызова.

  По сравнению с [`watchEffect()`](#watcheffect), `watch()` позволяет нам:

  - Выполните побочный эффект лениво;
  - Уточните, какое состояние должно вызывать повторный запуск наблюдателя;
  - Доступ к предыдущему и текущему значению наблюдаемого состояния.

- **Пример**

  Наблюдение за геттером:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  Наблюдение за реактивной ссылкой:

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  При просмотре нескольких источников обратный вызов получает массивы, содержащие новые/старые значения, соответствующие массиву источника:

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  При использовании источника геттера наблюдатель срабатывает только в том случае, если возвращаемое значение геттера изменилось. Если вы хотите, чтобы обратный вызов срабатывал даже при глубоких мутациях, вам нужно явно перевести наблюдатель в глубокий режим с помощью `{ deep: true }`. Обратите внимание, что в глубоком режиме новое значение и старое будут одним и тем же объектом, если обратный вызов был вызван глубокой мутацией:

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  При непосредственном наблюдении за реактивным объектом наблюдатель автоматически переходит в глубокий режим:

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* срабатывает при глубокой мутации к состоянию */
  })
  ```

  `watch()` имеет общие с [`watchEffect()`](#watcheffect) опции синхронизации и отладки:

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  Остановка наблюдателей

  ```js
  const stop = watch(source, callback)

  // когда наблюдатель больше не нужен:
  stop()
  ```

  Приостановка/возобновление работы наблюдателя: <sup class="vt-badge" data-text="3.5+" />

  ```js
  const { stop, pause, resume } = watch(() => {})

  // временная приостановка работы наблюдателя
  pause()

  // возобновление работы
  resume()

  // остановка
  stop()
  ```

  Очистка от побочных эффектов:

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван, если `id` изменится, отменяя
    // предыдущий запрос, если он ещё не завершён
    onCleanup(cancel)
    data.value = await response
  })
  ```

  Устранение побочных эффектов в версии 3.5+:

  ```js
  import { onWatcherCleanup } from 'vue'

  watch(id, async (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    onWatcherCleanup(cancel)
    data.value = await response
  })
  ```

- **Смотрите также**

  - [Руководство - Наблюдатели](/guide/essentials/watchers)
  - [Руководство - Отладка наблюдателей](/guide/extras/reactivity-in-depth#watcher-debugging)

## onWatcherCleanup() <sup class="vt-badge" data-text="3.5+" /> {#onwatchercleanup}

Регистрация функцию очистки, которая будет выполняться при повторном запуске текущего наблюдателя. Может быть вызвана только во время синхронного выполнения функции эффекта `watchEffect` или функции обратного вызова `watch` (т. е. её нельзя вызывать после оператора `await` в асинхронной функции).

- **Тип**

  ```ts
  function onWatcherCleanup(
    cleanupFn: () => void,
    failSilently?: boolean
  ): void
  ```

- **Пример**

  ```ts
  import { watch, onWatcherCleanup } from 'vue'

  watch(id, (newId) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` будет вызван, если `id` изменится, отменяя
    // предыдущий запрос, если он ещё не завершён
    onWatcherCleanup(cancel)
  })
  ```
