# Рендеринг списков {#list-rendering}

Мы можем использовать директиву `v-for` для вывода списка элементов на основе исходного массива:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Здесь `todo` — локальная переменная, представляющая элемент массива, по которому в данный момент выполняется итерация. Он доступен только в элементе `v-for` или внутри него, подобно области видимости функции.

Обратите внимание, что мы также присваиваем каждому объекту задачи уникальный `id`, и привязываем его как <a target="_blank" href="/api/built-in-special-attributes.html#key">специальный атрибут `key`</a> для каждого `<li>`. Ключ `key` позволяет Vue точно перемещать каждый `<li>` в соответствии с позицией соответствующего объекта в массиве.

Обновить список можно двумя способами:

1. Вызовите [мутирующие методы](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) на исходном массиве:

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Замените массив на новый:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Здесь у нас есть простой список дел — попробуйте реализовать логику для методов `addTodo()` и `removeTodo()`, чтобы он заработал!

Подробнее о `v-for`: <a target="_blank" href="/guide/essentials/list.html">Рендеринг списков</a>.
