---
outline: deep
---

# Рендер-функции и JSX {#render-functions-jsx}

Vue рекомендует использовать шаблоны для создания приложений в подавляющем большинстве случаев. Однако бывают ситуации, когда нам нужна вся программная мощь JavaScript. Именно здесь мы можем использовать функцию **render**.

> Если вы новичок в концепции Virtual DOM и рендер-функциях, обязательно сначала прочтите главу [Механизм отрисовки](/guide/extras/rendering-mechanism).

## Пример использования {#basic-usage}

### Создание виртуальных узлов {#creating-vnodes}

Vue предоставляет функцию `h()` для создания виртуальных узлов:

```js
import { h } from 'vue'

const vnode = h(
  'div', // тип
  { id: 'foo', class: 'bar' }, // входные параметры
  [
    /* дочерние элементы */
  ]
)
```

`h()` — это сокращение от **hyperscript**, что означает «JavaScript, создающий HTML (язык разметки гипертекста)». Это имя унаследовано от соглашений, общих для многих реализаций Virtual DOM. Более описательное имя могло бы быть `createVNode()`, но более короткое имя помогает, когда вам приходится вызывать эту функцию много раз в рендер-функции.

Функция `h()` создана для того, чтобы быть очень гибкой:

```js
// все аргументы, кроме типа, являются необязательными
h('div')
h('div', { id: 'foo' })

// В параметрах можно использовать как атрибуты, так и свойства
// Vue автоматически выбирает правильный способ назначения
h('div', { class: 'bar', innerHTML: 'привет' })

// Модификаторы параметра, такие как `.prop` и `.attr`, могут быть добавлены
// с префиксами `.` и `^` соответственно
h('div', { '.name': 'some-name', '^width': '100' })

// class и style имеют один и тот же объект/массив
// поддержка значений, которые есть в шаблонах
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// слушатели событий должны передаваться как onXxx
h('div', { onClick: () => {} })

// children может быть строкой
h('div', { id: 'foo' }, 'привет')

// входные параметры могут быть опущены, если их нет
h('div', 'привет')
h('div', [h('span', 'привет')])

// массив children может содержать смешанные vnodes и строки
h('div', ['привет', h('span', 'привет')])
```

Полученный vnode имеет следующую форму:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Примечание
Полный интерфейс `VNode` содержит множество других внутренних свойств, но настоятельно рекомендуется не полагаться ни на какие другие свойства, кроме перечисленных здесь. Это позволяет избежать непреднамеренных поломок в случае изменения внутренних свойств.
:::

### Объявление рендер-функций {#declaring-render-functions}

<div class="composition-api">

При использовании шаблонов с Composition API возвращаемое значение хука `setup()` используется для передачи данных шаблону. Однако при использовании рендер-функций мы можем напрямую вернуть рендер-функцию:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // возвращает рендер-функцию
    return () => h('div', props.msg + count.value)
  }
}
```

Рендер-функция объявляется внутри `setup()`, поэтому она, естественно, имеет доступ к входным параметрам и любому реактивному состоянию, объявленному в той же области видимости.

Помимо возврата одного vnode, вы также можете возвращать строки или массивы:

```js
export default {
  setup() {
    return () => 'привет, мир!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // используйте массив, чтобы вернуть несколько корневых узлов
    return () => [h('div'), h('div'), h('div')]
  }
}
```

:::tip Совет
Убедитесь, что вы возвращаете функцию, а не напрямую возвращаете значения! Функция `setup()` вызывается только один раз для каждого компонента, в то время как возвращаемая рендер-функция будет вызвана несколько раз.
:::

</div>
<div class="options-api">

Мы можем объявлять рендер-функции с помощью опции `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'привет'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Функция `render()` имеет доступ к экземпляру компонента через `this`.

Помимо возврата одного vnode, вы также можете возвращать строки или массивы:

```js
export default {
  render() {
    return 'привет, мир!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // используем массив, чтобы вернуть несколько корневых узлов
    return [h('div'), h('div'), h('div')]
  }
}
```

</div>

Если компоненту рендер-функции не требуется состояние экземпляра, то для краткости его можно объявить непосредственно как функцию:

```js
function Hello() {
  return 'привет, мир!'
}
```

Все верно, это действительный компонент Vue! Подробнее об этом синтаксисе см. в разделе [Функциональные компоненты](#functional-components).

### Виртуальные узлы должны быть уникальными {#vnodes-must-be-unique}

Все узлы в дереве компонентов должны быть уникальными. Это означает, что следующая рендер-функция недопустима:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Ух ты - дублированные vnodes!
    p,
    p
  ])
}
```

Если вы действительно хотите дублировать один и тот же элемент/компонент много раз, вы можете сделать это с помощью фабричной функции. Например, следующая рендер-функция - это совершенно правильный способ отображения 20 одинаковых параграфов:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) — это XML-подобное расширение для JavaScript, которое позволяет нам писать код, подобный этому:

```jsx
const vnode = <div>привет</div>
```

Внутри выражений JSX используйте фигурные скобки для вставки динамических значений:

```jsx
const vnode = <div id={dynamicId}>привет, {userName}</div>
```

В `create-vue` и Vue CLI есть опции для создания проектов с предварительно настроенной поддержкой JSX. Если вы настраиваете JSX вручную, обратитесь к документации [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) за подробностями.

Хотя JSX впервые появился в React, на самом деле он не имеет определённой семантики во время выполнения и может быть скомпилирован в различные варианты вывода. Если вы уже работали с JSX, обратите внимание, что **преобразования Vue JSX отличается от преобразований React JSX**, поэтому вы не можете использовать преобразования React JSX в приложениях Vue. Некоторые заметные отличия от React JSX включают:

- Вы можете использовать атрибуты HTML, такие как `class` и `for`, в качестве параметров — нет необходимости использовать `className` или `htmlFor`.
- Передача дочерних компонентов компонентам (т. е. слотов) [работает по-другому](#passing-slots).

Определение типов во Vue также обеспечивает вывод типов для использования TSX. При использовании TSX обязательно укажите `"jsx": "preserve"` в `tsconfig.json`, чтобы TypeScript оставлял синтаксис JSX нетронутым для обработки преобразований Vue JSX.

### Вывод типов в JSX {#jsx-type-inference}

Подобно трансформации, JSX во Vue также нуждается в различных определениях типов. В настоящее время типы Vue автоматически регистрируют типы Vue JSX глобально. Это означает, что TSX будет работать из коробки, когда будет доступен тип Vue.

Глобальные типы JSX могут вызвать конфликт при использовании вместе с другими библиотеками, которым также требуется вывод типов JSX, в частности React. Начиная с версии 3.3, Vue поддерживает указание пространства имен JSX через опцию TypeScript [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource). Мы планируем убрать регистрацию глобального пространства имён JSX по умолчанию в версии 3.4.

Для пользователей TSX предлагается установить [jsxImportSource](https://www.typescriptlang.org/tsconfig#jsxImportSource) на `'vue'` в `tsconfig.json` после обновления до 3.3, или опционально в файле с `/* @jsxImportSource vue */`. Это позволит вам отказаться от нового поведения уже сейчас и плавно перейти на него, когда выйдет 3.4.

Если есть код, который зависит от наличия глобального пространства имен `JSX`, вы можете сохранить точное поведение глобального пространства до версии 3.4, явно ссылаясь на `vue/jsx`, которое регистрирует глобальное пространство имен `JSX`.

## Рецепты рендер-функций {#render-function-recipes}

Ниже мы приведем несколько общих рецептов реализации функций шаблона в виде эквивалентных им рендер-функций / JSX.

### `v-if` {#v-if}

Шаблон:

```vue-html
<div>
  <div v-if="ok">да</div>
  <span v-else>нет</span>
</div>
```

Эквивалентная рендер-функция / JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'да') : h('span', 'нет')])
```

```jsx
<div>{ok.value ? <div>да</div> : <span>нет</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'да') : h('span', 'нет')])
```

```jsx
<div>{this.ok ? <div>да</div> : <span>нет</span>}</div>
```

</div>

### `v-for` {#v-for}

Шаблон:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Эквивалентная рендер-функция / JSX:

<div class="composition-api">

```js
h(
  'ul',
  // предполагается, что `items` -—это ссылка со значением массива
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Параметры с именами, начинающимися с `on`, за которыми следует заглавная буква, рассматриваются как слушатели событий. Например, `onClick` — это эквивалент `@click` в шаблонах.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Нажми меня'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Нажми меня
</button>
```

#### Модификаторы событий {#event-modifiers}

Для модификаторов событий `.passive`, `.capture` и `.once` они могут быть объединены после имени события с использованием «верблюжьего» регистра.

Например:

```js
h('input', {
  onClickCapture() {
    /* слушатель в режиме захвата */
  },
  onKeyupOnce() {
    /* срабатывает только один раз */
  },
  onMouseoverOnceCapture() {
    /* один раз + захват */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Для других модификаторов событий и ключей можно использовать хелпер [`withModifiers`](/api/render-function#withmodifiers):

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Компоненты {#components}

Чтобы создать vnode для компонента, первым аргументом, передаваемым в `h()`, должно быть определение компонента. Это означает, что при использовании рендер-функций нет необходимости регистрировать компоненты — вы можете просто использовать импортированные компоненты напрямую:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Как мы видим, `h` может работать с компонентами, импортированными из файлов любого формата, если это корректный компонент Vue.

Динамические компоненты просты в использовании с рендер-функциями:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Если компонент зарегистрирован по имени и не может быть импортирован напрямую (например, глобально зарегистрирован библиотекой), его можно программно разрешить с помощью хелпера [`resolveComponent()`](/api/render-function#resolvecomponent).

### Отрисовка слотов {#rendering-slots}

<div class="composition-api">

В рендер-функциях доступ к слотам можно получить из контекста `setup()`. Каждый слот в объекте `slots` представляет собой **функцию, возвращающую массив vnodes**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // слот по умолчанию:
      // <div><slot /></div>
      h('div', slots.default()),

      // именованный слот:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

JSX-эквивалент:

```jsx
// по умолчанию
<div>{slots.default()}</div>

// именованный
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

В рендер-функциях доступ к слотам можно получить из [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

JSX-эквивалент:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Передача слотов {#passing-slots}

Передача дочерних элементов компонентам работает немного иначе, чем передача дочерних элементов элементам. Вместо массива нам нужно передать либо слот-функцию, либо объект слот-функции. Функции слота могут возвращать всё, что может возвращать обычная рендер-функция, которые всегда будут нормализованы в массивы vnodes при обращении к ним в дочернем компоненте.

```js
// один слот по умолчанию
h(MyComponent, () => 'привет')

// именованные слоты
// обратите внимание, что `null` требуется для того,
// чтобы объект слота не рассматривался как параметр
h(MyComponent, null, {
  default: () => 'слот по умолчанию',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'раз'), h('span', 'два')]
})
```

JSX equivalent:

```jsx
// по умолчанию
<MyComponent>{() => 'привет'}</MyComponent>

// именованный
<MyComponent>{{
  default: () => 'слот по умолчанию',
  foo: () => <div>foo</div>,
  bar: () => [<span>раз</span>, <span>два</span>]
}}</MyComponent>
```

Передача слотов как функций позволяет лениво вызывать их дочерним компонентом. Это приводит к тому, что зависимости слота отслеживаются дочерним слотом, а не родительским, что обеспечивает более точное и эффективное обновление.

### Слоты с ограниченной областью видимости {#scoped-slots}

Чтобы отобразить слот в родительском компоненте, слот передается в дочерний компонент. Обратите внимание, что теперь у слота есть параметр `text`. Слот будет вызван в дочернем компоненте, а данные из дочернего компонента будут переданы в родительский компонент.

```js
// родительский компонент
export default {
  setup() {
    return () =>
      h(MyComp, null, {
        default: ({ text }) => h('p', text)
      })
  }
}
```

Не забудьте передать `null`, чтобы слоты не рассматривались как параметры.

```js
// дочерний компонент
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

JSX-эквивалент:

```jsx
<MyComponent>
  {{
    default: ({ text }) => <p>{text}</p>
  }}
</MyComponent>
```

### Встроенные компоненты {#built-in-components}

[Встроенные компоненты](/api/built-in-components), такие как `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` и `<Suspense>` должны быть импортированы для использования в рендер-функциях:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup() {
    return () => h(Transition, { mode: 'out-in' } /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render() {
    return h(Transition, { mode: 'out-in' } /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

Директива `v-model` расширяется до параметров `modelValue` и `onUpdate:modelValue` на этапе компиляции шаблона — нам придётся предоставить эти параметры самостоятельно:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) =>
        this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Пользовательские директивы {#custom-directives}

Пользовательские директивы могут быть применены к vnode с помощью [`withDirectives`](/api/render-function#withdirectives):

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

Если директива зарегистрирована по имени и не может быть импортирована напрямую, её можно разрешить с помощью хелпера [`resolveDirective`](/api/render-function#resolvedirective).

### Ссылки на элементы шаблона {#template-refs}

<div class="composition-api">

В Composition API ссылки на элементы шаблона создаются путём передачи в vnode самого `ref()` в качестве параметра:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

или (начиная с версии >= 3.5)

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="divEl">
    return () => h('div', { ref: 'my-div' })
  }
}
```

</div>
<div class="options-api">

С помощью API Options ссылки на элементы шаблона создаются путём передачи имени ссылки в виде строки в параметре vnode:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Функциональные компоненты {#functional-components}

Функциональные компоненты — это альтернативная форма компонентов, которые не имеют собственного состояния. Они действуют как чистые функции: параметры — внутрь, виртуальные узлы — наружу. Они отображаются без создания экземпляра компонента (т. е. нет `this`), и без обычных хуков жизненного цикла компонентов.

Для создания функционального компонента мы используем обычную функцию, а не объект опций. Эта функция фактически является функцией `render` для компонента.

<div class="composition-api">

Сигнатура функционального компонента такая же, как и у хука `setup()`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Поскольку для функционального компонента не существует ссылки `this`, Vue передаст `props` в качестве первого аргумента:

```js
function MyComponent(props, context) {
  // ...
}
```

Второй аргумент, `context`, содержит три свойства: `attrs`, `emit` и `slots`. Они эквивалентны свойствам экземпляра [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit) и [`$slots`](/api/component-instance#slots) соответственно.

</div>

Большинство обычных параметров конфигурации компонентов недоступны для функциональных компонентов. Однако можно определить [`props`](/api/options-state#props) и [`emits`](/api/options-state#emits), добавив их в качестве свойств:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Если опция `props` не указана, то объект `props`, переданный функции, будет содержать все атрибуты, как и `attrs`. Имена параметров не будут нормализованы к «верблюжьему» регистру, если не указано свойство `props`.

Для функциональных компонентов с явными `props` [обычный атрибут](/guide/components/attrs) работает так же, как и с обычными компонентами. Однако для функциональных компонентов, которые явно не указывают свои `props`, по умолчанию от `attrs` будут наследоваться только `class`, `style` и `onXxx` слушателей событий. В любом случае, `inheritAttrs` можно установить в `false`, чтобы отключить наследование атрибутов:

```js
MyComponent.inheritAttrs = false
```

Функциональные компоненты можно регистрировать и использовать так же, как и обычные компоненты. Если вы передадите функцию в качестве первого аргумента в `h()`, она будет рассматриваться как функциональный компонент.

### Типизация функциональных компонентов<sup class="vt-badge ts" /> {#typing-functional-components}

Функциональные компоненты могут быть типизированы в зависимости от того, являются ли они именованными или анонимными. Volar также поддерживает проверку типов правильно типизированных функциональных компонентов при их использовании в шаблонах SFC.

**Именованный функциональный компонент**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
      {props.message}{' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Анонимный функциональный компонент**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
