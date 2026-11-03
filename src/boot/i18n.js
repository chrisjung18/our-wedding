import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n/index.js'

const i18n = createI18n({
  legacy: false, // use the Composition API
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages
})

export default defineBoot(({ app }) => {
  app.use(i18n)
})

export { i18n }