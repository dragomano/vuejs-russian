# Options: Разное {#options-misc}

## name {#name}

Явно объявляем отображаемое имя компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Подробности**

  Имя компонента используется для следующих целей:

  - Рекурсивные ссылки на себя в собственном шаблоне компонента
  - Отображение в дереве проверки компонентов Vue DevTools
  - Отображение в следах компонентов предупреждения

  При использовании однофайловых компонентов компонент уже сам определяет свое имя на основе имени файла. Например, файл с именем `MyComponent.vue` будет иметь предполагаемое отображаемое имя «MyComponent».

  Другой случай — когда компонент регистрируется глобально с помощью [`app.component`](/api/application#app-component), глобальный ID автоматически устанавливается в качестве его имени.

  Опция `name` позволяет вам переопределить выведенное имя или явно указать имя, когда оно не может быть выведено (например, если не используются инструменты сборки, или встроенный компонент, не относящийся к SFC).

  Есть один случай, когда `name` явно необходимо: при сопоставлении с кэшируемыми компонентами в [`<KeepAlive>`](/guide/built-ins/keep-alive) через его параметры `include / exclude`.

  :::tip Примечание
  Начиная с версии 3.2.34, однофайловый компонент, использующий `<script setup>`, будет автоматически определять опцию `name` на основе имени файла, устраняя необходимость вручную объявлять имя даже при использовании с `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Контролирует, следует ли включить стандартное поведение выпадения атрибутов компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // по умолчанию: true
  }
  ```

- **Подробности**

  По умолчанию привязки атрибутов родительской области видимости, которые не распознаются как параметры, будут «выпадать». Это означает, что когда у нас есть компонент с одним корнем, эти привязки будут применяться к корневому элементу дочернего компонента как обычные HTML-атрибуты. При создании компонента, который оборачивает целевой элемент или другой компонент, это не всегда может быть желаемым поведением. Установив `inheritAttrs` в `false`, можно отключить это поведение по умолчанию. Атрибуты доступны через свойство экземпляра `$attrs` и могут быть явно привязаны к некорневому элементу с помощью `v-bind`.

- **Пример**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  При объявлении этой опции в компоненте, использующем `<script setup>`, вы можете использовать макрос [`defineOptions`](/api/sfc-script-setup#defineoptions):

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **Смотрите также** [Обычные атрибуты](/guide/components/attrs)

## components {#components}

Объект, регистрирующий компоненты, которые будут доступны экземпляру компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Пример**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // короткая запись
      Foo,
      // регистрация под другим именем
      RenamedBar: Bar
    }
  }
  ```

- **Смотрите также** [Регистрация компонентов](/guide/components/registration)

## directives {#directives}

Объект, регистрирующий директивы, которые должны быть доступны экземпляру компонента.

- **Тип**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Пример**

  ```js
  export default {
    directives: {
      // включение v-focus в шаблоне
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **Смотрите также** [Пользовательские директивы](/guide/reusability/custom-directives)
