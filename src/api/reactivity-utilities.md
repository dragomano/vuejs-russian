# Reactivity API: Утилиты {#reactivity-api-utilities}

## isRef() {#isref}

Проверяет, является ли значение объектом ref.

- **Тип**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Обратите внимание, что возвращаемый тип — это [предикат типа](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), а значит, `isRef` можно использовать в качестве защиты типа:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // тип foo сужается до Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Возвращает внутреннее значение, если аргумент является ссылкой, в противном случае возвращает сам аргумент. Это сахарная функция для `val = isRef(val) ? val.value : val`.

- **Тип**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Пример**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped сейчас гарантированно будет числом
  }
  ```

## toRef() {#toref}

Можно использовать для нормализации значений / ссылок / геттеров в ссылки (3.3+).

Также может использоваться для создания ссылки на свойство исходного реактивного объекта. Созданная ссылка синхронизируется с её исходным свойством: при изменении свойства источника будет обновлено свойство ссылки, и наоборот.

- **Тип**

  ```ts
  // сигнатура нормализации (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // сигнатура свойства объекта
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  Сигнатура нормализации (3.3+):

  ```js
  // возвращает существующие ссылки как есть
  toRef(existingRef)

  // создает readonly ref, который вызывает геттер при доступе к .value
  toRef(() => props.foo)

  // создает нормальные ссылки из нефункциональных значений
  // эквивалентно ref(1)
  toRef(1)
  ```

  Сигнатура свойства объекта:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // двусторонняя ссылка, которая синхронизируется с исходным свойством
  const fooRef = toRef(state, 'foo')

  // мутация ссылки обновляет оригинал
  fooRef.value++
  console.log(state.foo) // 2

  // при изменении оригинала также обновляется ссылка
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Обратите внимание, что это отличается от:

  ```js
  const fooRef = ref(state.foo)
  ```

  Приведённая выше ссылка **не** синхронизируется с `state.foo`, потому что `ref()` получает значение простого числа.

  Функция `toRef()` полезна, когда вы хотите передать ссылку параметром в составную функцию:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // преобразуйте `props.foo` в ref, затем передайте в
  // композитную функцию
  useSomeFeature(toRef(props, 'foo'))

  // синтаксис геттера — рекомендуется в версии 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Когда `toRef` используется с параметрами компонента, обычные ограничения на мутацию параметров остаются в силе. Попытка присвоить новое значение параметру эквивалентна попытке изменить параметр напрямую и не допускается. В этом случае вы можете рассмотреть возможность использования [`computed`](./reactivity-core#computed) с `get` и `set` вместо этого. Дополнительную информацию можно найти в руководстве по [использованию `v-model` с компонентами](/guide/components/v-model).

  При использовании сигнатуры свойства объекта `toRef()` вернёт пригодную для использования ссылку, даже если исходное свойство в данный момент не существует. Это позволяет работать с необязательными свойствами, которые не будут подхвачены [`toRefs`](#torefs).

## toValue() <sup class="vt-badge" data-text="3.3+" /> {#tovalue}

Нормализует значения / ссылки / геттеры к значениям. Это похоже на [unref()](#unref), за исключением того, что он также нормализует геттеры. Если аргумент является геттером, он будет вызван, а его возвращаемое значение будет возвращено.

Это можно использовать в [композитных функциях](/guide/reusability/composables.html) для нормализации аргумента, который может быть либо значением, либо ссылкой, либо геттером.

- **Тип**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Пример**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Нормализация аргументов в композитах:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(
      () => toValue(id),
      (id) => {
        // реагируем на изменения идентификатора
      }
    )
  }

  // эта композиция поддерживает любое из следующих действий:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Преобразует реактивный объект в обычный объект, где каждое свойство результирующего объекта является ссылкой на соответствующее свойство исходного объекта. Каждая отдельная ссылка создается с помощью [`toRef()`](#toref).

- **Тип**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Тип stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // Ссылка и оригинальное свойство «связаны»
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` полезен при возврате реактивного объекта из композитной функции, чтобы потребляющий компонент мог деструктурировать/распространить возвращённый объект без потери реактивности:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // ...логика, действующая на состояние

    // конвертация в реактивные ссылки при возвращении
    return toRefs(state)
  }

  // может деструктурироваться без потери реактивности
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` будет генерировать ссылки только на те свойства, которые перечислимы в исходном объекте во время вызова. Чтобы создать ссылку для свойства, которое может ещё не существовать, используйте [`toRef`](#toref).

## isProxy() {#isproxy}

Проверяет, является ли объект прокси, созданным с помощью [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) или [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Тип**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Проверяет, является ли объект прокси, созданным с помощью [`reactive()`](./reactivity-core#reactive) или [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Тип**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Проверяет, является ли переданное значение объектом, доступным только для чтения. Свойства объекта readonly могут изменяться, но не могут быть присвоены непосредственно через переданный объект.

Прокси, созданные с помощью [`readonly()`](./reactivity-core#readonly) и [`shallowReadonly()`](./reactivity-advanced#shallowreadonly), считаются readonly, как и ссылка [`computed()`](./reactivity-core#computed) без функции `set`.

- **Тип**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
