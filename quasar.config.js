import { defineConfig } from '#q-app/wrappers'

export default defineConfig(() => {
  return {
    // Boot files run before the app starts (src/boot/*.js)
    boot: [
      'reveal',
      'i18n',
      'axios',
    ],

    css: ['app.scss'],

    // Icon font used by Quasar components (menu, close, arrows...)
    extras: [
      'mdi-v5',
      'fontawesome-v5',
      'eva-icons',
      'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons'
    ],

    build: {
      // 'history' gives clean URLs. Your host needs an SPA fallback to index.html
      // (a Netlify _redirects file is already included in /public).
      // Switch to 'hash' if your host cannot do that.
      vueRouterMode: 'history',
      extendWebpack (cfg) {
        cfg.module.rules.push({ test: /\.m?js$/, resolve: { fullySpecified: false } })
      }
    },

    devServer: {
      open: false
    },

    framework: {
      config: {},
      // Quasar plugins used by the project
      plugins: ['Notify', 'Dialog', 'LoadingBar']
    },

    animations: 'all'
  }
})
