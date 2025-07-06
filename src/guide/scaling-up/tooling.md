<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Инструменты {#tooling}

## Попробуйте онлайн {#try-it-online}

Чтобы опробовать Vue SFC, не нужно ничего устанавливать в системе — есть онлайн-площадки, которые позволяют сделать это прямо в браузере:

- [Песочница Vue SFC](https://play.vuejs.org)
  - Всегда развёртывается из последнего коммита
  - Предназначена для проверки результатов компиляции компонентов
- [Vue + Vite на StackBlitz](https://vite.new/vue)
  - IDE-подобная среда, работающая с актуальным dev-сервером Vite в браузере
  - Ближе всего к локальной установке

Также рекомендуется использовать эти онлайн-площадки для предоставления репродукций при сообщении об ошибках.

## Заготовка проекта {#project-scaffolding}

### Vite {#vite}

[Vite](https://dragomano.github.io/vite-docs/) — это лёгкий и быстрый инструмент для сборки с первоклассной поддержкой однофайловых компонентов Vue. Его создал Эван Ю, который также является автором Vue!

Чтобы начать работу с Vite + Vue, просто запустите команду:

::: code-group

```sh [npm]
$ npm create vue@latest
```

```sh [pnpm]
$ pnpm create vue@latest
```

```sh [yarn]
# Для Yarn Modern (v2+)
$ yarn create vue@latest

# Для Yarn ^v4.11
$ yarn dlx create-vue@latest
```

```sh [bun]
$ bun create vue@latest
```

:::

Эта команда установит и выполнит [create-vue](https://github.com/vuejs/create-vue), официальный инструмент для создания заготовок для проектов Vue.

- Чтобы узнать больше о Vite, ознакомьтесь с [документацией Vite](https://dragomano.github.io/vite-docs/).
- Чтобы настроить специфическое для Vue поведение в проекте Vite, например, передать опции компилятору Vue, ознакомьтесь с документацией для [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Обе вышеупомянутые онлайн-площадки также поддерживают загрузку файлов в качестве проекта Vite.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) — официальный инструментарий на основе webpack для Vue. Сейчас он находится в режиме обслуживания, и мы рекомендуем начинать новые проекты с Vite, если только вы не полагаетесь на специфические функции, доступные только в webpack. В большинстве случаев Vite обеспечивает превосходный опыт разработчиков.

Для получения информации о переходе с Vue CLI на Vite:

- [Руководство по миграции Vue CLI -> Vite с сайта VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Инструменты и плагины, которые помогают в автомиграции](https://github.com/vitejs/awesome-vite#vue-cli)

### Примечание о компиляции шаблонов в браузере {#note-on-in-browser-template-compilation}

При использовании Vue без этапа сборки шаблоны компонентов записываются либо непосредственно в HTML страницы, либо в виде встроенных строк JavaScript. В таких случаях Vue необходимо поставлять компилятор шаблонов в браузер, чтобы выполнять компиляцию шаблонов «на лету». С другой стороны, компилятор будет не нужен, если мы предварительно скомпилируем шаблоны на этапе сборки. Чтобы уменьшить размер клиентского пакета, Vue предоставляет [различные «сборки»](https://unpkg.com/browse/vue@3/dist/), оптимизированные для разных случаев использования.

- Файлы сборки, начинающиеся с `vue.runtime.*`, являются **сборками только для runtime**: они не включают в себя компилятор. При использовании этих сборок все шаблоны должны быть предварительно скомпилированы на этапе сборки.

- Файлы сборки, не включающие `.runtime`, являются **полными сборками**: Они включают в себя компилятор и поддерживают компиляцию шаблонов непосредственно в браузере. Однако они увеличат полезную нагрузку на ~14 КБ.

В наших настройках инструментов по умолчанию используется сборка только во время выполнения, поскольку все шаблоны в SFC предварительно скомпилированы. Если по каким-то причинам вам нужна компиляция шаблонов в браузере даже с шагом сборки, вы можете сделать это, настроив инструмент сборки так, чтобы вместо псевдонима `vue` был указан `vue/dist/vue.esm-bundler.js`.

Если вы ищете более лёгкую альтернативу для использования без этапа сборки, обратите внимание на [petite-vue](https://github.com/vuejs/petite-vue).

## Поддержка IDE {#ide-support}

- Рекомендуемая настройка IDE — [VS Code](https://code.visualstudio.com/) + расширение [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Расширение обеспечивает подсветку синтаксиса, поддержку TypeScript и intellisense для шаблонных выражений и параметров компонентов.

  :::tip Совет
  Volar заменяет [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), наше предыдущее официальное расширение VS Code для Vue 2. Если у вас установлен Vetur, не забудьте отключить его в проектах Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) также обеспечивает отличную встроенную поддержку однофайловых компонентов Vue.

- Другие IDE, поддерживающие [Протокол языковой службы](https://microsoft.github.io/language-server-protocol/) (LSP), также могут использовать основные функции Volar через LSP:

  - Поддержка Sublime Text с помощью [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Поддержка vim / Neovim с помощью [coc-volar](https://github.com/yaegassy/coc-volar).

  - Поддержка emacs с помощью [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Инструменты разработчика в браузере {#browser-devtools}

Расширение Vue Devtools для браузера позволяет исследовать дерево компонентов приложения Vue, проверять состояние отдельных компонентов, отслеживать события управления состоянием и профилировать производительность.

![Скриншот инструментов разработчика](./images/devtools.png)

- [Документация](https://devtools.vuejs.org/)
- [Расширение Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Плагин Vite](https://devtools.vuejs.org/guide/vite-plugin)
- [Автономное приложение Electron](https://devtools.vuejs.org/guide/standalone)

## TypeScript {#typescript}

Основная статья: [Использование Vue с TypeScript](/guide/typescript/overview).

- [Volar](https://github.com/johnsoncodehk/volar) обеспечивает проверку типов для SFC, использующих блоки `<script lang="ts">`, включая шаблонные выражения и кросс-компонентную проверку параметров.

- Используйте [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) для выполнения той же проверки типов из командной строки или для генерации файлов `d.ts` для SFC.

## Тестирование {#testing}

Основная статья: [Руководство по тестированию](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) рекомендуется для проведения тестов E2E. Его также можно использовать для тестирования однофайловых компонентов Vue с помощью [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) — это тестовый прогон, созданный членами команды Vue / Vite, который фокусируется на скорости. Он специально разработан для приложений на базе Vite, чтобы обеспечить такой же мгновенный цикл обратной связи для тестирования блоков/компонентов.

- [Jest](https://jestjs.io/) можно заставить работать с Vite через [vite-jest](https://github.com/sodatea/vite-jest). Однако это рекомендуется делать только в том случае, если у вас есть существующие тестовые наборы на базе Jest, которые нужно перенести на Vite, поскольку Vitest предоставляет аналогичные функции с гораздо более эффективной интеграцией.

## Линтинг {#linting}

Команда Vue поддерживает [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), плагин [ESLint](https://eslint.org/), который поддерживает правила линтинга, специфичные для однофайловых компонентов.

Пользователи, ранее использовавшие Vue CLI, могут привыкнуть к тому, что линтеры настраиваются через загрузчики webpack. Однако если вы используете сборку на основе Vite, наша общая рекомендация такова:

1. `npm install -D eslint eslint-plugin-vue`, затем следуйте [руководству по настройке](https://eslint.vuejs.org/user-guide/#usage) `eslint-plugin-vue`.

2. Установите расширения ESLint для IDE, например [ESLint для VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), чтобы получать обратную связь от линтера прямо в редакторе во время разработки. Это также позволяет избежать лишних затрат на линтинг при запуске dev-сервера.

3. Запустите ESLint как часть команды сборки, чтобы получить полную обратную связь от линтера перед отправкой в продакшен.

4. (Необязательно) Настройте такие инструменты, как [lint-staged](https://github.com/okonet/lint-staged), для автоматической перелинковки изменённых файлов при фиксации git.

## Форматирование {#formatting}

- Расширение [Volar](https://github.com/johnsoncodehk/volar) VS Code предоставляет форматирование для Vue SFC из коробки.

- В качестве альтернативы [Prettier](https://prettier.io/) обеспечивает встроенную поддержку форматирования Vue SFC.

## Интеграция пользовательских блоков SFC {#sfc-custom-block-integrations}

Пользовательские блоки компилируются в импорт одного и того же файла Vue с разными запросами. Обработка этих запросов на импорт зависит от базового инструмента сборки.

- Если вы используете Vite, то для преобразования сопоставленных пользовательских блоков в исполняемый JavaScript следует использовать специальный плагин Vite. [Пример](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Если вы используете Vue CLI или обычный webpack, необходимо настроить загрузчик webpack для преобразования согласованных блоков. [Пример](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Пакеты нижнего уровня {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Документация](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Этот пакет является частью монорепо ядра Vue и всегда публикуется с той же версией, что и основной пакет `vue`. Он включен как зависимость в основной пакет `vue` и проксируется под `vue/compiler-sfc`, так что вам не нужно устанавливать его отдельно.

Сам пакет предоставляет низкоуровневые утилиты для обработки Vue SFC и предназначен только для авторов инструментария, которым необходимо поддерживать Vue SFC в пользовательских инструментах.

:::tip Совет
Всегда предпочитайте использовать этот пакет через глубокий импорт `vue/compiler-sfc`, так как это гарантирует синхронизацию его версии со временем выполнения Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Документация](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Официальный плагин, обеспечивающий поддержку Vue SFC в Vite.

### `vue-loader` {#vue-loader}

- [Документация](https://vue-loader.vuejs.org/)

Официальный загрузчик, обеспечивающий поддержку Vue SFC в webpack. Если вы используете Vue CLI, также смотрите [Документацию по изменению опций `vue-loader` во Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Другие онлайн-песочницы {#other-online-playgrounds}

- [Песочница VueUse](https://play.vueuse.org)
- [Vue + Vite на Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue на CodeSandbox](https://codesandbox.io/p/devbox/github/codesandbox/sandbox-templates/tree/main/vue-vite)
- [Vue на Codepen](https://codepen.io/pen/editor/vue)
- [Vue на WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->