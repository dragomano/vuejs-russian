<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` — это встроенный компонент, который позволяет нам условно кэшировать экземпляры компонентов при динамическом переключении между несколькими компонентами.

## Базовое использование {#basic-usage}

В главе «Основы компонентов» мы представили синтаксис для [динамических компонентов](/guide/essentials/component-basics#dynamic-components), используя специальный элемент `<component>`:

```vue-html
<component :is="activeComponent" />
```

По умолчанию активный экземпляр компонента будет размонтирован при переключении с него. Это приведет к потере всех изменённых состояний. При повторном отображении этого компонента будет создан новый экземпляр, содержащий только начальное состояние.

В примере ниже у нас есть два компонента с состоянием — A содержит счётчик, а B — сообщение, синхронизированное с входом через `v-model`. Попробуйте обновить состояние одного из них, переключиться, а затем снова переключиться на него:

<SwitchComponent />

Вы заметите, что при обратном переключении предыдущее изменённое состояние будет сброшено.

Создание нового экземпляра компонента при переключении обычно является полезным поведением, но в данном случае мы хотели бы, чтобы два экземпляра компонента сохранялись, даже когда они неактивны. Чтобы решить эту проблему, мы можем обернуть наш динамический компонент с помощью встроенного компонента `<KeepAlive>`:

```vue-html
<!-- Неактивные компоненты будут кэшироваться! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Теперь состояние будет сохраняться во всех переключателях компонентов:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Попробовать в Песочнице](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip Совет
При использовании в [DOM-шаблонах](/guide/essentials/component-basics#in-dom-template-parsing-caveats) на него следует ссылаться как на `<keep-alive>`.
:::

## Include / Exclude {#include-exclude}

По умолчанию `<KeepAlive>` будет кэшировать любой экземпляр компонента внутри. Мы можем настроить это поведение с помощью атрибутов `include` и `exclude`. Оба атрибута могут представлять собой строку, разделённую запятыми, `RegExp` или массив, содержащий любой из этих типов:

```vue-html
<!-- строка, разделённая запятыми -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (используем `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Array (используем `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

Соответствие проверяется по опции [`name`](/api/options-misc#name) компонента, поэтому компоненты, которым необходимо условное кэширование с помощью `KeepAlive`, должны явно объявить опцию `name`.

:::tip Совет
Начиная с версии 3.2.34, однофайловый компонент, использующий `<script setup>`, будет автоматически определять опцию `name` на основе имени файла, избавляя вас от необходимости вручную объявлять имя.
:::

## Максимальное количество кэшированных экземпляров {#max-cached-instances}

Мы можем ограничить максимальное количество экземпляров компонентов, которые могут быть кэшированы, с помощью параметра `max`. Если указано `max`, `<KeepAlive>` ведет себя как [LRU-кэш](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): Если количество кэшированных экземпляров превысит указанное максимальное количество, то наименее часто используемый кэшированный экземпляр будет уничтожен, чтобы освободить место для нового.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Жизненный цикл кэшированного экземпляра {#lifecycle-of-cached-instance}

Когда экземпляр компонента удаляется из DOM, но является частью дерева компонентов, кэшируемого `<KeepAlive>`, он переходит в состояние **deactivated** вместо того, чтобы быть размонтированным. Когда экземпляр компонента вставляется в DOM как часть кэшированного дерева, он **активируется**.

<div class="composition-api">

Сохраняющий жизнеспособность компонент может зарегистрировать хуки жизненного цикла для этих двух состояний с помощью [`onActivated()`](/api/composition-api-lifecycle#onactivated) и [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // вызывается при первоначальном монтировании
  // и при каждом повторном извлечении из кэша
})

onDeactivated(() => {
  // вызывается при удалении из DOM в кэш, а также при размонтировании
})
</script>
```

</div>
<div class="options-api">

Сохраняющий жизнеспособность компонент может зарегистрировать хуки жизненного цикла для этих двух состояний с помощью хуков [`activated`](/api/options-lifecycle#activated) и [`deactivated`](/api/options-lifecycle#deactivated):

```js
export default {
  activated() {
    // вызывается при первоначальном монтировании
    // и при каждом повторном извлечении из кэша
  },
  deactivated() {
    // вызывается при удалении из DOM в кэш, а также при размонтировании
  }
}
```

</div>

Обратите внимание, что:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> также вызывается при монтировании, как и <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> при размонтировании.

- Оба хука работают не только для корневого компонента, кэшируемого `<KeepAlive>`, но и для компонентов-потомков в кэшированном дереве.

---

**Ссылки по теме**

- [Ссылка на API `<KeepAlive>`](/api/built-in-components#keepalive)
