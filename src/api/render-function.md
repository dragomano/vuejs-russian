# Render Function API {#render-function-apis}

## h() {#h}

Создает виртуальные узлы DOM (vnodes).

- **Тип**

  ```ts
  // полная сигнатура
  function h(
    type: string | Component,
    props?: object | null,
    children?: Children | Slot | Slots
  ): VNode

  // пропуск параметров
  function h(type: string | Component, children?: Children | Slot): VNode

  type Children = string | number | boolean | VNode | null | Children[]

  type Slot = () => Children

  type Slots = { [name: string]: Slot }
  ```

  > Типы упрощены для удобства чтения.

- **Подробности**

  Первым аргументом может быть либо строка (для родных элементов), либо определение компонента Vue. Второй аргумент — это передаваемый параметр, а третий — потомки.

  При создании компонента vnode дочерние элементы должны быть переданы как функции слота. Функция одного слота может быть передана, если компонент ожидает только слот по умолчанию. В противном случае слоты должны быть переданы как объект слот-функции.

  Для удобства аргумент props можно опустить, если дочерние объекты не являются объектами слотов.

- **Пример**

  Создание родных элементов:

  ```js
  import { h } from 'vue'

  // все аргументы, кроме типа, являются необязательными
  h('div')
  h('div', { id: 'foo' })

  // В параметрах можно использовать как атрибуты, так и свойства
  // Vue автоматически выбирает правильный способ назначения
  h('div', { class: 'bar', innerHTML: 'привет' })

  // класс и стиль имеют один и тот же объект / массив
  // поддержка значений, как в шаблонах
  h('div', { class: [foo, { bar }], style: { color: 'red' } })

  // слушатели событий должны передаваться как onXxx
  h('div', { onClick: () => {} })

  // children может быть строкой
  h('div', { id: 'foo' }, 'привет')

  // параметры могут быть опущены, если их нет
  h('div', 'привет')
  h('div', [h('span', 'привет')])

  // массив children может содержать смешанные узлы и строки
  h('div', ['привет', h('span', 'привет')])
  ```

  Создание компонентов:

  ```js
  import Foo from './Foo.vue'

  // передача параметров
  h(Foo, {
    // эквивалент some-prop="привет"
    someProp: 'привет',
    // эквивалент @update="() => {}"
    onUpdate: () => {}
  })

  // передача одного слота по умолчанию
  h(Foo, () => 'слот по умолчанию')

  // передача именованных слотов
  // обратите внимание, что `null` требуется для того,
  // чтобы слоты не рассматривались как параметр
  h(MyComponent, null, {
    default: () => 'слот по умолчанию',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
  })
  ```

- **Смотрите также** [Руководство - Рендер-функции - Создание виртуальных узлов](/guide/extras/render-function#creating-vnodes)

## mergeProps() {#mergeprops}

Слияние нескольких объектов `props` со специальной обработкой для некоторых параметров.

- **Тип**

  ```ts
  function mergeProps(...args: object[]): object
  ```

- **Подробности**

  `mergeProps()` поддерживает объединение нескольких объектов `props` с особым подходом к следующим параметрам:

  - `class`
  - `style`
  - слушатели событий `onXxx` — несколько слушателей с одинаковым именем будут объединены в массив.

  Если вам не нужно поведение слияния и требуется простая перезапись, то вместо этого можно использовать нативное распространение объектов.

- **Пример**

  ```js
  import { mergeProps } from 'vue'

  const one = {
    class: 'foo',
    onClick: handlerA
  }

  const two = {
    class: { bar: true },
    onClick: handlerB
  }

  const merged = mergeProps(one, two)
  /**
   {
     class: 'foo bar',
     onClick: [handlerA, handlerB]
   }
   */
  ```

## cloneVNode() {#clonevnode}

Клонирует виртуальный узел.

- **Тип**

  ```ts
  function cloneVNode(vnode: VNode, extraProps?: object): VNode
  ```

- **Подробности**

  Возвращает клонированный vnode, опционально с дополнительными параметрами для слияния с оригиналом.

  Узлы должны считаться неизменяемыми после создания, и вы не должны изменять параметры существующего узла. Вместо этого клонируйте его, используя другой или дополнительный параметр.

  Узлы имеют особые внутренние свойства, поэтому клонировать их не так просто, как разворачивать объекты. `cloneVNode()` обрабатывает большую часть внутренней логики.

- **Пример**

  ```js
  import { h, cloneVNode } from 'vue'

  const original = h('div')
  const cloned = cloneVNode(original, { id: 'foo' })
  ```

## isVNode() {#isvnode}

Проверяет, является ли значение vnode.

- **Тип**

  ```ts
  function isVNode(value: unknown): boolean
  ```

## resolveComponent() {#resolvecomponent}

Для ручного разрешения зарегистрированного компонента по имени.

- **Тип**

  ```ts
  function resolveComponent(name: string): Component | string
  ```

- **Подробности**

  **Примечание: вам это не нужно, если вы можете импортировать компонент напрямую.**

  `resolveComponent()` должна быть вызвана внутри <span class="composition-api">`setup()`, либо</span> функции render, чтобы разрешить из правильного контекста компонента.

  Если компонент не найден, будет выдано предупреждение во время выполнения, и будет возвращена строка имени.

- **Пример**

  <div class="composition-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    setup() {
      const ButtonCounter = resolveComponent('ButtonCounter')

      return () => {
        return h(ButtonCounter)
      }
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  import { h, resolveComponent } from 'vue'

  export default {
    render() {
      const ButtonCounter = resolveComponent('ButtonCounter')
      return h(ButtonCounter)
    }
  }
  ```

  </div>

- **Смотрите также** [Руководство - Рендер-функции - Компоненты](/guide/extras/render-function#components)

## resolveDirective() {#resolvedirective}

Для ручного разрешения зарегистрированной директивы по имени.

- **Тип**

  ```ts
  function resolveDirective(name: string): Directive | undefined
  ```

- **Подробности**

  **Примечание: вам это не нужно, если вы можете импортировать директиву напрямую.**

  `resolveDirective()` должна быть вызвана внутри<span class="composition-api">`setup()`, либо</span> функции render, чтобы разрешить из правильного контекста компонента.

  Если директива не найдена, будет выдано предупреждение, а функция вернет значение `undefined`.

- **Смотрите также** [Руководство - Рендер-функции - Пользовательские директивы](/guide/extras/render-function#custom-directives)

## withDirectives() {#withdirectives}

Для добавления пользовательских директив к vnodes.

- **Тип**

  ```ts
  function withDirectives(
    vnode: VNode,
    directives: DirectiveArguments
  ): VNode

  // [Директива, значение, аргумент, модификаторы]
  type DirectiveArguments = Array<
    | [Directive]
    | [Directive, any]
    | [Directive, any, string]
    | [Directive, any, string, DirectiveModifiers]
  >
  ```

- **Подробности**

  Обёртывает существующий vnode пользовательскими директивами. Второй аргумент — массив пользовательских директив. Каждая пользовательская директива также представлена в виде массива в форме `[Директива, значение, аргумент, модификаторы]`. Хвостовые элементы массива могут быть опущены, если они не нужны.

- **Пример**

  ```js
  import { h, withDirectives } from 'vue'

  // пользовательская директива
  const pin = {
    mounted() {
      /* ... */
    },
    updated() {
      /* ... */
    }
  }

  // <div v-pin:top.animate="200"></div>
  const vnode = withDirectives(h('div'), [
    [pin, 200, 'top', { animate: true }]
  ])
  ```

- **Смотрите также** [Руководство - Рендер-функции - Пользовательские директивы](/guide/extras/render-function#custom-directives)

## withModifiers() {#withmodifiers}

Для добавления встроенных модификаторов [`v-on`](/guide/essentials/event-handling#event-modifiers) в функцию обработчика событий.

- **Тип**

  ```ts
  function withModifiers(
    fn: Function,
    modifiers: ModifierGuardsKeys[]
  ): Function
  ```

- **Пример**

  ```js
  import { h, withModifiers } from 'vue'

  const vnode = h('button', {
    // эквивалент v-on:click.stop.prevent
    onClick: withModifiers(() => {
      // ...
    }, ['stop', 'prevent'])
  })
  ```

- **Смотрите также** [Руководство - Рендер-функции - Модификаторы событий](/guide/extras/render-function#event-modifiers)
