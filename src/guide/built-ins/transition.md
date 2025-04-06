<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue предлагает два встроенных компонента, которые помогают работать с переходами и анимацией в ответ на изменение состояния:

- `<Transition>` для применения анимации при входе и выходе элемента или компонента из DOM. Об этом рассказывается на этой странице.

- `<TransitionGroup>` для применения анимации при вставке элемента или компонента в, удалении из или перемещении в пределах списка `v-for`. Об этом говорится в [следующей главе](/guide/built-ins/transition-group).

Помимо этих двух компонентов, мы можем применять анимацию во Vue с помощью других техник, таких как переключение классов CSS или анимация, управляемая состоянием, с помощью привязки стилей. Эти дополнительные техники рассматриваются в главе [Техники анимации](/guide/extras/animation).

## Компонент `<Transition>` {#the-transition-component}

`<Transition>` — это встроенный компонент: это означает, что он доступен в шаблоне любого компонента без необходимости его регистрации. Он может использоваться для применения анимации входа и выхода к элементам или компонентам, переданным ему через слот по умолчанию. Вход или выход может быть вызван одним из следующих действий:

- Отрисовка по условию с помощью `v-if`.
- Отображение по условию с помощью `v-show`.
- Переключение динамических компонентов с помощью специального элемента `<component>`
- Изменение специального атрибута `key`.

Это пример самого простого использования:

```vue-html
<button @click="show = !show">Переключить</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* мы расскажем, что делают эти классы дальше! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip Совет
`<Transition>` поддерживает только один элемент или компонент в качестве содержимого слота. Если содержимое является компонентом, компонент также должен иметь только один единственный корневой элемент.
:::

Когда элемент компонента `<Transition>` вставляется или удаляется, происходит вот что:

1. Vue автоматически определяет, применяются ли к целевому элементу CSS-переходы или анимация. Если это так, то ряд [классов переходов CSS](#transition-classes) будут добавляться/удаляться в соответствующие моменты времени.

2. Если есть слушатели для [хуков JavaScript](#javascript-hooks), то эти хуки будут вызываться в соответствующие моменты времени.

3. Если переходы / анимации CSS не обнаружены и не предоставлены хуки JavaScript, операции DOM для вставки и/или удаления будут выполняться на следующем кадре анимации браузера.

## Переходы на основе CSS {#css-based-transitions}

### Классы переходов {#transition-classes}

Для переходов «enter/leave» («вход/выход») применяются шесть классов.

![Диаграмма перехода](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`: Начальное состояние для входа. Добавляется перед вставкой элемента, удаляется через один кадр после вставки элемента.

2. `v-enter-active`: Активное состояние для входа. Применяется на протяжении всей фазы вхождения в силу. Добавляется перед вставкой элемента, удаляется по завершении перехода/анимации. Этот класс можно использовать для определения длительности, задержки и кривой смягчения для входа в переход.

3. `v-enter-to`: Конечное состояние для входа. Добавляется через один кадр после вставки элемента (одновременно с удалением `v-enter-from`), удаляется по окончании перехода/анимации.

4. `v-leave-from`: Начальное состояние для выхода. Добавляется сразу при срабатывании перехода выхода, удаляется через один кадр.

5. `v-leave-active`: Активное состояние для выхода. Наносится в течение всего периода выхода. Добавляется сразу при переходе к выходу, удаляется по завершении перехода/анимации. Этот класс можно использовать для определения длительности, задержки и кривой ослабления перехода при выходе.

6. `v-leave-to`: Состояние окончания выхода. Добавляется через один кадр после срабатывания перехода выхода (одновременно с удалением `v-leave-from`), удаляется по завершении перехода/анимации.

`v-enter-active` и `v-leave-active` дают нам возможность задавать различные кривые смягчения для переходов enter/leave, пример которых мы увидим в следующих разделах.

### Именованные переходы {#named-transitions}

Переход может быть назван с помощью параметра `name`:

```vue-html
<Transition name="fade">
  ...
</Transition>
```

Для именованного перехода его классы переходов будут иметь префикс с его именем вместо `v`. Например, для приведённого выше перехода будет применен класс `fade-enter-active`, а не `v-enter-active`. CSS для затухающего перехода должен выглядеть следующим образом:

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### Переходы CSS {#css-transitions}

`<Transition>` чаще всего используется в сочетании с [нативными переходами CSS](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions), как показано в базовом примере выше. CSS-свойство `transition` — это сокращение, которое позволяет нам указать несколько аспектов перехода, включая свойства, которые должны быть анимированы, продолжительность перехода и [кривые смягчения](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

Вот более сложный пример, в котором переходят несколько свойств, с разной продолжительностью и кривыми смягчения для входа и выхода:

```vue-html
<Transition name="slide-fade">
  <p v-if="show">привет</p>
</Transition>
```

```css
/*
  Анимации входа и выхода могут иметь разную продолжительность и функции синхронизации
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### Анимации CSS {#css-animations}

[Нативные анимации CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) применяются так же, как и CSS-переходы, с той разницей, что `*-enter-from` удаляется не сразу после вставки элемента, а по событию `animationend`.

Для большинства CSS-анимаций мы можем просто объявить их в классах `*-enter-active` и `*-leave-active`. Вот пример:

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Здравствуйте, вот вам задорный текст!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### Пользовательские классы переходов {#custom-transition-classes}

Вы также можете указать пользовательские классы переходов, передав следующие параметры в `<Transition>`:

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

Они отменяют обычные имена классов. Это особенно полезно, когда вы хотите объединить систему переходов Vue с существующей библиотекой анимации CSS, например [Animate.css](https://daneden.github.io/animate.css/):

```vue-html
<!-- при условии, что файл Animate.css включен на страницу -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### Совместное использование переходов и анимации {#using-transitions-and-animations-together}

Vue необходимо подключить слушателей событий, чтобы знать, когда переход завершился. Это может быть либо `transitionend`, либо `animationend`, в зависимости от типа применяемых CSS-правил. Если вы используете только один или другой тип, Vue может автоматически определить нужный тип.

Однако в некоторых случаях вам может понадобиться и то, и другое в одном элементе, например, CSS-анимация, запускаемая Vue, и CSS-эффект перехода при наведении. В этих случаях вам придется явно объявить тип, о котором вы хотите, чтобы Vue заботился, передав параметр `type` со значением `animation` или `transition`:

```vue-html
<Transition type="animation">...</Transition>
```

### Вложенные переходы и явные длительности переходов {#nested-transitions-and-explicit-transition-durations}

Хотя классы перехода применяются только к прямому дочернему элементу в `<Transition>`, мы можем переходить к вложенным элементам с помощью вложенных CSS-селекторов:

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* правила, направленные на вложенные элементы */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... другие необходимые CSS опущены */
```

Мы даже можем добавить задержку перехода к вложенному элементу при входе, что создаст ступенчатую последовательность анимации входа:

```css{3}
/* задержка входа вложенного элемента для ступенчатого эффекта */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

Однако это создает небольшую проблему. По умолчанию компонент `<Transition>` пытается автоматически определить момент завершения перехода, прослушивая **первое** событие `transitionend` или `animationend` на корневом элементе перехода. При вложенном переходе желательным поведением должно быть ожидание завершения переходов всех внутренних элементов.

В таких случаях вы можете указать явную длительность перехода (в миллисекундах), используя параметр `duration` в компоненте `<Transition>`. Общая длительность должна соответствовать длительности задержки и перехода внутреннего элемента:

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[Попробовать в Песочнице](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

При необходимости вы также можете указать отдельные значения для продолжительности входа и выхода с помощью объекта:

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### Соображения по производительности {#performance-considerations}

Вы можете заметить, что анимация, показанная выше, в основном использует такие свойства, как `transform` и `opacity`. Эти свойства эффективны для анимации, потому что:

1. Они не влияют на макет документа во время анимации, поэтому не вызывают дорогостоящего расчёта макета CSS на каждом кадре анимации.

2. Большинство современных браузеров могут использовать аппаратное ускорение GPU при анимации `transform`.

Для сравнения, такие свойства, как `height` или `margin`, запускают CSS-вёрстку, поэтому они гораздо дороже в анимации и должны использоваться с осторожностью.

## Хуки JavaScript {#javascript-hooks}

Можно подключиться к процессу перехода с помощью JavaScript, прослушивая события компонента `<Transition>`:

```vue-html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// вызывается перед вставкой элемента в DOM.
// Используйте это, чтобы установить состояние "вход-выход" элемента
function onBeforeEnter(el) {}

// вызывается через один кадр после вставки элемента.
// Используйте это, чтобы начать анимацию входа.
function onEnter(el, done) {
  // вызов обратного вызова done для указания окончания перехода
  // необязательно, если используется в сочетании с CSS
  done()
}

// вызывается по завершении перехода в режим входа.
function onAfterEnter(el) {}

// вызывается, когда переход enter отменяется до завершения.
function onEnterCancelled(el) {}

// вызывается перед выходом из хука.
// В большинстве случаев следует просто использовать хук leave.
function onBeforeLeave(el) {}

// вызывается, когда начинается переход к выходу.
// Используйте это, чтобы запустить анимацию выхода.
function onLeave(el, done) {
  // вызов обратного вызова done для указания окончания перехода
  // необязательно, если используется в сочетании с CSS
  done()
}

// вызывается, когда переход к выходу завершен и элемент удален из DOM.
function onAfterLeave(el) {}

// доступно только с переходами v-show
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // вызывается перед вставкой элемента в DOM.
    // Используйте это, чтобы установить состояние "вход-выход" элемента
    onBeforeEnter(el) {},

    // вызывается через один кадр после вставки элемента.
    // Используйте это для запуска анимации.
    onEnter(el, done) {
      // вызов обратного вызова done для указания окончания перехода
      // необязательно, если используется в сочетании с CSS
      done()
    },

    // вызывается по завершении перехода в режим входа.
    onAfterEnter(el) {},

    // вызывается, когда переход enter отменяется до завершения.
    onEnterCancelled(el) {},

    // вызывается перед выходом из хука.
    // В большинстве случаев следует просто использовать хук leave.
    onBeforeLeave(el) {},

    // вызывается, когда начинается переход к выходу.
    // Используйте это, чтобы запустить анимацию выхода.
    onLeave(el, done) {
      // вызов обратного вызова done для указания окончания перехода
      // необязательно, если используется в сочетании с CSS
      done()
    },

    // вызывается, когда переход к выходу завершен и элемент удален из DOM.
    onAfterLeave(el) {},

    // доступно только с переходами v-show
    onLeaveCancelled(el) {}
  }
}
```

</div>

Эти хуки можно использовать в сочетании с CSS-переходами/анимацией или самостоятельно.

При использовании переходов только на JavaScript обычно рекомендуется добавить параметр `:css="false"`. Это явно указывает Vue на необходимость пропускать автоматическое определение CSS-переходов. Помимо того, что это немного более производительно, это также предотвращает случайное вмешательство правил CSS в переход:

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

Используя `:css="false"`, мы также полностью контролируем момент окончания перехода. В этом случае обратные вызовы `done` требуются для хуков `@enter` и `@leave`. В противном случае хуки будут вызваны синхронно, и переход завершится немедленно.

Вот демонстрация, использующая [библиотеку GSAP](https://gsap.com/) для выполнения анимации. Разумеется, вы можете использовать любую другую библиотеку анимации, например [Anime.js](https://animejs.com/) или [Motion One](https://motion.dev/):

<JsHooks />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## Переиспользование переходов {#reusable-transitions}

Переходы можно использовать повторно с помощью системы компонентов Vue. Чтобы создать многократно используемый переход, мы можем создать компонент, который обернет компонент `<Transition>` и передаст содержимое слота:

```vue{5}
<!-- MyTransition.vue -->
<script>
// JavaScript подключает логику...
</script>

<template>
  <!-- обернуть встроенный компонент Transition -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- передавать содержимое слота -->
  </Transition>
</template>

<style>
/*
  Необходимые CSS...
  Примечание: Не используйте здесь <style scoped>, поскольку он не применяется к содержимому слота.
*/
</style>
```

Теперь `MyTransition` можно импортировать и использовать так же, как и встроенную версию:

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

##Переход при появлении {#transition-on-appear}

Если вы также хотите применить переход к начальному рендеру узла, вы можете добавить свойство `appear`:

```vue-html
<Transition appear>
  ...
</Transition>
```

## Переход между элементами {#transition-between-elements}

Помимо переключения элемента с помощью `v-if` / `v-show`, мы также можем переходить между двумя элементами с помощью `v-if` / `v-else` / `v-else-if`, при условии, что в каждый момент времени будет показан только один элемент:

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Изменить</button>
  <button v-else-if="docState === 'edited'">Сохранить</button>
  <button v-else-if="docState === 'editing'">Отменить</button>
</Transition>
```

<BetweenElements />

[Попробовать в Песочнице](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## Режимы перехода {#transition-modes}

В предыдущем примере элементы входа и выхода анимируются одновременно, и нам пришлось применить для них `position: absolute`, чтобы избежать проблем с компоновкой, когда оба элемента присутствуют в DOM.

Однако в некоторых случаях это невозможно или просто нежелательно. Мы можем захотеть, чтобы сначала анимировался выходящий элемент, а входящий элемент вставлялся только **после** завершения анимации выхода. Организовать такую анимацию вручную было бы очень сложно — к счастью, мы можем включить это поведение, передав `<Transition>` свойство `mode`:

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

Вот предыдущая демонстрация с `mode="out-in"`:

<BetweenElements mode="out-in" />

`<Transition>` также поддерживает `mode="in-out"`, хотя используется гораздо реже.

## Переход между компонентами {#transition-between-components}

`<Transition>` также можно использовать вокруг [динамических компонентов](/guide/essentials/component-basics#dynamic-components):

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## Динамические переходы {#dynamic-transitions}

Атрибуты `<Transition>`, такие как `name`, также могут быть динамическими! Это позволяет нам динамически применять различные переходы в зависимости от изменения состояния:

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

Это может быть полезно, когда вы определили CSS-переходы / анимацию, используя соглашения классов переходов Vue, и хотите переключаться между ними.

Вы также можете применять различное поведение в хуках перехода JavaScript в зависимости от текущего состояния вашего компонента. Наконец, окончательный способ создания динамических переходов — это [компоненты переходов многократного использования](#reusable-transitions), которые принимают параметры для изменения характера используемого перехода (переходов). Это может показаться пошлым, но единственное ограничение — это ваше воображение.

## Переходы с атрибутом `key` {#transitions-with-the-key-attribute}

Иногда вам нужно принудительно перерисовать элемент DOM, чтобы произошёл переход.

Возьмем, к примеру, этот компонент счётчика:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
setInterval(() => count.value++, 1000)
</script>
<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>
<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

Если бы мы исключили атрибут `key`, то обновился бы только текстовый узел, и, следовательно, перехода бы не произошло. Однако с атрибутом `key` Vue знает, что нужно создавать новый элемент `span` при каждом изменении `count`, и таким образом компонент `Transition` имеет 2 разных элемента для перехода.

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**Ссылки по теме**

- [Справочник по API `<Transition>`](/api/built-in-components#transition)
