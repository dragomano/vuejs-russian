---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Реактивность в деталях {#reactivity-in-depth}

Одна из самых характерных особенностей Vue — ненавязчивая система реактивности. Состояние компонента состоит из реактивных объектов JavaScript. Когда вы изменяете их, вид обновляется. Это делает управление состоянием простым и интуитивно понятным, но также важно понимать, как оно работает, чтобы избежать некоторых распространённых проблем. В этом разделе мы рассмотрим некоторые детали нижнего уровня системы реактивности Vue.

## Что такое реактивность? {#what-is-reactivity}

Этот термин часто встречается в программировании, но что люди имеют в виду, когда говорят о нем? Реактивность — это парадигма программирования, которая позволяет нам подстраиваться под изменения в декларативной манере. Канонический пример, который обычно показывают, потому что это отличный пример, — это электронная таблица Excel:

<SpreadSheet />

Здесь ячейка A2 определяется формулой `= A0 + A1` (вы можете щелкнуть на A2, чтобы просмотреть или отредактировать формулу), поэтому электронная таблица выдает нам 3. Ничего удивительного. Но если вы обновите A0 или A1, вы заметите, что A2 тоже автоматически обновится.

JavaScript обычно работает не так. Если бы мы написали нечто подобное на JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // Всё ещё 3
```

Когда мы мутируем `A0`, `A2` не изменяется автоматически.

Как же это сделать в JavaScript? Во-первых, чтобы повторно выполнить код, который обновляет `A2`, давайте обернём его в функцию:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Затем нам нужно определить несколько терминов:

- Функция `update()` производит **побочный эффект**, или **эффект**, потому что она изменяет состояние программы.

- `A0` и `A1` считаются **зависимыми** от эффекта, поскольку их значения используются для выполнения эффекта. Считается, что эффект является **подписчиком** своих зависимостей.

Нам нужна волшебная функция, которая может вызывать `update()` (**эффект**) всякий раз, когда `A0` или `A1` (**зависимости**) изменяются:

```js
whenDepsChange(update)
```

Эта функция `whenDepsChange()` выполняет следующие задачи:

1. Отслеживает момент считывания переменной. Например, при вычислении выражения `A0 + A1` считываются и `A0`, и `A1`.

2. Если переменная считывается, когда в данный момент выполняется эффект, эффект становится подписчиком этой переменной. Например, поскольку `A0` и `A1` читаются во время выполнения `update()`, `update()` становится подписчиком и `A0`, и `A1` после первого вызова.

3. Определяет, когда переменная мутирует. Например, когда `A0` будет присвоено новое значение, функция сообщает всем его эффектам-подписчикам о необходимости повторного выполнения.

## Как работает реактивность в Vue {#how-reactivity-works-in-vue}

Мы не можем отслеживать чтение и запись локальных переменных, как в примере. В ванильном JavaScript просто нет механизма для этого. Но что мы **можем** сделать, так это перехватить чтение и запись **свойств объекта**.

Существует два способа перехвата доступа к свойствам в JavaScript: [геттер](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/get) / [сеттер](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Functions/set) и [Прокси](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 использовал геттеры/сеттеры исключительно из-за ограничений поддержки браузерами. В Vue 3 прокси используются для реактивных объектов, а геттеры/сеттеры — для реактивных ссылок. Вот псевдокод, иллюстрирующий их работу:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip Примечание
Сниппеты кода здесь и далее призваны объяснить основные концепции в максимально простой форме, поэтому многие детали опущены, а крайние случаи проигнорированы.
:::

Это объясняет некоторые [ограничения реактивных объектов](/guide/essentials/reactivity-fundamentals#limitations-of-reactive), которые мы обсуждали в разделе «Основы»:

- Когда вы присваиваете или деструктурируете свойство реактивного объекта локальной переменной, доступ или присвоение этой переменной становится нереактивным, поскольку больше не вызывает прокси-ловушки get/set на исходном объекте. Заметьте, что это «разъединение» влияет только на привязку переменной — если переменная указывает на непервичное значение, например, объект, мутирование объекта всё равно будет реактивным.

- Возвращенный прокси из `reactive()`, хотя и ведёт себя так же, как и оригинал, имеет другую идентичность, если мы сравним его с оригиналом с помощью оператора `===`.

Внутри `track()` мы проверяем, запущен ли в данный момент эффект. Если таковой имеется, мы ищем эффекты подписчиков (хранящиеся в Set) для отслеживаемого свойства и добавляем эффект в Set:

```js
// Это будет установлено непосредственно перед началом эффекта
// для запуска. Мы разберемся с этим позже.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Подписки на эффекты хранятся в глобальной структуре данных `WeakMap<target, Map<key, Set<effect>>>`. Если для свойства (отслеживаемого впервые) не было найдено набора эффектов подписки, он будет создан. Вот что вкратце делает функция `getSubscribersForProperty()`. Для простоты мы опустим её подробности.

Внутри `trigger()` мы снова ищем эффекты подписчика для свойства. Но на этот раз мы обращаемся к ним:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Теперь давайте вернемся к функции `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Она оборачивает необработанную функцию `update` в эффект, который устанавливает себя в качестве текущего активного эффекта перед выполнением фактического обновления. Это позволяет вызывать `track()` во время обновления для определения местоположения текущего активного эффекта.

На данном этапе мы создали эффект, который автоматически отслеживает свои зависимости и запускается заново при изменении зависимости. Мы называем это **реактивным эффектом**.

Vue предоставляет API, позволяющий создавать реактивные эффекты: [`watchEffect()`](/api/reactivity-core#watcheffect). На самом деле, вы могли заметить, что он работает примерно так же, как магический `whenDepsChange()` в примере. Теперь мы можем переделать исходный пример, используя актуальные API Vue:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // отслеживает A0 и A1
  A2.value = A0.value + A1.value
})

// вызывает эффект
A0.value = 2
```

Использование реактивного эффекта для изменения ссылки не самый интересный вариант использования — на самом деле, использование вычисляемого свойства делает его более декларативным:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Внутри `computed` управляет своим аннулированием и повторным вычислением с помощью реактивного эффекта.

Итак, каков пример распространённого и полезного реактивного эффекта? Что ж, обновляем DOM! Мы можем реализовать простую «реактивную отрисовку» вот так:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `count is: ${count.value}`
})

// обновляет DOM
count.value++
```

На самом деле, это очень похоже на то, как компонент Vue поддерживает состояние и DOM в синхронизации — каждый экземпляр компонента создает реактивный эффект для отрисовки и обновления DOM. Конечно, компоненты Vue используют гораздо более эффективные способы обновления DOM, чем `innerHTML`. Это обсуждается в главе [Механизм отрисовки](./rendering-mechanism).

<div class="options-api">

API `ref()`, `computed()` и `watchEffect()` являются частью API Composition. Если вы до сих пор использовали только Options API с Vue, вы заметите, что Composition API ближе к тому, как работает система реактивности Vue под капотом. Фактически, в Vue 3 API Options реализован поверх API Composition. Все обращения к свойствам экземпляра компонента (`this`) вызывают геттеры/сеттеры для отслеживания реактивности, а такие свойства, как `watch` и `computed`, вызывают свои эквиваленты Composition API внутри компонента.

</div>

## Время выполнения по сравнению с временем компиляции {#runtime-vs-compile-time-reactivity}

Система реактивности Vue в основном основана на времени выполнения: отслеживание и срабатывание происходит во время выполнения кода непосредственно в браузере. Плюсы реактивности во время выполнения в том, что она может работать без этапа сборки, и в том, что в ней меньше крайних случаев. С другой стороны, это делает его ограниченным синтаксическими ограничениями JavaScript, что приводит к необходимости использования контейнеров значений, таких как Vue refs.

Некоторые фреймворки, например [Svelte](https://svelte.dev/), решают преодолеть эти ограничения, реализуя реактивность во время компиляции. Он анализирует и преобразует код, чтобы смоделировать реактивность. Этап компиляции позволяет фреймворку изменять семантику самого JavaScript — например, неявно внедрять код, выполняющий анализ зависимостей и срабатывание эффектов при доступе к локально определенным переменным. Недостатком является то, что такие преобразования требуют этапа сборки, а изменение семантики JavaScript — это, по сути, создание языка, который выглядит как JavaScript, но компилируется во что-то другое.

Команда Vue исследовала это направление с помощью экспериментальной функции под названием [Трансформация реактивности](/guide/extras/reactivity-transform), но в итоге мы решили, что она не подходит для проекта по причине, [описанной здесь](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Отладка реактивности {#reactivity-debugging}

Замечательно, что система реактивности Vue автоматически отслеживает зависимости, но в некоторых случаях мы можем захотеть выяснить, что именно отслеживается или что вызывает повторную отрисовку компонента.

### Отладочные хуки для компонентов {#component-debugging-hooks}

Мы можем отладить, какие зависимости используются во время отрисовки компонента и какая зависимость запускает обновление, используя такие хуки жизненного цикла, как <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked` </span> и <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Оба хука получат событие отладчика, содержащее информацию о рассматриваемой зависимости. Рекомендуется поместить в обратные вызовы оператор `debugger` для интерактивной проверки зависимости:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip Примечание
Хуки отладки компонентов работают только в режиме разработки.
:::

Объекты событий отладки имеют следующий тип:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Отладка вычисляемых свойств {#computed-debugging}

<!-- TODO options API equivalent -->

Мы можем отлаживать вычисляемые свойства, передавая `computed()` второй объект параметров с обратными вызовами `onTrack` и `onTrigger`:

- `onTrack` будет вызван, когда реактивное свойство или ссылка будет отслежена как зависимость.
- `onTrigger` будет вызван, когда обратный вызов наблюдателя будет вызван мутацией зависимости.

Оба обратных вызова будут получать события отладчика в [том же формате](#debugger-event), что и отладочные хуки компонентов:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // срабатывает, когда count.value отслеживается как зависимость
    debugger
  },
  onTrigger(e) {
    // срабатывает при изменении значения count.value
    debugger
  }
})

// доступ к plusOne, должен сработать onTrack
console.log(plusOne.value)

// мутация count.value, должен сработать onTrigger
count.value++
```

:::tip Примечание
Вычисляемые свойства `onTrack` и `onTrigger` работают только в режиме разработки.
:::

### Отладка наблюдателей {#watcher-debugging}

<!-- TODO options API equivalent -->

Подобно `computed()`, наблюдатели также поддерживают свойства `onTrack` и `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip Примечание
Свойства наблюдателя `onTrack` и `onTrigger` работают только в режиме разработки.
:::

## Интеграция с внешними системами управления состоянием {#integration-with-external-state-systems}

Система реактивности Vue работает за счёт глубокого преобразования обычных объектов JavaScript в реактивные прокси. Глубокое преобразование может быть ненужным, а иногда и вовсе нежелательным при интеграции с внешними системами управления состоянием (например, если внешнее решение также использует прокси).

Общая идея интеграции системы реактивности Vue с решением для управления состоянием состоит в том, чтобы хранить внешнее состояние в [`shallowRef`](/api/reactivity-advanced#shallowref). Неглубокая ссылка реагирует только при доступе к её свойству `.value` — внутреннее значение остаётся нетронутым. Когда внешнее состояние изменится, замените значение ref, чтобы запустить обновления.

### Неизменяемые данные {#immutable-data}

Если вы реализуете функцию отмены/повтора, вам, вероятно, захочется делать снимок состояния приложения при каждом редактировании пользователем. Однако система изменяемой реактивности Vue не лучше всего подходит для этого, если дерево состояний велико, поскольку сериализация всего объекта состояния при каждом обновлении может быть дорогостоящей с точки зрения затрат как на процессор, так и на память.

[Неизменяемые структуры данных](https://en.wikipedia.org/wiki/Persistent_data_structure) решают эту проблему, никогда не изменяя объекты состояния — вместо этого создаются новые объекты, которые имеют одинаковые, неизменённые части со старыми. Существуют разные способы использования неизменяемых данных в JavaScript, но мы рекомендуем использовать [Immer](https://immerjs.github.io/immer/) с Vue, поскольку он позволяет использовать неизменяемые данные, сохраняя при этом более эргономичный изменяемый синтаксис.

Мы можем интегрировать Immer с Vue с помощью простой компоновки:

```js
import produce from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNplU8Fu2zAM/RXOlzpAYu82zEu67lhgpw3bJcrBs5VYqywJkpxmMPzvoyjZNRodbJF84iOppzH7ZkxxHXhWZXvXWGE8OO4H88iU6I22HkYYHH/ue25hgrPVPTwUpQh28dc9MAXAVKOV83AUnvduC4Npa8+fg3GCw3I8PwbwGD64vPCSV8Cy77y2Cn4PnGXbFGu1wpC36EPHRO67c78cD6fgVfgOiOB9gnMtXczA1GnDFFPnQTVeaAVeXy6SSsyFavltE/OvKs+pGTg8zsxkHwl9KgIBtvbhzkl0yIWU+zIOFEeJBgKNxORoAewHSX/cSQHX3VnbA8vyMXa3pfqxb0i1CRXZWZb6w1U1snYOT40JvQ4+NVI0Lxi865NliTisMRHChOVSNaUUscCSKtyXq7LRdP6fDNvYPw3G85vftbzRtg6TrUAKxXe+s3q4dF/mQdC5bJtFTe362qB4tELVURKWAthhNc87+OhSw2V33htXleWgzMulaHQfFfj0ufhYfCpb4XySJHc9Zv7a63aQqKh0+xNRR8kiZ1K2sYhqeBI1xVHPi+xdV0upX3/w8yJ8fCiIYIrfCLPIaZH4n9rxnx7nlQQVH4YLHpTLW8YV8A0W1Ye4PO7sZiU/ylFca4mSP8yl5yvv/O4sZcSmw8/iW8bXdSTcjDiFgUz/AcH6WZQ=)

### Конечные автоматы {#state-machines}

[Конечный автомат](https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BD%D0%B5%D1%87%D0%BD%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82) — это модель для описания всех возможных состояний, в которых может находиться приложение, и всех возможных способов перехода из одного состояния в другое. Хотя это может быть излишним для простых компонентов, это может помочь сделать сложные потоки состояний более надёжными и управляемыми.

Одной из самых популярных реализаций конечного автомата в JavaScript является [XState](https://xstate.js.org/). Вот составной компонент, который с ним интегрируется:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) — библиотека для работы с асинхронными потоками событий. Библиотека [VueUse](https://vueuse.org/) предоставляет надстройку [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) для подключения потоков RxJS к системе реактивности Vue.

## Подключение к сигналам {#connection-to-signals}

Многие другие фреймворки ввели примитивы реактивности, похожие на ссылки из API композиции Vue, под термином «сигналы»:

- [Solid Signals](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Signals](https://github.com/angular/angular/discussions/49090)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

По сути, сигналы — это тот же примитив реактивности, что и ссылки Vue. Это контейнер значений, который обеспечивает отслеживание зависимостей при доступе и срабатывание побочных эффектов при мутации. Эта парадигма, основанная на реактивных примитивах, не является особенно новой концепцией в мире внешнего интерфейса: она восходит к таким реализациям, как [Knockout observables](https://knockoutjs.com/documentation/observables.html) и [Meteor Tracker](https://docs.meteor.com/api/tracker.html), сделанные более десяти лет назад. API Vue Options и библиотека управления состоянием React [MobX](https://mobx.js.org/) также основаны на тех же принципах, но скрывают примитивы за свойствами объекта.

Хотя это не является обязательным признаком для того, чтобы что-то можно было квалифицировать как сигнал, сегодня эта концепция часто обсуждается вместе с моделью отрисовки, где обновления выполняются посредством детальных подписок. Из-за использования Virtual DOM Vue в настоящее время [полагается на компиляторы для достижения аналогичной оптимизации](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Однако мы также изучаем новую стратегию компиляции, вдохновлённую Solid (режим Vapor), которая не полагается на Virtual DOM и использует больше преимуществ встроенной системы реактивности Vue.

### Компромиссы при проектировании API {#api-design-trade-offs}

Дизайн сигналов Preact и Qwik очень похож на [shallowRef](/api/reactivity-advanced#shallowref) Vue: все три предоставляют изменяемый интерфейс через свойство `.value`. Мы сосредоточим обсуждение на сигналах Solid и Angular.

#### Сигналы Solid {#solid-signals}

В дизайне API `createSignal()` в Solid особое внимание уделяется разделению чтения и записи. Сигналы предоставляются как геттер, доступный только для чтения, и отдельный сеттер:

```js
const [count, setCount] = createSignal(0)

count() // доступ к значению
setCount(1) // обновление значения
```

Обратите внимание, как сигнал `count` может передаваться без сеттера. Это гарантирует, что состояние никогда не сможет быть изменено, если только сеттер не будет явно предоставлен. Оправдывает ли эта гарантия безопасности более подробный синтаксис, может зависеть от требований проекта и личного вкуса — но если вы предпочитаете этот стиль API, вы можете легко воспроизвести его в Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Сигналы Angular {#angular-signals}

Angular претерпевает некоторые фундаментальные изменения: отказ от грязных проверок и введение собственной реализации примитива реактивности. API сигналов в Angular выглядит следующим образом:

```js
const count = signal(0)

count() // доступ к значению
count.set(1) // установка нового значения
count.update((v) => v + 1) // обновление на основе предыдущего значения

// мутация глубоких объектов с одинаковой идентичностью
const state = signal({ count: 0 })
state.mutate((o) => {
  o.count++
})
```

Опять же, мы можем легко скопировать API в Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  s.mutate = (mutator) => {
    mutator(r.value)
    triggerRef(r)
  }
  return s
}
```

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9UslOwzAQ/ZVRLiRQEsqxpBUIvoADp0goTd3U4DiWl4AU5d8ZL3E3iZtn5r1Z3vOYvAiRD4Ykq6RUjaRCgyLaiE3FaSd6qWEERVteswU0fSeMJjuYYC/7Dm7youatYbW895D8S91UvOJNz5VGuOEa1oGePmRzYdebLSNYmRumaQbrjSfg8xYeEVsWfh/cBANNOsFqTTACKA/LzavrTtUKxjEyp6kssDZj3vygAPJjL1Bbo3XP4blhtPleV4nrlBuxw1npYLca4A6WWZU4PADljSQd4drRC8//rxfKaW+f+ZJg4oJbFvG8ZJFcaYreHL041Iz1P+9kvwAtadsS6d7Rm1rB55VRaLAzhvy6NnvDG01x1WAN5VTTmn3UzJAMRrudd0pa++LEc9wRpRDlHZT5YGu2pOzhWHAJWxvnakxOHufFxqx/4MxzcEinIYP+eV5ntOe5Rx94IYjopxOZUhnIEr+4xPMrjuG1LPFftkTj5DNJGhwYBZ4BJz3DV56FmJLpD1DrKXU=)

По сравнению с ссылками Vue, стиль API Solid и Angular, основанный на геттерах, обеспечивает некоторые интересные компромиссы при использовании в компонентах Vue:

- `()` немного менее подробен, чем `.value`, но обновление значения более подробное.
- Нет развёртывания ссылок: для доступа к значениям всегда требуется `()`. Это делает доступ к значениям единообразным повсюду. Это также означает, что вы можете передавать необработанные сигналы в качестве свойств компонента.

Подходят ли вам эти стили API, в некоторой степени субъективно. Наша цель здесь — продемонстрировать основное сходство и компромиссы между этими различными конструкциями API. Мы также хотим показать, что Vue является гибким: вы не привязаны к существующим API. При необходимости вы можете создать свой собственный примитивный API реактивности для удовлетворения более конкретных потребностей.
