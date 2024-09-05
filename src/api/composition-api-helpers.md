# Composition API: Хелперы {#composition-api-helpers}

## useAttrs() {#useattrs}

Возвращает объект `attrs` из [настройки контекста](/api/composition-api-setup#setup-context), который включает в себя [обычные атрибуты](/guide/components/attrs#fallthrough-attributes) текущего компонента. Он предназначен для использования в `<script setup>`, где объект настройки контекста недоступен.

- **Тип**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Возвращает объект `slots` из [настройки контекста](/api/composition-api-setup#setup-context), который включает переданные родителям слоты как вызываемые функции, возвращающие виртуальные узлы DOM. Он предназначен для использования в `<script setup>`, где объект настройки контекста недоступен.

При использовании TypeScript обратите внимание на [`defineSlots()`](/api/sfc-script-setup#defineslots).

- **Тип**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

Это базовый помощник, который обеспечивает работу [`defineModel()`](/api/sfc-script-setup#definemodel). При использовании `<script setup>` вместо этого следует предпочесть `defineModel()`.

- Доступно только в 3.4+

- **Тип**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  )

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }
  ```

- **Пример**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

- **Подробности**

  `useModel()` можно использовать в компонентах, не относящихся к однофайловым, например, при использовании необработанной функции `setup()`. В качестве первого аргумента он принимает объект `props`, а в качестве второго — имя модели. Необязательный третий аргумент может быть использован для объявления пользовательских геттеров и сеттеров для результирующей модели ref. Обратите внимание, что в отличие от `defineModel()`, вы сами должны объявить свойства `props` и `emits`.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Возвращает неглубокую ссылку, значение которой будет синхронизировано с элементом шаблона или компонентом с соответствующим атрибутом `ref`.

- **Тип**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Пример**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Смотрите также**
  - [Руководство - Ссылки на элементы шаблона](/guide/essentials/template-refs)
  - [Руководство - Типизация ссылок на элементы в шаблоне](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Руководство - Типизация ссылок на компоненты](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Используется для генерации уникальных идентификаторов для каждого приложения для атрибутов доступности или элементов формы.

- **Тип**

  ```ts
  function useId(): string
  ```

- **Пример**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Имя:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Подробности**

  Идентификаторы, генерируемые с помощью `useId()`, уникальны для каждого приложения. С его помощью можно генерировать идентификаторы для элементов формы и атрибутов доступности. Несколько вызовов одного и того же компонента будут генерировать разные идентификаторы; несколько экземпляров одного и того же компонента, вызывающих `useId()`, также будут иметь разные идентификаторы.

  Идентификаторы, сгенерированные с помощью `useId()`, также гарантированно стабильны при рендере сервера и клиента, поэтому их можно использовать в приложениях SSR, не приводя к несоответствию гидратации.

  Если у вас есть несколько экземпляров приложения Vue для одной и той же страницы, вы можете избежать конфликтов идентификаторов, задав каждому приложению префикс ID через [`app.config.idPrefix`](/api/application#app-config-idprefix).
