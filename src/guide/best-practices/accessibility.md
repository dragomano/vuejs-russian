# Доступность {#accessibility}

Веб-доступность (также известная как a11y) — это практика создания веб-сайтов, которыми может пользоваться любой человек — будь то инвалид, человек с медленным соединением, устаревшим или сломанным оборудованием или просто человек, находящийся в неблагоприятных условиях. Например, добавление субтитров к видео поможет как глухим и слабослышащим пользователям, так и пользователям, которые находятся в шумной обстановке и не слышат свой телефон. Аналогично, убедитесь, что ваш текст не слишком контрастный, это поможет как слабовидящим пользователям, так и тем, кто пытается пользоваться телефоном при ярком солнечном свете.

Готовы начать, но не знаете, с чего начать?

Ознакомьтесь с [Руководство по планированию и управлению доступностью веб-сайтов](https://www.w3.org/WAI/planning-and-managing/), предоставленным [Консорциумом Всемирной паутины (W3C)](https://www.w3.org/).

## Переход к основному содержанию {#skip-link}

В верхней части каждой страницы следует добавить ссылку, ведущую непосредственно к основному содержанию, чтобы пользователи могли пропустить материалы, которые повторяются на нескольких веб-страницах.

Обычно это делается в верхней части файла `App.vue`, поскольку он будет первым фокусируемым элементом на всех ваших страницах:

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Перейти к основному содержанию</a>
  </li>
</ul>
```

Чтобы скрыть ссылку, если она не сфокусирована, можно добавить следующий стиль:

```css
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

Как только пользователь изменит маршрут, верните внимание к ссылке на пропуск. Этого можно добиться, вызвав focus на шаблонном реферере пропускаемой ссылки (при условии использования `vue-router`):

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[Подробнее о ссылке перехода к основному содержимому](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## Структура содержания {#content-structure}

Одна из самых важных составляющих доступности — убедиться в том, что дизайн может поддерживать доступную реализацию. Дизайн должен учитывать не только цветовой контраст, выбор шрифта, размер текста и язык, но и то, как структурирован контент в приложении.

### Заголовки {#headings}

Пользователи могут ориентироваться в приложении по заголовкам. Наличие описательных заголовков для каждого раздела вашего приложения облегчает пользователям прогнозирование содержания каждого раздела. Когда речь идет о заголовках, существует несколько рекомендуемых практик обеспечения доступности:

- Расположите заголовки в порядке их ранжирования: `<h1>` - `<h6>`
- Не пропускайте заголовки внутри раздела
- Используйте настоящие теги заголовков вместо стилизации текста, чтобы придать заголовкам визуальный вид.

[Подробнее о заголовках](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Главный заголовок</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1"> Название раздела </h2>
    <h3>Подзаголовок раздела</h3>
    <!-- Контент -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2"> Название раздела </h2>
    <h3>Подзаголовок раздела</h3>
    <!-- Контент -->
    <h3>Подзаголовок раздела</h3>
    <!-- Контент -->
  </section>
</main>
```

### Ориентиры {#landmarks}

[Ориентиры](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) обеспечивают программный доступ к разделам внутри приложения. Пользователи, использующие вспомогательные технологии, могут переходить к каждому разделу приложения и пропускать содержимое. Для достижения этой цели можно использовать [ARIA-роли](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles).

| HTML    | Роль ARIA            | Назначение ориентира                                                                                                             |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| header  | role="banner"        | Основной заголовок: название страницы                                                                                            |
| nav     | role="navigation"    | Коллекция ссылок, подходящих для использования при навигации по документу или связанным с ним документам                         |
| main    | role="main"          | Основное или центральное содержание документа                                                                                    |
| footer  | role="contentinfo"   | Информация об исходном документе: сноски/авторские права/ссылки на заявление о конфиденциальности                                |
| aside   | role="complementary" | Поддерживает основной контент, но при этом отделен и имеет смысл для собственного контента                                       |
| search  | role="search"        | В этом разделе размещен функционал поиска по приложению                                                                          |
| form    | role="form"          | Коллекция элементов, связанных с формой                                                                                          |
| section | role="region"        | Контент, который актуален и к которому пользователи, скорее всего, захотят перейти. Для этого элемента должна быть указана метка |

:::tip Совет
Рекомендуется использовать HTML-элементы ориентира с избыточными атрибутами роли ориентира, чтобы максимизировать совместимость с устаревшими [браузерами, которые не поддерживают семантические элементы HTML5](https://caniuse.com/#feat=html5semantic).
:::

[Подробнее об ориентирах](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## Семантические формы {#semantic-forms}

При создании формы вы можете использовать следующие элементы: `<form>`, `<label>`, `<input>`, `<textarea>` и `<button>`

Метки обычно размещаются сверху или слева от полей формы:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

Обратите внимание, как вы можете включить `autocomplete='on'` в элемент формы, и это будет применяться ко всем входным данным в вашей форме. Вы также можете установить разные [значения атрибута автозаполнения](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) для каждого ввода.

### Метки {#labels}

Предоставьте метки, описывающие цель всех элементов управления формой; связывание `for` и `id`:

```vue-html
<label for="name">Имя: </label>
<input type="text" name="name" id="name" v-model="name" />
```

Если вы проверите этот элемент в инструментах разработчика Chrome и откроете вкладку «Доступность» на вкладке «Элементы», вы увидите, как входные данные получают свое имя из метки:

![Инструменты разработчика Chrome показывают доступное для ввода имя из метки](./images/AccessibleLabelChromeDevTools.png)

:::warning Предупреждение
Хотя вы, возможно, видели, как метки обертывают поля ввода таким образом:

```vue-html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

Явная установка меток с соответствующим идентификатором лучше поддерживается вспомогательными технологиями.
:::

#### `aria-label` {#aria-label}

Вы также можете дать вводимым данным доступное имя с помощью [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label).

```vue-html
<label for="name">Имя: </label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

Не стесняйтесь просмотреть этот элемент в Chrome DevTools, чтобы увидеть, как изменилось доступное имя:

![Инструменты разработчика Chrome показывают доступное для ввода имя из aria-label](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

Использование [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) аналогично `aria-label`, за исключением того, что оно используется, если текст метки виден на экране. Он сопрягается с другими элементами по их `id`, и вы можете связать несколько `id`:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Счёт</h1>
  <div class="form-item">
    <label for="name">Имя: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="название счёта"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

![Инструменты разработчика Chrome показывают доступное для ввода имя из aria-labelledby](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) используется так же, как и `aria-labelledby`, но содержит описание с дополнительной информацией, которая может понадобиться пользователю. С его помощью можно описать критерии для любого ввода:

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Счёт</h1>
  <div class="form-item">
    <label for="name">Полное имя: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="название счёта"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Пожалуйста, укажите имя и фамилию.</p>
  </div>
  <button type="submit">Отправить</button>
</form>
```

Вы можете просмотреть описание, заглянув в Chrome DevTools:

![Инструменты разработчика Chrome показывают доступное для ввода имя с aria-labelledby и описание с aria-describedby](./images/AccessibleARIAdescribedby.png)

### Заполнитель {#placeholder}

Избегайте использования заполнителей, так как они могут запутать многих пользователей.

Одной из проблем с заполнителями является то, что по умолчанию они не соответствуют [критерию цветового контраста](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html); исправление цветового контраста приводит к тому, что в полях ввода заполнитель выглядит как предварительно заполненные данные. Если посмотреть на следующий пример, то можно увидеть, что заполнитель фамилии, отвечающий критериям цветового контраста, выглядит как предварительно заполненные данные:

![Доступный заполнитель](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Отправить</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

Лучше всего предоставлять всю информацию, необходимую пользователю для заполнения формы, без каких-либо вводов.

### Инструкции {#instructions}

Добавляя инструкции для полей ввода, не забудьте правильно связать их с полем ввода.
Вы можете предоставить дополнительные инструкции и связать несколько идентификаторов внутри [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby). Это позволяет создавать более гибкие конструкции.

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Текущая дата: </label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

Кроме того, вы можете прикрепить инструкции к вводу с помощью [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Дата рождения: </label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### Скрытое содержимое {#hiding-content}

Обычно не рекомендуется визуально скрывать метки, даже если ввод имеет доступное имя. Однако если функциональность ввода может быть понятна из окружающего контента, то визуальную метку можно скрыть.

Давайте посмотрим на это поле поиска:

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Поиск: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Поиск</button>
</form>
```

Мы можем это сделать, потому что кнопка поиска поможет визуальным пользователям определить назначение поля ввода.

С помощью CSS мы можем визуально скрыть элементы, но сохранить их доступными для вспомогательных технологий:

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

Добавление `aria-hidden="true"` скроет элемент от вспомогательных технологий, но оставит его визуально доступным для других пользователей. Не используйте его на фокусируемых элементах, только на декоративном, дублирующемся или внеэкранном контенте.

```vue-html
<p>Это не скрыто от устройств чтения с экрана.</p>
<p aria-hidden="true">Это скрыто от устройств чтения с экрана.</p>
```

### Кнопки {#buttons}

При использовании кнопок внутри формы необходимо установить тип, предотвращающий отправку формы.
Вы также можете использовать вход для создания кнопок:

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Отменить</button>
  <button type="submit">Отправить</button>

  <!-- Input buttons -->
  <input type="button" value="Отменить" />
  <input type="submit" value="Отправить" />
</form>
```

### Функциональные изображения {#functional-images}

Вы можете использовать эту технику для создания функциональных изображений.

- Поля ввода

  - Эти изображения будут действовать как кнопки отправки в формах

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Поиск: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Поиск"
    />
  </form>
  ```

- Icons

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Поиск: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Поиск</span>
  </button>
</form>
```

## Стандарты {#standards}

Инициатива по обеспечению веб-доступности (WAI) Консорциума Всемирной паутины (W3C) разрабатывает стандарты веб-доступности для различных компонентов:

- [Руководство по доступности пользовательского агента (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - веб-браузеры и медиаплееры, включая некоторые аспекты вспомогательных технологий
- [Руководство по обеспечению доступности средств создания (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - авторские инструменты
- [Руководство по доступности веб-контента (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - веб-контент — используется разработчиками, авторскими инструментами и инструментами оценки доступности

### Руководство по доступности веб-контента (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) развивает [WCAG 2.0](https://www.w3.org/TR/WCAG20/) и позволяет внедрять новые технологии, учитывая изменения в Интернете. W3C рекомендует использовать самую последнюю версию WCAG при разработке или обновлении политики веб-доступности.

#### WCAG 2.1 Четыре основных руководящих принципа (сокращённо ВУПУ — POUR): {#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [Воспринимаемость (Perceivable)](https://www.w3.org/TR/WCAG21/#perceivable)
  - Пользователи должны иметь возможность воспринимать представляемую информацию
- [Управляемость (Operable)](https://www.w3.org/TR/WCAG21/#operable)
  - Формы интерфейса, элементы управления и навигации работоспособны
- [Понятность (Understandable)](https://www.w3.org/TR/WCAG21/#understandable)
  - Информация и работа пользовательского интерфейса должны быть понятны всем пользователям
- [Устойчивость (Robust)](https://www.w3.org/TR/WCAG21/#robust)
  - Пользователи должны иметь доступ к контенту по мере развития технологий

#### Инициатива по обеспечению доступности веб-сайтов – доступные многофункциональные интернет-приложения (WAI-ARIA){#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

WAI-ARIA W3C предоставляет рекомендации по созданию динамического контента и расширенных элементов управления пользовательским интерфейсом.

- [Доступные многофункциональные интернет-приложения (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Практика разработки WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## Ресурсы {#resources}

### Документация {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Доступные многофункциональные интернет-приложения (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Практика разработки WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### Вспомогательные технологии {#assistive-technologies}

- Программы чтения с экрана
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- Инструменты масштабирования
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### Тестирование {#testing}

- Автоматизированные инструменты
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- Инструменты для работы с цветом
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- Другие полезные инструменты
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### Пользователи {#users}

По оценкам Всемирной организации здравоохранения, 15 % населения Земли имеют ту или иную форму инвалидности, 2-4 % из них — тяжелую. Это примерно 1 миллиард человек во всем мире; таким образом, люди с ограниченными возможностями стали самым многочисленным меньшинством в мире.

Существует огромное количество видов инвалидности, которые можно условно разделить на четыре категории:

- _[Визуальная](https://webaim.org/articles/visual/)_ - Для таких пользователей могут быть полезны программы чтения с экрана, увеличение экрана, регулирование контрастности экрана или отображение текста шрифтом Брайля.
- _[Слуховая](https://webaim.org/articles/auditory/)_ - Этим пользователям могут помочь субтитры, расшифровки или видео на языке жестов.
- _[Двигательная](https://webaim.org/articles/motor/)_ - Эти пользователи могут воспользоваться рядом [вспомогательных технологий при двигательных нарушениях](https://webaim.org/articles/motor/assistive): программное обеспечение для распознавания голоса, отслеживание глаз, доступ с помощью одного переключателя, головная палочка, переключатель для глотка и затяжки, увеличенную мышь с трекболом, адаптивную клавиатуру или другие вспомогательные технологии.
- _[Когнитивная](https://webaim.org/articles/cognitive/)_ - Для таких пользователей полезны дополнительные средства информации, структурная организация содержания, ясный и простой текст.

Ознакомьтесь со следующими ссылками от WebAim, чтобы узнать мнение пользователей:

- [Перспективы доступности веб-сайтов: изучите влияние и преимущества для каждого](https://www.w3.org/WAI/perspective-videos/)
- [Истории веб-пользователей](https://www.w3.org/WAI/people-use-web/user-stories/)
