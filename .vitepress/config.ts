import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: 'Документация',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: 'Руководство', link: '/guide/introduction' },
      { text: 'Учебник', link: '/tutorial/' },
      { text: 'Примеры', link: '/examples/' },
      { text: 'Быстрый старт', link: '/guide/quick-start' },
      // { text: 'Style Guide', link: '/style-guide/' },
      { text: 'Глоссарий', link: '/glossary/' },
      {
        text: 'Документация Vue 2',
        link: 'https://ru.vuejs.org/'
      },
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
          { text: 'Темы', link: '/ecosystem/themes' },
          { text: 'Компоненты UI', link: 'https://ui-libs.vercel.app/' },
          {
            text: 'Сертификация',
            link: 'https://certification.vuejs.org/?ref=vuejs-nav'
          },
          { text: 'Работа', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'Магазин футболок', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: 'Официальные библиотеки',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/' },
          { text: 'Tooling Guide', link: '/guide/scaling-up/tooling.html' }
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
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
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
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Команда', link: '/about/team' },
      { text: 'Релизы', link: '/about/releases' },
      {
        text: 'Путеводитель по сообществу',
        link: '/about/community-guide'
      },
      { text: 'Кодекс поведения', link: '/about/coc' },
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
    text: 'Партнёры',
    link: '/partners/',
    activeMatch: `^/partners/`
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
          text: 'Условный рендеринг',
          link: '/guide/essentials/conditional'
        },
        { text: 'Рендеринг списков', link: '/guide/essentials/list' },
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
        { text: 'Реактивные ссылки', link: '/guide/essentials/template-refs' },
        {
          text: 'Основы компонентов',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: 'Components In-Depth',
      items: [
        {
          text: 'Registration',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: 'Events', link: '/guide/components/events' },
        { text: 'Component v-model', link: '/guide/components/v-model' },
        {
          text: 'Fallthrough Attributes',
          link: '/guide/components/attrs'
        },
        { text: 'Slots', link: '/guide/components/slots' },
        {
          text: 'Provide / inject',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Async Components',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Reusability',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Custom Directives',
          link: '/guide/reusability/custom-directives'
        },
        { text: 'Plugins', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: 'Built-in Components',
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
      text: 'Scaling Up',
      items: [
        { text: 'Single-File Components', link: '/guide/scaling-up/sfc' },
        { text: 'Tooling', link: '/guide/scaling-up/tooling' },
        { text: 'Routing', link: '/guide/scaling-up/routing' },
        {
          text: 'State Management',
          link: '/guide/scaling-up/state-management'
        },
        { text: 'Testing', link: '/guide/scaling-up/testing' },
        {
          text: 'Server-Side Rendering (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Best Practices',
      items: [
        {
          text: 'Production Deployment',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Performance',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Accessibility',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Security',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: 'Overview', link: '/guide/typescript/overview' },
        {
          text: 'TS with Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS with Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Extra Topics',
      items: [
        {
          text: 'Ways of Using Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'Composition API FAQ',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reactivity in Depth',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Rendering Mechanism',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Render Functions & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue and Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Animation Techniques',
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
        { text: 'Application', link: '/api/application' },
        {
          text: 'General',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: 'Reactivity: Core',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reactivity: Utilities',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reactivity: Advanced',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Lifecycle Hooks',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Dependency Injection',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        { text: 'Options: State', link: '/api/options-state' },
        { text: 'Options: Rendering', link: '/api/options-rendering' },
        {
          text: 'Options: Lifecycle',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Options: Composition',
          link: '/api/options-composition'
        },
        { text: 'Options: Misc', link: '/api/options-misc' },
        {
          text: 'Component Instance',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Built-ins',
      items: [
        { text: 'Directives', link: '/api/built-in-directives' },
        { text: 'Components', link: '/api/built-in-components' },
        {
          text: 'Special Elements',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Special Attributes',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Single-File Component',
      items: [
        { text: 'Syntax Specification', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS Features', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: 'Advanced APIs',
      items: [
        { text: 'Render Function', link: '/api/render-function' },
        { text: 'Server-Side Rendering', link: '/api/ssr' },
        { text: 'TypeScript Utility Types', link: '/api/utility-types' },
        { text: 'Custom Renderer', link: '/api/custom-renderer' }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Basic',
      items: [
        {
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: 'Handling User Input',
          link: '/examples/#handling-input'
        },
        {
          text: 'Attribute Bindings',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Conditionals and Loops',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Form Bindings',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Simple Component',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Practical',
      items: [
        {
          text: 'Markdown Editor',
          link: '/examples/#markdown'
        },
        {
          text: 'Fetching Data',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Grid with Sort and Filter',
          link: '/examples/#grid'
        },
        {
          text: 'Tree View',
          link: '/examples/#tree'
        },
        {
          text: 'SVG Graph',
          link: '/examples/#svg'
        },
        {
          text: 'Modal with Transitions',
          link: '/examples/#modal'
        },
        {
          text: 'List with Transitions',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Counter',
          link: '/examples/#counter'
        },
        {
          text: 'Temperature Converter',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Flight Booker',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Timer',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Circle Drawer',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Cells',
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

  lang: 'ru-RU',
  title: 'Vue.js',
  description: 'Vue.js - Прогрессивный JavaScript-фреймворк',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
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
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
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
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: '/translations/',
        text: 'Помочь с переводом!',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/HBherRA' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: 'Редактировать эту страницу на GitHub'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
        // .use(textAdPlugin)
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
