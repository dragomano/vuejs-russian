# Привязка классов и стилей {#class-and-style-bindings}

Чаще всего привязка данных необходима для работы со списком классов и встроенными стилями элемента. Поскольку `class` и `style` являются атрибутами, мы можем использовать `v-bind` для динамического присвоения им строкового значения, как и в случае с другими атрибутами. Однако попытка сгенерировать эти значения с помощью конкатенации строк может вызвать раздражение и привести к ошибкам. По этой причине Vue предоставляет специальные улучшения, когда `v-bind` используется с `class` и `style`. Помимо строк, выражения могут оценивать объекты или массивы.

## Привязка классов HTML {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Бесплатный урок по динамическим CSS-классам Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Бесплатный урок по динамическим CSS-классам Vue.js"/>
</div>

### Привязка к объектам {#binding-to-objects}

Мы можем передать объект в `:class` (сокращение от `v-bind:class`), чтобы динамически переключать классы:

```vue-html
<div :class="{ active: isActive }"></div>
```

Приведённый выше синтаксис означает, что наличие класса `active` будет определяться [истинностью](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) свойства данных `isActive`.

Вы можете переключать несколько классов, имея больше полей в объекте. Кроме того, директива `:class` может сосуществовать с обычным атрибутом `class`. Итак, дано следующее состояние:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

И следующий шаблон:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Это отобразит:

```vue-html
<div class="static active"></div>
```

При изменении `isActive` или `hasError` список классов будет обновлен соответствующим образом. Например, если `hasError` станет `true`, список классов станет `"static active text-danger"`.

Связанный объект не обязательно должен быть встроенным:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Это отобразит:

```vue-html
<div class="active"></div>
```

Мы также можем привязаться к [вычисляемому свойству](./computed), которое возвращает объект. Это распространённая и мощная модель поведения:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Привязка к массивам {#binding-to-arrays}

Мы можем привязать `:class` к массиву, чтобы применить список классов:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

Это отобразит:

```vue-html
<div class="active text-danger"></div>
```

Если вы хотите также условно переключать класс в списке, вы можете сделать это с помощью тернарного выражения:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

При этом всегда будет применяться `errorClass`, но `activeClass` будет применяться только тогда, когда `isActive` будет истинным.

Однако это может быть слишком многословным, если у вас несколько условных классов. Поэтому синтаксис объекта можно использовать и внутри синтаксиса массива:

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### С компонентами {#with-components}

> Этот раздел предполагает знание [Компонентов](/guide/essentials/component-basics). Не стесняйтесь пропустить его и вернуться позже.

Когда вы используете атрибут `class` в компоненте с одним корневым элементом, эти классы будут добавлены к корневому элементу компонента и объединены с любым существующим классом, уже имеющимся в нем.

Например, если у нас есть компонент с именем `MyComponent` и следующим шаблоном:

```vue-html
<!-- child component template -->
<p class="foo bar">Привет!</p>
```

Затем добавьте несколько классов при его использовании:

```vue-html
<!-- при использовании компонента -->
<MyComponent class="baz boo" />
```

HTML будет выглядеть следующим образом:

```vue-html
<p class="foo bar baz boo">Привет!</p>
```

То же самое справедливо и для привязки классов:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Если переменная `isActive` истинна, отображаемый HTML будет:

```vue-html
<p class="foo bar active">Привет!</p>
```

Если ваш компонент имеет несколько корневых элементов, вам нужно будет определить, какой элемент получит этот класс. Вы можете сделать это, используя свойство компонента `$attrs`:

```vue-html
<!-- Шаблон MyComponent с использованием $attrs -->
<p :class="$attrs.class">Привет!</p>
<span>Это дочерний компонент</span>
```

```vue-html
<MyComponent class="baz" />
```

Это отобразит:

```html
<p class="baz">Привет!</p>
<span>Это дочерний компонент</span>
```

Вы можете узнать больше о наследовании атрибутов компонентов в главе [Обычные атрибуты](/guide/components/attrs).

## Привязка встроенных стилей {#binding-inline-styles}

### Привязка к объектам {#binding-to-objects-1}

`:style` поддерживает привязку к значениям объекта JavaScript — это соответствует [свойству `style` элемента HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Хотя рекомендуется использовать ключи CamelCase, `:style` также поддерживает ключи свойств CSS в стиле кебаб (соответствует тому, как они используются в реальном CSS), например:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

Зачастую полезно напрямую привязать объект стиля, чтобы шаблон был чище:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

Опять же, привязка стиля объекта часто используется в сочетании с вычисляемыми свойствами, возвращающими объекты.

### Привязка к массивам {#binding-to-arrays-1}

Мы можем привязать `:style` к массиву из нескольких объектов стиля. Эти объекты будут объединены и применены к одному и тому же элементу:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Автоматическое префиксирование {#auto-prefixing}

Когда вы используете свойство CSS, для которого требуется [префикс поставщика](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) в `:style`, Vue автоматически добавит соответствующий префикс. Vue делает это, проверяя во время выполнения, какие свойства стиля поддерживаются в текущем браузере. Если браузер не поддерживает определённое свойство, будут проверены различные варианты префикса, чтобы попытаться найти тот, который поддерживается.

### Несколько значений {#multiple-values}

Вы можете предоставить массив из нескольких значений (с префиксом) для свойства стиля, например:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Это отобразит только последнее значение в массиве, которое поддерживает браузер. В этом примере он отобразит `display: flex` для браузеров, поддерживающих версию flexbox без префикса.
