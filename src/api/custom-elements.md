# Custom Elements API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Этот метод принимает тот же аргумент, что и [`defineComponent`](#definecomponent), но вместо него возвращает собственный конструктор класса [CustomElement](https://developer.mozilla.org/ru/docs/Web/API/Web_components/Using_custom_elements).

- **Тип**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & { styles?: string[] })
      | ComponentOptions['setup']
  ): {
    new (props?: object): HTMLElement
  }
  ```

  > Для удобства чтения тип упрощён.

- **Подробности**

  В дополнение к обычным параметрам компонента, `defineCustomElement()` также поддерживает ряд опций, специфичных для пользовательских элементов:

  - **`styles`**: массив вставленных CSS-строк для предоставления CSS, которые должны быть вставлены в теневой корневой узел элемента.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: функция, которая может быть использована для настройки экземпляра приложения Vue для пользовательского элемента.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, по умолчанию `true`. Установите значение `false`, чтобы отобразить пользовательский элемент без теневого корневого узла. Это означает, что `<style>` в SFC пользовательских элементов больше не будет инкапсулироваться.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, если указан, будет установлен как атрибут `nonce` для стилевых тегов, инжектируемых в теневой корневой узел.

  Обратите внимание, что вместо того, чтобы передаваться как часть самого компонента, эти опции могут быть переданы через второй аргумент:

  ```js
  import Element from './MyElement.ce.vue'
  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  Возвращаемое значение — это пользовательский конструктор элемента, который можно зарегистрировать с помощью [`customElements.define()`](https://developer.mozilla.org/ru/docs/Web/API/CustomElementRegistry/define).

- **Пример**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* параметры компонента */
  })

  // Регистрируем пользовательский элемент
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Смотрите также**

  - [Руководство - Создание пользовательских элементов с помощью Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Также обратите внимание, что `defineCustomElement()` требует [специальной конфигурации](/guide/extras/web-components#sfc-as-custom-element) при использовании с однофайловыми компонентами.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Хелпер Composition API, который возвращает хост-элемент текущего пользовательского элемента Vue.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Хелпер Composition API, который возвращает теневой корневой узел текущего пользовательского элемента Vue.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Свойство Options API, которое раскрывает хост-элемент текущего пользовательского элемента Vue.
