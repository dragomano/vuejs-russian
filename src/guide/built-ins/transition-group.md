<script setup>
import ListBasic from './transition-demos/ListBasic.vue'
import ListMove from './transition-demos/ListMove.vue'
import ListStagger from './transition-demos/ListStagger.vue'
</script>

# TransitionGroup {#transitiongroup}

`<TransitionGroup>` - это встроенный компонент, предназначенный для анимации вставки, удаления и изменения порядка элементов или компонентов, отображаемых в списке.

## Отличия от `<Transition>` {#differences-from-transition}

`<TransitionGroup>` поддерживает те же параметры, классы перехода CSS и прослушиватели хуков JavaScript, что и `<Transition>`, со следующими отличиями:

- По умолчанию он не отображает элемент-обёртку. Но вы можете указать элемент для рендеринга с помощью свойства `tag`.

- [Режимы перехода](./transition#transition-modes) недоступны, поскольку мы больше не чередуем взаимоисключающие элементы.

- Элементы внутри **всегда обязаны** иметь уникальный атрибут `key`.

- Классы переходов CSS будут применяться к отдельным элементам в списке, **не** к самой группе/контейнеру.

:::tip
При использовании в [DOM-шаблонах](/guide/essentials/component-basics#in-dom-template-parsing-caveats), на него следует ссылаться как на `<transition-group>`.
:::

## Переходы между Enter / Leave {#enter-leave-transitions}

Вот пример применения переходов enter / leave к списку `v-for` с помощью `<TransitionGroup>`:

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## Перемещение переходов {#move-transitions}

Приведенная выше демонстрация имеет ряд очевидных недостатков: когда элемент вставляется или удаляется, окружающие его элементы мгновенно «подпрыгивают» вместо плавного движения. Мы можем исправить это, добавив несколько дополнительных правил CSS:

```css{1,13-17}
.list-move, /* применяем переход к движущимся элементам */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* проверяем, что уходящие элементы выведены из потока компоновки,
 чтобы анимация перемещения могла быть рассчитана правильно. */
.list-leave-active {
  position: absolute;
}
```

Теперь он выглядит гораздо лучше — даже плавно анимируется при перемешивании всего списка:

<ListMove />

[Полный пример](/examples/#list-transition)

## Потрясающие переходы списков {#staggering-list-transitions}

Взаимодействуя с переходами JavaScript через атрибуты данных, можно также перемежать переходы в списке. Сначала мы отображаем индекс элемента как атрибут данных на элементе DOM:

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

Затем в хуках JavaScript мы анимируем элемент с задержкой на основе атрибута данных. В этом примере для выполнения анимации используется [библиотека GreenSock](https://greensock.com/):

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)

</div>

---

**Ссылки по теме**

- [Справочник по API `<TransitionGroup>`](/api/built-in-components#transitiongroup)
