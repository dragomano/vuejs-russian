# Слоты {#slots}

Помимо передачи данных через параметры, родительский компонент может передавать дочернему фрагменты шаблонов через **слоты**:

<div class="sfc">

```vue-html
<ChildComp>
  Это содержимое слота!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  Это содержимое слота!
</child-comp>
```

</div>

В дочернем компоненте содержимое слота можно отобразить, используя элемент `<slot>`:

<div class="sfc">

```vue-html
<!-- в шаблоне дочернего компонента -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- в шаблоне дочернего компонента -->
<slot></slot>
```

</div>

Содержимое внутри `<slot>` будет рассматриваться как «резервное»: оно отображается, если снаружи в дочерний компонент ничего не передаётся:

```vue-html
<slot>Резервное содержимое</slot>
```

В настоящее время мы не передаем содержимое слота в `<ChildComp>`, поэтому вы должны видеть резервное содержимое. Давайте предоставим дочернему слоту некоторый текст, используя переменную `msg`.
