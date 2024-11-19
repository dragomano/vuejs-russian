---
pageClass: api
---

# Встроенные компоненты {#built-in-components}

:::info Регистрация и использование
Встроенные компоненты можно использовать непосредственно в шаблонах без необходимости их регистрации. Они также устойчивы к «tree-shakeable» («дрожанию деревьев»): они включаются в сборку только тогда, когда используются.

При использовании их в [рендер-функциях](/guide/extras/render-function) их нужно импортировать явно. Например:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Обеспечивает анимированные эффекты перехода к **одному** элементу или компоненту.

- **Пропсы**

  ```ts
  interface TransitionProps {
    /**
     * Используется для автоматической генерации имен CSS-классов переходов.
     * Например, `name: 'fade'` будет автоматически расширяться до `.fade-enter`,
     * `.fade-enter-active`, и т. д.
     */
    name?: string
    /**
     * Нужно ли применять классы переходов CSS.
     * По умолчанию: true
     */
    css?: boolean
    /**
     * Указывает тип событий перехода, которые следует ожидать
     * для определения времени окончания перехода.
     * Поведение по умолчанию - автоматическое определение типа,
     * имеющего большую продолжительность.
     */
    type?: 'transition' | 'animation'
    /**
     * Указывает явную продолжительность перехода.
     * Поведение по умолчанию - ожидание первого события `transitionend`
     * или `animationend` на корневом элементе перехода.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Управляет временной последовательностью переходов выхода/входа.
     * По умолчанию используется одновременное поведение.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Применять ли переход при первоначальной отрисовке.
     * По умолчанию: false
     */
    appear?: boolean

    /**
     * Параметры для настройки классов переходов.
     * Используйте кебабный регистр в шаблонах, например, enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **События**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (только `v-show`)
  - `@appear-cancelled`

- **Пример**

  Простой элемент:

  ```vue-html
  <Transition>
    <div v-if="ok">переключенное содержимое</div>
  </Transition>
  ```

  Принудительный переход путём изменения атрибута `key`:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Динамический компонент, с режимом перехода + анимация при появлении:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Прослушивание событий переходного периода:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">переключенное содержимое</div>
  </Transition>
  ```

- **Смотрите также** [Руководство по `<Transition>`](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Обеспечивает эффекты перехода для **множества** элементов или компонентов в списке.

- **Пропсы**

  `<TransitionGroup>` принимает те же параметры, что и `<Transition>`, за исключением `mode`, плюс два дополнительных параметра:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Если не определено, отображается как фрагмент.
     */
    tag?: string
    /**
     * Для настройки класса CSS, применяемого во время переходов.
     * Используйте кебабный регистр в шаблонах, например, move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **События**

  `<TransitionGroup>` испускает те же события, что и `<Transition>`.

- **Подробности**

  По умолчанию `<TransitionGroup>` не отображает обёрточный DOM-элемент, но его можно определить с помощью свойства `tag`.

  Обратите внимание, что каждый дочерний элемент в `<transition-group>` должен иметь [**уникальный ключ**](/guide/essentials/list#maintaining-state-with-key), чтобы анимация работала правильно.

  `<TransitionGroup>` поддерживает перемещение переходов с помощью трансформации CSS. Когда положение дочернего элемента на экране изменится после обновления, к нему будет применён перемещаемый CSS-класс (автоматически сгенерированный из атрибута `name` или настроенный с помощью параметра `move-class`). Если свойство CSS `transform` имеет значение «transition-able», то при применении класса перемещения элемент будет плавно анимирован до места назначения с помощью техники [FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Пример**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Смотрите также** [Руководство по `TransitionGroup`](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Кэширует динамически переключенные компоненты, обёрнутые внутри.

- **Пропсы**

  ```ts
  interface KeepAliveProps {
    /**
     * Если указано, будут кэшироваться только
     * компоненты с именами, совпадающими с `include`.
     */
    include?: MatchPattern
    /**
     * Любой компонент с именем, совпадающим с `exclude`, не будет кэшироваться.
     */
    exclude?: MatchPattern
    /**
     * Максимальное количество экземпляров компонентов для кэширования.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Подробности**

  При обёртывании вокруг динамического компонента `<KeepAlive>` кэширует неактивные экземпляры компонента, не уничтожая их.

  В любой момент времени может существовать только один активный экземпляр компонента в качестве прямого дочернего элемента `<KeepAlive>`.

  Когда компонент переключается внутри `<KeepAlive>`, его `активированный` и `деактивированный` хуки жизненного цикла будут вызываться соответствующим образом, предоставляя альтернативу `mounted` и `unmounted`, которые не вызываются. Это относится как к прямому потомку `<KeepAlive>`, так и ко всем его потомкам.

- **Пример**

  Пример использования:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  При использовании ветвей `v-if` / `v-else` одновременно должен отображаться только один компонент:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Используется вместе с `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Использование `include` / `exclude`:

  ```vue-html
  <!-- строка, разделенная запятыми -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- регулярное выражение (use `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- массив (use `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Usage with `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Смотрите также** [Руководство по `KeepAlive`](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Передает содержимое своего слота в другую часть DOM.

- **Пропсы**

  ```ts
  interface TeleportProps {
    /**
     * Обязателен. Укажите целевой контейнер.
     * Может быть либо селектором, либо фактическим элементом.
     */
    to: string | HTMLElement
    /**
     * Если `true`, содержимое останется на прежнем месте,
     * а не будет перемещено в целевой контейнер.
     * Может изменяться динамически.
     */
    disabled?: boolean
    /**
     * Если `true`, телепорт будет отложен до тех пор, пока другие
     * части приложения не достигнут своей цели. (3.5+)
     */
    defer?: boolean
  }
  ```

- **Пример**

  Указание целевого контейнера:

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  Отключение по условию:

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  Откладывание решения задачи <sup class="vt-badge" data-text="3.5+" />:

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>
  <!-- где-то позже в шаблоне -->
  <div id="late-div"></div>
  ```

- **Смотрите также** [Руководство по `Teleport`](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Используется для управления вложенными асинхронными зависимостями в дереве компонентов.

- **Пропсы**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **События**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Подробности**

  `<Suspense>` принимает два слота: слот `#default` и слот `#fallback`. Он отобразит содержимое запасного слота во время отрисовки слота по умолчанию в памяти.

  Если при отображении слота по умолчанию он встретит асинхронные зависимости ([Асинхронные компоненты](/guide/components/async) и компоненты с [`async setup()`](/guide/built-ins/suspense#async-setup)), он будет ждать, пока все они не будут разрешены, прежде чем отобразить слот по умолчанию.

  Если установить для Suspense значение `suspensible`, вся асинхронная обработка зависимостей будет обрабатываться родительским Suspense. См. [подробности реализации](https://github.com/vuejs/core/pull/6736)

- **Смотрите также** [Руководство по `Suspense`](/guide/built-ins/suspense)
