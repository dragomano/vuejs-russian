---
outline: deep
---

<script setup>
import { ref } from 'vue'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
</script>

# Привязка элементов формы {#form-input-bindings}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3" title="Бесплатный урок по пользовательскому вводу с помощью Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-inputs-in-vue" title="Бесплатный урок по пользовательскому вводу с помощью Vue.js"/>
</div>

При работе с формами на фронтенде нам часто требуется синхронизировать состояние элементов ввода формы с соответствующим состоянием в JavaScript. Вручную настраивать привязки значений и слушателей событий может быть обременительно:

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

Директива `v-model` помогает нам упростить вышесказанное до:

```vue-html
<input v-model="text">
```

Кроме того, `v-model` можно использовать для элементов ввода различных типов, элементов `<textarea>` и `<select>`. Она автоматически расширяется на различные пары свойств и событий DOM в зависимости от элемента, на котором используется:

- Элементы `<input>` с текстовым типом и `<textarea>` используют свойство `value` и событие `input`;
- `<input type="checkbox">` и `<input type="radio">` используют свойство `checked` и событие `change`;
- `<select>` использует `value` в качестве параметра и `change` в качестве события.

::: tip Примечание
`v-model` будет игнорировать начальные атрибуты `value`, `checked` или `selected`, найденные на любых элементах формы. Она всегда будет рассматривать текущее связанное состояние JavaScript как источник истины. Вы должны объявить начальное значение на стороне JavaScript, используя <span class="options-api">свойство [`data`](/api/options-state.html#data)</span><span class="composition-api">[Reactivity API](/api/reactivity-core.html#reactivity-api-core)</span>.
:::

## Основы {#basic-usage}

### Текст (`input type="text"`) {#text}

```vue-html
<p>Сообщение: {{ message }}</p>
<input v-model="message" placeholder="измени меня" />
```

<div class="demo">
  <p>Сообщение: {{ message }}</p>
  <input v-model="message" placeholder="измени меня" />
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jUEOgyAQRa8yYUO7aNkbNOkBegM2RseWRGACoxvC3TumxuX/+f+9ql5Ez31D1SlbpuyJoSBvNLjoA6XMUCHjAg2WnAJomWoXXZxSLAwBSxk/CP2xuWl9d9GaP0YAEhgDrSOjJABLw/s8+NJBrde/NWsOpWPrI20M+yOkGdfeqXPiFAhowm9aZ8zS4+wPv/RGjtZcJtV+YpNK1g==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)

</div>

<span id="vmodel-ime-tip"></span>
::: tip Примечание
Для языков, требующих [IME](https://ru.wikipedia.org/wiki/IME) (китайский, японский, корейский и т. д.), вы заметите, что `v-model` не обновляется во время составления IME. Если вы хотите реагировать и на эти обновления, используйте свой собственный слушатель событий `input` и привязку `value` вместо использования `v-model`.
:::

### Многострочный текст (`textarea`) {#multiline-text}

```vue-html
<span>Многострочное сообщение:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="добавь несколько строк"></textarea>
```

<div class="demo">
  <span>Многострочное сообщение:</span>
  <p style="white-space: pre-line;">{{ multilineText }}</p>
  <textarea v-model="multilineText" placeholder="добавь несколько строк"></textarea>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jktuwzAMRK9CaON24XrvKgZ6gN5AG8FmGgH6ECKdJjB891D5LYec9zCb+SH6Oq9oRmN5roEEGGWlyeWQqFSBDSoeYYdjLQk6rXYuuzyXzAIJmf0fwqF1Prru02U7PDQq0CCYKHrBlsQy+Tz9rlFCDBnfdOBRqfa7twhYrhEPzvyfgmCvnxlHoIp9w76dmbbtDe+7HdpaBQUv4it6OPepLBjV8Gw5AzpjxlOJC1a9+2WB1IZQRGhWVqsdXgb1tfDcbvYbJDRqLQ==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNo9jk2OwyAMha9isenMIpN9hok0B+gN2FjBbZEIscDpj6LcvaZpKiHg2X6f32L+mX+uM5nO2DLkwNK7RHeesoCnE85RYHEJwKPg1/f2B8gkc067AhipFDxTB4fDVlrro5ce237AKoRGjihUldjCmPqjLgkxJNoxEEqnrtp7TTEUeUT6c+Z2CUKNdgbdxZmaavt1pl+Wj3ldbcubUegumAnh2oyTp6iE95QzoDEGukzRU9Y6eg9jDcKRoFKLUm27E5RXxTu7WZ89/G4E)

</div>

Обратите внимание, что интерполяция внутри `<textarea>` не будет работать. Вместо этого используйте `v-model`.

```vue-html
<!-- bad -->
<textarea>{{ text }}</textarea>

<!-- good -->
<textarea v-model="text"></textarea>
```

### Флажок (`input type="checkbox"`) {#checkbox}

Одиночный флажок, булево значение:

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" v-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVjssKgzAURH/lko3tonVfotD/yEaTKw3Ni3gjLSH/3qhUcDnDnMNk9gzhviRkD8ZnGXUgmJFS6IXTNvhIkCHiBAWm6C00ddoIJ5z0biaQL5RvVNCtmwvFhFfheLuLqqIGQhvMQLgm4tqFREDfgJ1gGz36j2Cg1TkvN+sVmn+JqnbtrjDDiAYmH09En/PxphTebqsK8PY4wMoPslBUxQ==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)

</div>

Мы также можем привязать несколько флажков к одному и тому же массиву или объекту [Set](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set):

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```vue-html
<div>Отмеченные имена: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Женя" v-model="checkedNames">
<label for="jack">Женя</label>

<input type="checkbox" id="john" value="Ваня" v-model="checkedNames">
<label for="john">Ваня</label>

<input type="checkbox" id="mike" value="Миша" v-model="checkedNames">
<label for="mike">Миша</label>
```

<div class="demo">
  <div>Отмеченные имена: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Женя" v-model="checkedNames">
  <label for="demo-jack">Женя</label>

  <input type="checkbox" id="demo-john" value="Ваня" v-model="checkedNames">
  <label for="demo-john">Ваня</label>

  <input type="checkbox" id="demo-mike" value="Миша" v-model="checkedNames">
  <label for="demo-mike">Миша</label>
</div>

В этом случае массив `checkedNames` всегда будет содержать значения из текущих отмеченных флажков.

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqVkUtqwzAURbfy0CTtoNU8KILSWaHdQNWBIj8T1fohyybBeO+RbOc3i2e+vHvuMWggHyG89x2SLWGtijokaDF1gQunbfAxwQARaxihjt7CJlc3wgmnvGsTqAOqBqsfabGFXSm+/P69CsfovJVXckhog5EJcwJgle7558yBK+AWhuFxaRwZLbVCZ0K70CVIp4A7Qabi3h8FAV3l/C9Vk797abpy/lrim/UVmkt/Gc4HOv+EkXs0UPt4XeCFZHQ6lM4TZn9w9+YlrjFPCC/kKrPVDd6Zv5e4wjwv8ELezIxeX4qMZwHduAs=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqVUc1qxCAQfpXBU3tovS9WKL0V2hdoenDjLGtjVNwxbAl592rMpru3DYjO5/cnOLLXEJ6HhGzHxKmNJpBsHJ6DjwQaDypZgrFxAFqRenisM0BEStFdEEB7xLZD/al6PO3g67veT+XIW16Cr+kZEPbBKsKMAIQ2g3yrAeBqwjjeRMI0CV5kxZ0dxoVEQL8BXxo2C/f+3DAwOuMf1XZ5HpRNhX5f4FPvNdqLfgnOBK+PsGqPFg4+rgmyOAWfiaK5o9kf3XXzArc0zxZZnJuae9PhVfPHAjc01wRZnP/Ngq8/xaY/yMW74g==)

</div>

### Переключатель (`input type="radio"`) {#radio}

```vue-html
<div>Выбрано: {{ picked }}</div>

<input type="radio" id="one" value="Один" v-model="picked" />
<label for="one">Один</label>

<input type="radio" id="two" value="Два" v-model="picked" />
<label for="two">TДва/label>
```

<div class="demo">
  <div>Выбрано: {{ picked }}</div>

  <input type="radio" id="one" value="Один" v-model="picked" />
  <label for="one">Один</label>

  <input type="radio" id="two" value="Два" v-model="picked" />
  <label for="two">Два</label>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqFkDFuwzAMRa9CaHE7tNoDxUBP0A4dtTgWDQiRJUKmHQSG7x7KhpMMAbLxk3z/g5zVD9H3NKI6KDO02RPDgDxSbaPvKWWGGTJ2sECXUw+VrFY22timODCQb8/o4FhWPqrfiNWnjUZvRmIhgrGn0DCKAjDOT/XfCh1gnnd+WYwukwJYNj7SyMBXwqNVuXE+WQXeiUgRpZyaMJaR5BX11SeHQfTmJi1dnNiE5oQBupR3shbC6LX9Posvpdyz/jf1OksOe85ayVqIR5bR9z+o5Qbc6oCk)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqNkEEOAiEMRa/SsFEXyt7gJJ5AFy5ng1ITIgLBMmomc3eLOONSEwJ9Lf//pL3YxrjqMoq1ULdTspGa1uMjhkRg8KyzI+hbD2A06fmi1gAJKSc/EkC0pwuaNcx2Hme1OZSHLz5KTtYMhNfoNGEhUsZ2zf6j7vuPEQyDkmVSBPzJ+pgJ6Blx04qkjQ2tAGsYgkcuO+1yGXF6oeU1GHTM1Y1bsoY5fUQH55BGZcMKJd/t31l0L+WYdaj0V9Zb2bDim6XktAcxvADR+YWb)

</div>

### Выпадающий список (`select`) {#select}

Выбор одного значения:

```vue-html
<div>Выбрано: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Выберите что-нибудь</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Выбрано: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Выберите что-нибудь</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1j7EOgyAQhl/lwmI7tO4Nmti+QJOuLFTPxASBALoQ3r2H2jYOjvff939wkTXWXucJ2Y1x37rBBvAYJlsLPYzWuAARHPaQoHdmhILQQmihW6N9RhW2ATuoMnQqirPQvFw9ZKAh4GiVDEgTAPdW6hpeW+sGMf4VKVEz73Mvs8sC5stoOlSVYF9SsEVGiLFhMBq6wcu3IsUs1YREEvFUKD1udjAaebnS+27dHOT3g/yxy+nHywM08PJ3KksfXwJ2dA==)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1j1ELgyAUhf/KxZe2h633cEHbHxjstReXdxCYSt5iEP333XIJPQSinuN3jjqJyvvrOKAohAxN33oqa4tf73oCjR81GIKptgBakTqd4x6gRxp6uymAgAYbQl1AlkVvXhaeeMg8NbMg7LxRhKwAZPDKlvBK8WlKXTDPnFzOI7naMF46p9HcarFxtVgBRpyn1lnQbVBvwwWjMgMyycTToAr47wZnUeaR3mfL6sC/H/iPnc/vXS9gIfP0UTH/ACgWeYE=)

</div>

:::tip Примечание
Если начальное значение выражения `v-model` не соответствует ни одному из вариантов, элемент `<select>` будет отображаться в виде _unselected_. На iOS это приведет к тому, что пользователь не сможет выбрать первый элемент, потому что iOS не запускает событие изменения в этом случае. Поэтому рекомендуется предоставлять опцию _disabled_ с пустым значением, как показано в примере выше.
:::

Множественный выбор (привязка к массиву):

```vue-html
<div>Выбрано: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Выбрано: {{ multiSelected }}</div>

  <select v-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1kL2OwjAQhF9l5Ya74i7QBhMJeARKTIESIyz5Z5VsAsjyu7NOQEBB5xl/M7vaKNaI/0OvRSlkV7cGCTpNPVbKG4ehJYjQ6hMkOLXBwYzRmfLK18F3GbW6Jt3AKkM/+8Ov8rKYeriBBWmH9kiaFYBszFDtHpkSYnwVpCSL/JtDDE4+DH8uNNqulHiCSoDrLRm0UyWzAckEX61l8Xh9+psv/vbD563HCSxk8bY0y45u47AJ2D/HHyDm4MU0dC5hMZ/jdal8Gg8wJkS6A3nRew4=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1UEEOgjAQ/MqmJz0oeMVKgj7BI3AgdI1NCjSwIIbwdxcqRA4mTbsznd2Z7CAia49diyIQsslrbSlMSuxtVRMofGStIRiSEkBllO32rgaokdq6XBBAgwZzQhVAnDpunB6++EhvncyAsLAmI2QEIJXuwvvaPAzrJBhH6U2/UxMLHQ/doagUmksiFmEioOCU2ho3krWVJV2VYSS9b7Xlr3/424bn1LMDA+n9hGbY0Hs2c4J4sU/dPl5a0TOAk+/b/rwsYO4Q4wdtRX7l)

</div>

Варианты выбора могут быть динамически отображены с помощью `v-for`:

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'Один', value: 'A' },
  { text: 'Два', value: 'B' },
  { text: 'Три', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'Один', value: 'A' },
        { text: 'Два', value: 'B' },
        { text: 'Три', value: 'C' }
      ]
    }
  }
}
```

</div>

```vue-html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Выбрано: {{ selected }}</div>
```

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNplkMFugzAQRH9l5YtbKYU7IpFoP6CH9lb3EMGiWgLbMguthPzvXduEJMqNYUazb7yKxrlimVFUop5arx3BhDS7kzJ6dNYTrOCxhwC9tyNIjkpllGmtmWJ0wJawg2MMPclGPl9N60jzx+Z9KQPcRfhHFch3g/IAy3mYkVUjIRzu/M9fe+O/Pvo/Hm8b3jihzDdfr8s8gwewIBzdcCZkBVBnXFheRtvhcFTiwq9ECnAkQ3Okt54Dm9TmskYJqNLR3SyS3BsYct3CRYSFwGCpusx/M0qZTydKRXWnl9PHBlPFhv1lQ6jL6MZl+xoR/gFjPZTD)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNp1kMFqxCAQhl9l8JIWtsk92IVtH6CH9lZ7COssDbgqZpJdCHn3nWiUXBZE/Mdvxv93Fifv62lE0Qo5nEPv6ags3r0LBBov3WgIZmUBdEfdy2s6AwSkMdisAAY0eCbULVSn6pCrzlPv7NDCb64AzEB4J+a+LFYHmDozYuyCpfTtqJ+b21Efz6j/gPtpn8xl7C8douaNl2xKUhaEV286QlYAMgWB6e3qNJp3JXIyJSLASErFyMUFBjbZ2xxXCWijkXJZR1kmsPF5g+s1ACybWdmkarLSpKejS0VS99Pxu3wzT8jOuF026+2arKQRywOBGJfE)

</div>

## Привязка значения {#value-bindings}

Для элементов _radio_, _checkbox_ и _select_ значения привязки `v-model` обычно являются статическими строками (или булевыми значениями для checkbox):

```vue-html
<!-- `picked` это строка "a" при выборе -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` является либо истинным, либо ложным -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` это строка "abc" при выборе первого варианта -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Но иногда мы можем захотеть привязать значение к динамическому свойству текущего активного экземпляра. Для этого мы можем использовать `v-bind`. Кроме того, использование `v-bind` позволяет привязывать входное значение к нестроковым значениям.

### Флажок {#checkbox-1}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` и `false-value` — специфические для Vue атрибуты, которые работают только с `v-model`. Здесь значение свойства `toggle` будет установлено в `'yes'`, когда флажок установлен, и в `'no'`, когда флажок снят. Вы также можете привязать их к динамическим значениям с помощью `v-bind`:

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip Совет
Атрибуты `true-value` и `false-value` не влияют на атрибут `value` элемента ввода, потому что браузеры не включают в формы не отмеченные флажки. Чтобы гарантировать, что в форме будет представлено одно из двух значений (например, «yes» или «no»), используйте вместо флажков переключатели.
:::

### Переключатель {#radio-1}

```vue-html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

Переменная `pick` получит значение `first`, когда будет отмечен первый переключатель, и значение `second`, когда будет отмечен второй.

### Варианты списка {#select-options}

```vue-html
<select v-model="selected">
  <!-- встроенный объектный литерал -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` поддерживает привязку значений, не являющихся строками! В приведённом выше примере, когда опция выбрана, `selected` будет установлено в значение объектного литерала `{ number: 123 }`.

## Модификаторы {#modifiers}

### `.lazy` {#lazy}

По умолчанию `v-model` синхронизирует входные данные с данными после каждого события `input` (за исключением композиции IME, как [указано выше](#vmodel-ime-tip)). Можно добавить модификатор `lazy`, чтобы вместо этого синхронизироваться после событий `change`:

```vue-html
<!-- синхронизировано после "change" вместо "input" -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

Если вы хотите, чтобы вводимые пользователем данные автоматически преобразовывались в число, вы можете добавить модификатор `number` к атрибуту `v-model`:

```vue-html
<input v-model.number="age" />
```

Если значение не может быть разобрано с помощью `parseFloat()`, то вместо него используется исходное значение.

Модификатор `number` применяется автоматически, если входные данные имеют `type="number"`.

### `.trim` {#trim}

Если вы хотите, чтобы пробельные символы из пользовательского ввода обрезались автоматически, вы можете добавить модификатор `trim` к атрибуту `v-model`:

```vue-html
<input v-model.trim="msg" />
```

## `v-model` с компонентами {#v-model-with-components}

> Если вы ещё не знакомы с компонентами Vue, можете пока пропустить этот пункт.

Встроенные в HTML типы ввода не всегда удовлетворяют вашим потребностям. К счастью, компоненты Vue позволяют создавать многократно используемые входы с полностью настраиваемым поведением. Эти входы работают даже с `v-model`! Чтобы узнать больше, прочитайте об [Использовании с `v-model`](/guide/components/v-model) в руководстве по компонентам.
