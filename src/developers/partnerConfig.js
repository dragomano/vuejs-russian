import partnerData from '../partners/partners.json'

const partnerName = 'Proxify'
const partner = partnerData.find((partner) => partner.name === partnerName)

const websiteLabel = 'proxify.io'
const websiteUrl = 'https://proxify.io/'
const applyUrl = 'https://career.proxify.io/apply'
const hireUrl = 'https://proxify.io/hire-vuejs'
const vueArticleUrl = 'https://proxify.io/hire-vue-developers'
const imageStorageUrl =
  'https://res.cloudinary.com/proxify-io/image/upload'

const partnerConfig = {
  // Partner information
  partnerName: partner?.name,
  logo: partner?.logo,
  flipLogo: partner?.flipLogo || false,

  // Partner website
  websiteUrl: websiteUrl,
  hireUsButtonUrl: hireUrl,

  // Image storage URL
  imageStorageUrl: imageStorageUrl,

  // Hero Section
  pageHeroBanner: {
    title: 'Найдите лучших разработчиков Vue.js для вашей команды',
    description1: 'Получите доступ к сертифицированным разработчикам Vue.js для вашего следующего проекта.',
    description2: 'Proxify берет на себя процесс отбора, чтобы гарантировать высокое качество и надежность.',
    hireButton: {
      url: hireUrl,
      label: 'Найти разработчиков Vue.js'
    },
    footer: "Найдите лучшего разработчика Vue.js менее чем за 48 часов",
  },

  // Hero Section
  pageJoinSection: {
    title: 'Станьте зарегистрированным разработчиком',
    description:
      'Получите долгосрочную позицию с частичной или полной занятостью в компании, которая ищет разработчика Vue.js.',
    applyButton: {
      url: applyUrl,
      label: 'Подать заявку на участие'
    }
  },

  // Footer Configuration
  pageFooter: {
    text: `Этот проверенный разработчик предоставлен вам партнёром Vue:`,
    email: 'vue@proxify.io',
    phone: '+44 20 4614 2667',
    websiteVueLink: vueArticleUrl,
    websiteVueLabel: websiteLabel + '/hire-vue-developers'
  },

  // Diagram sections
  profileDiagram: {
    title: 'Профиль кандидата',
    prependText:
      'Как наши разработчики оценивают параметры, которые лучше всего соотносятся с будущим успехом в роли.'
  },

  scoreDiagram: {
    title: 'Оценка инженерного мастерства',
    prependText:
      'Диапазон практических баллов - от 0 до 300. Это распределение баллов для всех оцененных разработчиков Vue.js, и вот какие баллы получил ваш кандидат.',
    appendText:
      'Данные 3 661 оцененного разработчика Vue.js и 38 008 соискателей.'
  },

  // Proficiency Section
  proficiencies: {
    skillsPerCard: 5
  }
}

export default partnerConfig
