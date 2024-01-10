# Обработка событий {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Бесплатный урок по событиям Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Бесплатный урок по событиям Vue.js"/>
</div>

## Прослушивание событий {#listening-to-events}

Мы можем использовать директиву `v-on`, которую обычно сокращают до символа `@`, для прослушивания событий DOM и запуска некоторого JavaScript при их наступлении. Использовать можно `v-on:click="handler"` или с помощью сокращения `@click="handler"`.

Значение обработчика может быть одним из следующих:

1. **Встроенные обработчики:** встроенный код JavaScript, который будет выполняться при срабатывании события (аналогично встроенному атрибуту onclick).

2. **Обработчики методов.** Имя свойства или путь, указывающий на метод, определенный в компоненте.

## Встроенные обработчики {#inline-handlers}

Встроенные обработчики обычно используются в простых случаях, например:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Добавить 1</button>
<p>Счётчик: {{ count }}</p>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## Обработчики методов {#method-handlers}

Однако логика многих обработчиков событий будет более сложной и, скорее всего, не будет реализована с помощью встроенных обработчиков. Поэтому `v-on` может также принимать имя или путь к методу компонента, который вы хотите вызвать.

Например:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Привет, ${name.value}!`)
  // `event` - это собственное событие DOM
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` внутри методов указывает на текущий активный экземпляр
    alert(`Привет, ${this.name}!`)
    // `event` — это собственное событие DOM
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` — это имя метода, определённого выше -->
<button @click="greet">Приветствовать</button>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

Обработчик метода автоматически получает собственный объект DOM Event, который его запускает — в примере выше мы можем получить доступ к элементу, отправившему событие, через `event.target.tagName`.

<div class="composition-api">

Смотрите также: [Типизация обработчиков событий](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Смотрите также: [Типизация обработчиков событий](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Метод против встроенного обнаружения {#method-vs-inline-detection}

Компилятор шаблонов обнаруживает обработчики методов, проверяя, является ли строка значения `v-on` корректным идентификатором JavaScript или путём доступа к свойству. Например, `foo`, `foo.bar` и `foo['bar']` рассматриваются как обработчики методов, а `foo()` и `count++` — как встроенные обработчики.

## Вызов методов во встроенных обработчиках {#calling-methods-in-inline-handlers}

Вместо того чтобы привязываться непосредственно к имени метода, мы можем вызывать методы во встроенном обработчике. Это позволяет нам передавать методу пользовательские аргументы вместо собственных событий:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Поздороваться</button>
<button @click="say('bye')">Попрощаться</button>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## Доступ к аргументу события во встроенных обработчиках {#accessing-event-argument-in-inline-handlers}

Иногда нам также нужно получить доступ к исходному событию DOM во встроенном обработчике. Вы можете передать его в метод с помощью специальной переменной `$event` или использовать встроенную функцию-стрелку:

```vue-html
<!-- использование специальной переменной $event -->
<button @click="warn('Форма пока не может быть отправлена.', $event)">
  Submit
</button>

<!-- использование встроенной стрелочной функции -->
<button @click="(event) => warn('Форма пока не может быть отправлена.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // Теперь у нас есть доступ к собственному событию
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // Теперь у нас есть доступ к собственному событию
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Модификаторы событий {#event-modifiers}

Очень часто внутри обработчиков событий требуется вызвать `event.preventDefault()` или `event.stopPropagation()`. Хотя мы можем легко сделать это внутри методов, было бы лучше, если бы методы были направлены исключительно на логику данных, а не на работу с деталями событий DOM.

Чтобы решить эту проблему, Vue предоставляет **модификаторы событий** для `v-on`. Напомним, что модификаторы — это директивные постфиксы, обозначаемые точкой.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- распространение события щелчка будет остановлено -->
<a @click.stop="doThis"></a>

<!-- событие отправки больше не будет перезагружать страницу -->
<form @submit.prevent="onSubmit"></form>

<!-- модификаторы могут быть соединены в цепочку -->
<a @click.stop.prevent="doThat"></a>

<!-- только модификатор -->
<form @submit.prevent></form>

<!-- обработчик срабатывает только в том случае, если event.target является самим элементом -->
<!-- т.е. не из дочернего элемента -->
<div @click.self="doThat">...</div>
```

::: tip Примечание
Порядок имеет значение при использовании модификаторов, поскольку соответствующий код генерируется в том же порядке. Поэтому использование `@click.prevent.self` предотвратит **действие клика по умолчанию на сам элемент и его дочерние элементы**, в то время как `@click.self.prevent` предотвратит действие клика по умолчанию только на сам элемент.
:::

Модификаторы `.capture`, `.once` и `.passive` повторяют [параметры нативного метода `addEventListener`](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- используйте режим захвата при добавлении слушателя событий -->
<!-- т. е. событие, направленное на внутренний элемент, обрабатывается здесь, прежде чем будет обработано этим элементом -->
<div @click.capture="doThis">...</div>

<!-- событие щелчка будет вызвано не более одного раза -->
<a @click.once="doThis"></a>

<!-- будет происходить стандартное поведение события прокрутки -->
<!-- немедленно, вместо того чтобы ждать завершения `onScroll`.  -->
<!-- в случае, если он содержит `event.preventDefault()`.                -->
<div @scroll.passive="onScroll">...</div>
```

Модификатор `.passive` обычно используется в слушателях сенсорных событий для [улучшения производительности на мобильных устройствах](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners).

::: tip Совет
Не используйте `.passive` и `.prevent` вместе, потому что `.passive` уже указывает браузеру, что вы _не_ намерены предотвращать поведение события по умолчанию, и вы, скорее всего, увидите предупреждение от браузера, если сделаете это.
:::

## Модификаторы клавиш {#key-modifiers}

При прослушивании событий клавиатуры нам часто нужно проверить наличие определённых клавиш. Vue позволяет добавлять модификаторы клавиш `v-on` или `@` при прослушивании событий клавиатуры:

```vue-html
<!-- вызывайте `submit` только тогда, когда `key` - `Enter` -->
<input @keyup.enter="submit" />
```

Вы можете напрямую использовать любые имена допустимых клавиш, отображаемые через [`KeyboardEvent.key`](https://developer.mozilla.org/ru/docs/Web/API/UI_Events/Keyboard_event_key_values), в качестве модификаторов, преобразовав их в кебабный регистр.

```vue-html
<input @keyup.page-down="onPageDown" />
```

В приведённом выше примере обработчик будет вызван только в том случае, если `$event.key` будет равен `'PageDown'`.

### Псевдонимы клавиш {#key-aliases}

Vue предоставляет псевдонимы для наиболее часто используемых клавиш:

- `.enter`
- `.tab`
- `.delete` (обрабатывает клавиши «Delete» и «Backspace»)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Модификаторы системных клавиш {#system-modifier-keys}

Вы можете использовать следующие модификаторы для запуска слушателей событий мыши или клавиатуры только при нажатии соответствующей клавиши-модификатора:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Примечание
On Macintosh keyboards, meta is the command key (⌘). On Windows keyboards, meta is the Windows key (⊞). On Sun Microsystems keyboards, meta is marked as a solid diamond (◆). On certain keyboards, specifically MIT and Lisp machine keyboards and successors, such as the Knight keyboard, space-cadet keyboard, meta is labeled “META”. On Symbolics keyboards, meta is labeled “META” or “Meta”.
На клавиатурах Macintosh `meta` — это клавиша command (⌘). На клавиатурах Windows `meta` — это клавиша Windows (⊞). На клавиатурах Sun Microsystems `meta` обозначается сплошным ромбом (◆). На некоторых клавиатурах, в частности, на клавиатурах машин MIT и Lisp и их преемниках, таких как клавиатура Knight, клавиатура с пробелами, `meta` обозначается как «META». На клавиатурах Symbolics мета обозначается как «META» или «Meta».
:::

Например:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Сделайте что-нибудь</div>
```

::: tip Примечание
Обратите внимание, что клавиши-модификаторы отличаются от обычных клавиш, и при использовании с событиями `keyup` они должны быть нажаты в момент возникновения события. Другими словами, `keyup.ctrl` сработает только в том случае, если вы отпустите клавишу, удерживая `ctrl`. Он не сработает, если вы отпустите клавишу `ctrl` в одиночку.
:::

### Модификатор `.exact` {#exact-modifier}

Модификатор `.exact` позволяет контролировать точную комбинацию системных модификаторов, необходимых для запуска события.

```vue-html
<!-- Это произойдет, даже если Alt или Shift также нажаты -->
<button @click.ctrl="onClick">A</button>

<!-- Это будет происходить только при нажатии Ctrl и других клавиш -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- Это будет происходить только в том случае, если не нажаты никакие системные модификаторы -->
<button @click.exact="onClick">A</button>
```

## Модификаторы кнопок мыши {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Эти модификаторы ограничивают обработчик событиями, вызванными определенной кнопкой мыши.
