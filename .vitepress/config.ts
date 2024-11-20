import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Документация',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Руководство', link: '/guide/introduction' },
      { text: 'Учебник', link: '/tutorial/' },
      { text: 'Примеры', link: '/examples/' },
      { text: 'Быстрый старт', link: '/guide/quick-start' },
      { text: 'Руководство по стилю', link: '/style-guide/' },
      { text: 'Глоссарий', link: '/glossary/' },
      { text: 'Справочник по ошибкам', link: '/error-reference/' },
      {
        text: 'Переход с Vue 2',
        link: 'https://v3.ru.vuejs.org/ru/guide/migration/introduction.html'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Песочница',
    link: 'https://play.vuejs.org'
  },
  {
    text: 'Экосистема',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Ресурсы',
        items: [
          { text: 'Партнёры', link: '/partners/' },
          { text: 'Разработчики', link: '/developers/' },
          { text: 'Темы', link: '/ecosystem/themes' },
          { text: 'Компоненты UI', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Сертификация',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
          },
          { text: 'Работа', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Магазин футболок', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Официальные библиотеки',
        items: [
          { text: 'Vue Router', link: 'https://vue-router-ru.netlify.app' },
          { text: 'Pinia', link: 'https://pinia-ru.netlify.app' },
          { text: 'Руководство по инструментам', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: 'Видеокурсы',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/'
          }
        ]
      },
      {
        text: 'Помощь',
        items: [
          {
            text: 'Чат Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Дискуссии GitHub',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'Сообщество разработчиков', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: 'Новости',
        items: [
          { text: 'Блог', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: 'События', link: 'https://events.vuejs.org/' },
          { text: 'Рассылки', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: 'О Vue',
    activeMatch: `^/about/`,
    items: [
      { text: 'ЧаВо', link: '/about/faq' },
      { text: 'Команда', link: '/about/team' },
      { text: 'Релизы', link: '/about/releases' },
      {
        text: 'Путеводитель по сообществу',
        link: '/about/community-guide'
      },
      { text: 'Кодекс поведения', link: '/about/coc' },
      { text: 'Политика конфиденциальности', link: '/about/privacy' },
      {
        text: 'Документальный фильм',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Спонсорство',
    link: '/sponsor/'
  },
  {
    text: 'Эксперты',
    badge: { text: 'НОВИНКА' },
    activeMatch: `^/(partners|developers)/`,
    items: [
      { text: 'Партнёры', link: '/partners/' },
      { text: 'Разработчики', link: '/developers/', badge: { text: 'НОВИНКА' } }
    ]
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: 'Первые шаги',
      items: [
        { text: 'Введение', link: '/guide/introduction' },
        {
          text: 'Быстрый старт',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Основы',
      items: [
        {
          text: 'Создание приложения',
          link: '/guide/essentials/application'
        },
        {
          text: 'Синтаксис шаблонов',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Основы реактивности',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Вычисляемые свойства',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Привязка классов и стилей',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Условная отрисовка',
          link: '/guide/essentials/conditional'
        },
        { text: 'Отрисовка списков', link: '/guide/essentials/list' },
        {
          text: 'Обработка событий',
          link: '/guide/essentials/event-handling'
        },
        { text: 'Привязка элементов форм', link: '/guide/essentials/forms' },
        {
          text: 'Хуки жизненного цикла',
          link: '/guide/essentials/lifecycle'
        },
        { text: 'Наблюдатели', link: '/guide/essentials/watchers' },
        { text: 'Ссылки на элементы шаблона', link: '/guide/essentials/template-refs' },
        {
          text: 'Основы компонентов',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: 'Компоненты в деталях',
      items: [
        {
          text: 'Регистрация',
          link: '/guide/components/registration'
        },
        { text: 'Пропсы', link: '/guide/components/props' },
        { text: 'События', link: '/guide/components/events' },
        { text: 'Директива v-model', link: '/guide/components/v-model' },
        {
          text: 'Передаваемые атрибуты',
          link: '/guide/components/attrs'
        },
        { text: 'Слоты', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Асинхронные компоненты',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Многоразовое использование',
      items: [
        {
          text: 'Композитные функции',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Пользовательские директивы',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Плагины', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Встроенные компоненты',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: 'Масштабирование',
      items: [
        { text: 'Однофайловые компоненты', link: '/guide/scaling-up/sfc' },
        { text: 'Инструменты', link: '/guide/scaling-up/tooling' },
        { text: 'Маршрутизация', link: '/guide/scaling-up/routing' },
        {
          text: 'Управление состоянием',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Тестирование', link: '/guide/scaling-up/testing' },
        {
          text: 'Рендеринг на стороне сервера (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Лучшие практики',
      items: [
        {
          text: 'Развёртывание',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Производительность',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Доступность',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Безопасность',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Обзор', link: '/guide/typescript/overview' },
        {
          text: 'TS с Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS с Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Дополнительные темы',
      items: [
        {
          text: 'Способы использования Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'ЧаВо по Composition API ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Реактивность в деталях',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Механизм отрисовки',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Функции рендеринга и JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue и веб-компоненты',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Техники анимации',
          link: '/guide/extras/animation'
        }
        // {
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'Global API',
      items: [
        { text: 'Приложение', link: '/api/application' },
        {
          text: 'Общее',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Реактивность: Ядро',
          link: '/api/reactivity-core'
        },
        {
          text: 'Реактивность: Утилиты',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Реактивность: Дополнительно',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Хуки жизненного цикла',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Внедрение зависимостей',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: 'Хелперы',
          link: '/api/composition-api-helpers'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: Состояние', link: '/api/options-state' },
        { text: 'Options: Отрисовка', link: '/api/options-rendering' },
        {
          text: 'Options: Жизненный цикл',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Композиция',
          link: '/api/options-composition'
        },
        { text: 'Options: Разное', link: '/api/options-misc' },
        {
          text: 'Экземпляр компонента',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Встроенные',
      items: [
        { text: 'Директивы', link: '/api/built-in-directives' },
        { text: 'Компоненты', link: '/api/built-in-components' },
        {
          text: 'Специальные элементы',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Специальные атрибуты',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Однофайловый компонент',
      items: [
        { text: 'Спецификация синтаксиса', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'Особенности CSS', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Дополнительные API',
      items: [
        { text: 'Пользовательские элементы', link: '/api/custom-elements' },
        { text: 'Функция render', link: '/api/render-function' },
        { text: 'Рендеринг на стороне сервера', link: '/api/ssr' },
        { text: 'Типы утилит TypeScript', link: '/api/utility-types' },
        { text: 'Пользовательский рендерер', link: '/api/custom-renderer' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Основы',
      items: [
        {
          text: 'Привет, мир',
          link: '/examples/#hello-world'
        },
        {
          text: 'Обработка ввода',
          link: '/examples/#handling-input'
        },
        {
          text: 'Привязка атрибутов',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Условия и циклы',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Привязка форм',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Простой компонент',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Практика',
      items: [
        {
          text: 'Редактор Markdown',
          link: '/examples/#markdown'
        },
        {
          text: 'Получение данных',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Сетка с сортировкой и фильтром',
          link: '/examples/#grid'
        },
        {
          text: 'Компонент дерева',
          link: '/examples/#tree'
        },
        {
          text: 'График SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Модальное окно с переходами',
          link: '/examples/#modal'
        },
        {
          text: 'Список с переходами',
          link: '/examples/#list-transition'
        },
        {
          text: 'Список дел',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: 'Интерфейс (7 задач)',
      items: [
        {
          text: 'Счётчик',
          link: '/examples/#counter'
        },
        {
          text: 'Конвертер температуры',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Покупка авиабилетов',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Таймер',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Рисуем круги',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Ячейки',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Руководство по стилю',
      items: [
        {
          text: 'Обзор',
          link: '/style-guide/'
        },
        {
          text: 'A - Основы',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Настоятельно рекомендуется',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Рекомендуется',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Использовать с осторожностью',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
const i18n: ThemeConfig['i18n'] = {
  search: 'Поиск',
  menu: 'Меню',
  toc: 'Оглавление',
  returnToTop: 'Вернуться к началу',
  appearance: 'Оформление',
  previous: 'Предыдущая',
  next: 'Следующая',
  pageNotFound: 'Страница не найдена',
  deadLink: {
    before: 'Вы нашли мёртвую ссылку: ',
    after: ''
  },
  deadLinkReport: {
    before: 'Пожалуйста, ',
    link: 'сообщите нам',
    after: ', чтобы решить эту проблему.'
  },
  footerLicense: {
    before: '',
    after: ''
  },
  ariaAnnouncer: {
    before: '',
    after: ''
  },
  ariaDarkMode: 'Тёмный режим',
  ariaSkipToContent: 'Перейти к содержанию',
  ariaMainNav: 'Основная навигация',
  ariaMobileNav: 'Мобильная навигация',
  ariaSidebarNav: 'Боковая панель навигации'
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vuejs.dragomano.ru/',
  },

  lang: 'ru-RU',
  title: 'Vue.js',
  description: 'Vue.js - Прогрессивный JavaScript-фреймворк',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['link', { rel: 'preconnect', href: 'https://WB13I1BINF-dsn.algolia.net', crossorigin: "true" }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'meta',
      {
        name: 'twitter:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {},
      `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "la33dit45x")`,
    ],
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Официальная локализация',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: '/translations/',
        text: 'Помочь с переводом!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs-dragomano',
      appId: 'WB13I1BINF',
      apiKey: 'ac607366f4cd99782106a7403827b86b',
      placeholder: 'Поиск в документации',
      translations: {
        button: {
          buttonText: 'Поиск',
          buttonAriaLabel: 'Поиск'
        },
        modal: {
          searchBox: {
            resetButtonTitle: 'Сбросить поиск',
            resetButtonAriaLabel: 'Сбросить поиск',
            cancelButtonText: 'Отменить поиск',
            cancelButtonAriaLabel: 'Отменить поиск'
          },
          startScreen: {
            recentSearchesTitle: 'История поиска',
            noRecentSearchesText: 'Нет истории поиска',
            saveRecentSearchButtonTitle: 'Сохранить в истории поиска',
            removeRecentSearchButtonTitle: 'Удалить из истории поиска',
            favoriteSearchesTitle: 'Избранное',
            removeFavoriteSearchButtonTitle: 'Удалить из избранного'
          },
          errorScreen: {
            titleText: 'Невозможно получить результаты',
            helpText: 'Вам может потребоваться проверить подключение к Интернету'
          },
          footer: {
            selectText: 'выбрать',
            navigateText: 'перейти',
            closeText: 'закрыть',
            searchByText: ''
          },
          noResultsScreen: {
            noResultsText: 'Нет результатов для',
            suggestedQueryText: 'Вы можете попытаться узнать',
            reportMissingResultsText: 'Считаете, что поиск даёт ложные результаты？',
            reportMissingResultsLinkText: 'Нажмите на кнопку «Обратная связь»'
          }
        }
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'dragomano/vuejs-russian',
      text: 'Редактировать эту страницу на GitHub'
    },

    footer: {
      license: {
        text: 'Лицензия MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `© 2014-${new Date().getFullYear()} Эван Ю`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      // @ts-expect-error - broken type output in vitepress
      md.use(headerPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
})
