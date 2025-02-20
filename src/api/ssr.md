# Server Side Rendering API {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Пример**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### Контекст SSR {#ssr-context}

  Можно передать необязательный объект контекста, который может быть использован для записи дополнительных данных во время отрисовки, например, [содержимого телепортов](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  Большинство других SSR API на этой странице также опционально принимают объект контекста. Доступ к объекту контекста можно получить в коде компонента с помощью хелпера [useSSRContext](#usessrcontext).

- **Смотрите также** [Руководство - Рендеринг на стороне сервера](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Отображает входные данные в виде [Node.js ReadableStream](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Пример**

  ```js
  // внутри http-обработчика Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Примечание
  Этот метод не поддерживается в ESM-сборке `vue/server-renderer`, которая отвязана от окружения Node.js. Вместо этого используйте [`pipeToNodeWritable`](#pipetonodewritable).
  :::

## pipeToNodeWritable() {#pipetonodewritable}

Отрисовка и передача в существующий экземпляр [Node.js WritableStream](https://nodejs.org/api/stream.html#stream_writable_streams).

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Пример**

  ```js
  // внутри http-обработчика Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Отображает входные данные в виде [Web ReadableStream](https://developer.mozilla.org/ru/docs/Web/API/Streams_API).

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Пример**

  ```js
  // в среде с поддержкой ReadableStream
  return new Response(renderToWebStream(app))
  ```

  :::tip Примечание
  В окружениях, которые не открывают конструктор `ReadableStream` в глобальной области видимости, вместо него следует использовать [`pipeToWebWritable()`](#pipetowebwritable).
  :::

## pipeToWebWritable() {#pipetowebwritable}

Отрисовка и передача в существующий экземпляр [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream).

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Пример**

  Обычно используется в сочетании с [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream доступен в таких средах, как CloudFlare workers.
  // В Node.js TransformStream должен быть явно импортирован из 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Просматривает входные данные в потоковом режиме с помощью простого читаемого интерфейса.

- **Экспортируется из `vue/server-renderer`**

- **Тип**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Пример**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // готово
          console(`отрисовка завершена: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // возникла ошибка
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

API времени выполнения, используемый для получения объекта контекста, переданного в `renderToString()` или другие серверные API рендеринга.

- **Тип**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Пример**

  Полученный контекст может быть использован для добавления информации, необходимой для отрисовки конечного HTML (например, метаданных заголовка).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // следите за тем, чтобы вызывать его только во время SSR
  // https://dragomano.github.io/vite-docs/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...прикрепляем свойства к контексту
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

Специальный атрибут, который можно использовать для подавления [несоответствий гидратации](/guide/scaling-up/ssr#hydration-mismatch).

- **Пример**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  Значение может ограничивать допустимое несоответствие определённым типом. Допустимые значения:

  - `text`
  - `children` (допускает несовпадение только для прямых потомков)
  - `class`
  - `style`
  - `attribute`

  Если значение не указано, будут разрешены все типы несоответствий.
