# Правила приоритета B: Настоятельно рекомендуется {#priority-b-rules-strongly-recommended}

::: warning Примечание
Это руководство для Vue.js устарело и требует пересмотра. Если у вас есть вопросы или предложения, пожалуйста, [откройте issue](https://github.com/vuejs/docs/issues/new).
:::

В большинстве проектов эти правила улучшают читабельность и/или удобство для разработчиков. Ваш код будет работать, если вы нарушите их, но нарушения должны быть редкими и хорошо обоснованными.

## Файлы компонентов {#component-files}

**Когда система сборки позволяет объединять файлы, каждый компонент должен находиться в своем собственном файле.**

Это поможет вам быстрее найти компонент, когда вам нужно будет его отредактировать или просмотреть, как его использовать.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Регистр имени однофайлового компонента {#single-file-component-filename-casing}

**Имена [однофайловых компонентов](/guide/scaling-up/sfc) должны быть либо всегда в PascalCase, либо всегда в kebab-case.**.

PascalCase лучше всего работает с автозаполнением в редакторах кода, так как он соответствует тому, как мы ссылаемся на компоненты в JS(X) и шаблонах, где это возможно. Однако имена файлов в смешанном регистре иногда могут создавать проблемы в файловых системах, нечувствительных к регистру, поэтому кебаб-кейс также вполне допустим.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Имена базовых компонентов {#base-component-names}

**Базовые компоненты (также известные как презентационные, немые или чистые компоненты), которые применяют стилистику и соглашения, специфичные для приложения, должны начинаться с определенного префикса, например `Base`, `App` или `V`.**.

::: details Подробное объяснение
Эти компоненты закладывают основу для согласованного стиля и поведения вашего приложения. Они могут содержать **только**:

- элементы HTML,
- другие базовые компоненты, и
- компоненты пользовательского интерфейса сторонних разработчиков.

Но они **никогда** не будут содержать глобального состояния (например, из хранилища [Pinia](https://pinia-ru.netlify.app/core-concepts/state.html)).

Их названия часто включают имя элемента, который они оборачивают (например, `BaseButton`, `BaseTable`), если только не существует элемента для их конкретного назначения (например, `BaseIcon`). Если вы создадите аналогичные компоненты для более специфического контекста, они почти всегда будут потреблять эти компоненты (например, `BaseButton` может быть использован в `ButtonSubmit`).

Некоторые преимущества этой конвенции:

- При алфавитном порядке расположения в редакторах базовые компоненты вашего приложения перечисляются вместе, что облегчает их идентификацию.

- Поскольку имена компонентов всегда должны состоять из нескольких слов, это соглашение избавляет вас от необходимости выбирать произвольный префикс для простых обёрток компонентов (например, `MyButton`, `VueButton`).

- Поскольку эти компоненты используются так часто, вы можете просто сделать их глобальными, а не импортировать их повсюду. Префикс делает это возможным с помощью Webpack:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Тесно связанные имена компонентов {#tightly-coupled-component-names}

**Дочерние компоненты, тесно связанные со своим родителем, должны включать имя родительского компонента в качестве префикса.**.

Если компонент имеет смысл только в контексте одного родительского компонента, эта связь должна быть очевидна в его названии. Поскольку в редакторах файлы обычно располагаются в алфавитном порядке, это также позволит хранить связанные файлы рядом друг с другом.

::: details Подробное объяснение
У вас может возникнуть соблазн решить эту проблему, вложив дочерние компоненты в каталоги, названные в честь их родителя. Например:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

или:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Это не рекомендуется, так как приводит к:

- Множеству файлов с похожими именами, что затрудняет быстрое переключение между файлами в редакторах кода.
- Множеству вложенных подкаталогов, что увеличивает время просмотра компонентов в боковой панели редактора.
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Порядок слов в названиях компонентов {#order-of-words-in-component-names}

**Имена компонентов должны начинаться со слов самого высокого уровня (часто наиболее общего) и заканчиваться описательными модифицирующими словами.**

::: details Подробное объяснение
Возможно, вам интересно:

> "Зачем заставлять имена компонентов использовать менее естественный язык?"

В естественном английском языке прилагательные и другие дескрипторы обычно стоят перед существительными, а исключения требуют наличия соединительных слов. Например:

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

При желании вы можете включить эти соединительные слова в названия компонентов, но порядок их следования всё равно важен.

Также обратите внимание, что **то, что считается «высшим уровнем», будет соответствовать контексту вашего приложения**. Например, представьте себе приложение с формой поиска. Оно может включать в себя компоненты, подобные этому:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Как вы можете заметить, довольно сложно определить, какие компоненты являются специфическими для поиска. Теперь давайте переименуем компоненты в соответствии с правилом:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Поскольку редакторы обычно располагают файлы в алфавитном порядке, все важные взаимосвязи между компонентами теперь видны с первого взгляда.

У вас может возникнуть соблазн решить эту проблему по-другому, вложив все компоненты поиска в каталог «Search», затем все компоненты настроек в каталог «Settings». Мы рекомендуем использовать этот подход только в очень больших приложениях (например, 100+ компонентов), по этим причинам:

- Переход по вложенным подкаталогам обычно занимает больше времени, чем прокрутка одного каталога `components`.
- Конфликты имён (например, несколько компонентов `ButtonDelete.vue`) усложняют быстрый переход к конкретному компоненту в редакторе кода.
- Рефакторинг становится сложнее, потому что для обновления относительных ссылок на перемещённый компонент часто недостаточно просто найти и заменить.
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Самозакрывающиеся компоненты {#self-closing-components}

**Компоненты без содержимого должны быть самозакрывающимися в [однофайловых компонентах](/guide/scaling-up/sfc), строковых шаблонах и [JSX](/guide/extras/render-function#jsx-tsx) — но никогда в DOM-шаблонах.**.

Компоненты, которые самозакрываются, сообщают, что у них не только нет содержимого, но и **намерены** его не иметь. Это как разница между пустой страницей в книге и страницей с надписью «Эта страница намеренно оставлена пустой». Ваш код также чище без лишнего закрывающего тега.

К сожалению, HTML не позволяет пользовательским элементам быть самозакрывающимися — только [официальный элемент «void»](https://www.w3.org/TR/html/syntax.html#void-elements). Поэтому данная стратегия возможна только в том случае, если компилятор шаблонов Vue может достичь шаблона до DOM, а затем предоставить HTML, соответствующий спецификации DOM.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<!-- В однофайловых компонентах, строковых шаблонах и JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- В шаблонах DOM -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- В однофайловых компонентах, строковых шаблонах и JSX -->
<MyComponent/>
```

```vue-html
<!-- В шаблонах DOM -->
<my-component></my-component>
```

</div>

## Регистр имени компонента в шаблонах {#component-name-casing-in-templates}

**В большинстве проектов имена компонентов всегда должны быть в PascalCase в [однофайловых компонентах](/guide/scaling-up/sfc) и строковых шаблонах — но в kebab-case в шаблонах DOM.**.

У PascalCase есть несколько преимуществ перед kebab-case:

- Редакторы могут автозаполнять имена компонентов в шаблонах, поскольку PascalCase также используется в JavaScript.
- `<MyComponent>` визуально отличается от однословного HTML-элемента больше, чем `<my-component>`, поскольку различаются два символа (две заглавные буквы), а не один (дефис).
- Если вы используете в шаблонах пользовательские элементы, не относящиеся к Vue, например веб-компоненты, PascalCase гарантирует, что ваши компоненты Vue останутся отчётливо видимыми.

К сожалению, из-за нечувствительности HTML к регистру, шаблоны в DOM всё равно должны использовать kebab-case.

Также имейте в виду, что если вы уже вложили значительные средства в kebab-case, то соответствие соглашениям HTML и возможность использовать один и тот же регистр во всех ваших проектах может быть важнее, чем перечисленные выше преимущества. В этих случаях **использование кебабного регистра повсеместно также допустимо.**.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<!-- В однофайловых компонентах и шаблонах строк -->
<mycomponent/>
```

```vue-html
<!-- В однофайловых компонентах и шаблонах строк -->
<myComponent/>
```

```vue-html
<!-- В шаблонах DOM -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- В однофайловых компонентах и шаблонах строк -->
<MyComponent/>
```

```vue-html
<!-- В шаблонах DOM -->
<my-component></my-component>
```

ИЛИ

```vue-html
<!-- Everywhere -->
<my-component></my-component>
```

</div>

## Регистр имени компонента в JS/JSX {#component-name-casing-in-js-jsx}

**Имена компонентов в JS/[JSX](/guide/extras/render-function#jsx-tsx) всегда должны быть в PascalCase, хотя они могут быть в kebab-case внутри строк для более простых приложений, которые используют только глобальную регистрацию компонентов через `app.component`.**.

::: details Подробное объяснение
В JavaScript PascalCase — это соглашение для классов и конструкторов прототипов — по сути, для всего, что может иметь отдельные экземпляры. Компоненты Vue также имеют экземпляры, поэтому имеет смысл также использовать PascalCase. Дополнительным преимуществом является то, что использование PascalCase в JSX (и шаблонах) позволяет читателям кода легче различать компоненты и HTML-элементы.

Однако для приложений, использующих **только** глобальные определения компонентов через `app.component`, мы рекомендуем вместо этого использовать kebab-case. Причины таковы:

- В JavaScript редко встречаются ссылки на глобальные компоненты, поэтому следовать конвенции для JavaScript не имеет смысла.
- Такие приложения всегда включают множество шаблонов в DOM, в которых [**обязательно** должен использоваться kebab-case](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Полные имена компонентов {#full-word-component-names}

**В названиях компонентов следует отдавать предпочтение полным словам, а не аббревиатурам.**

Автозаполнение в редакторах позволяет сократить расходы на написание длинных имён, а ясность, которую они обеспечивают, неоценима. В частности, следует избегать нечасто встречающихся сокращений.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Регистр имени параметра {#prop-name-casing}

**В именах параметров при объявлении всегда должен использоваться «верблюжий» регистр (`camelCase`). При использовании внутри шаблонов в DOM параметр должен быть в «шашлычном» регистре (`kebab-case`). Шаблоны однофайловых компонентов и [JSX](/guide/extras/render-function#jsx-tsx) могут использовать параметры как в «шашлычном», так и в «верблюжьем» регистрах. Регистр должен быть однообразным — если вы решили использовать параметр в «верблюжьем» регистре, убедитесь, что не используете «шашлычную» нотацию в своем приложении**.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// для DOM-шаблонов
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// для SFC — пожалуйста, убедитесь, что ваш регистр соответствует проекту
// Можно использовать любой из вариантов, но мы не рекомендуем смешивать два разных стиля регистра
<WelcomeMessage greeting-text="hi"/>
// или
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// для DOM-шаблонов
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Многоатрибутные элементы {#multi-attribute-elements}

**Элементы с несколькими атрибутами должны занимать несколько строк, по одному атрибуту на строку.**.

В JavaScript разделение объектов с несколькими свойствами на несколько строк считается хорошей традицией, потому что так гораздо легче читать. Наши шаблоны и [JSX](/guide/extras/render-function#jsx-tsx) заслуживают такого же внимания.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Простые выражения в шаблонах {#simple-expressions-in-templates}

**Шаблоны компонентов должны включать только простые выражения, а более сложные выражения нужно выносить в вычисляемые свойства или методы.**.

Сложные выражения в шаблонах делают их менее декларативными. Мы должны стремиться описать _что_ должно появиться, а не _как_ мы вычисляем это значение. Вычисленные свойства и методы также позволяют повторно использовать код.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<!-- В шаблоне -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// Сложное выражение было перенесено в вычисляемое свойство
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// Сложное выражение было перенесено в вычисляемое свойство
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Простые вычисляемые свойства {#simple-computed-properties}

**Сложные вычисляемые свойства должны быть разбиты на как можно большее количество более простых свойств.**

::: details Подробное объяснение
Более простыми и удачными названиями вычисляемых свойств являются:

- **Легче тестировать**

  Когда каждое вычисляемое свойство содержит только очень простое выражение с небольшим количеством зависимостей, гораздо проще написать тесты, подтверждающие его корректную работу.

- **Легче читать**

  Упрощение вычисляемых свойств заставляет вас давать каждому значению описательное имя, даже если оно не используется повторно. Так другим разработчикам (и вам в будущем) будет гораздо проще сосредоточиться на коде, который их волнует, и понять, что происходит.

- **Более высокая адаптивность к изменяющимся требованиям**

  Любое значение, которое может быть названо, может быть полезным для представления. Например, мы можем решить вывести сообщение о том, сколько денег сэкономил пользователь. Мы также можем принять решение о расчёте налога с продаж, но, возможно, отображать его отдельно, а не как часть окончательной цены.

  Небольшие, сфокусированные вычисляемые свойства делают меньше предположений о том, как будет использоваться информация, поэтому требуют меньше рефакторинга при изменении требований.
  :::

<div class="style-example style-example-bad">
<h3>Плохо</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Значения атрибутов в кавычках {#quoted-attribute-values}

**Непустые значения HTML-атрибутов всегда должны быть заключены в кавычки (одинарные или двойные, в зависимости от того, что не используется в JS).**

Хотя значения атрибутов без пробелов не обязаны содержать кавычки в HTML, такая практика часто приводит к тому, что пробелы _обходятся_ стороной, делая значения атрибутов менее читабельными.

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Сокращения директив {#directive-shorthands}

**Сокращения директив (`:` для `v-bind:`, `@` для `v-on:` и `#` для `v-slot`) должны использоваться всегда или никогда.**

<div class="style-example style-example-bad">
<h3>Плохо</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Здесь может быть заголовок страницы</h1>
</template>

<template #footer>
  <p>Вот контактная информация</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Хорошо</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Здесь может быть заголовок страницы</h1>
</template>

<template v-slot:footer>
  <p>Вот контактная информация</p>
</template>
```

```vue-html
<template #header>
  <h1>Здесь может быть заголовок страницы</h1>
</template>

<template #footer>
  <p>Вот контактная информация</p>
</template>
```

</div>
