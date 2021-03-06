import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import i18n from './i18n'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'

const kanbanApp = createApp(App).use(Quasar, quasarUserOptions)
kanbanApp.use(router)
kanbanApp.use(store)
kanbanApp.use(i18n)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  kanbanApp.component(baseComponentName, baseComponentConfig)
})

kanbanApp.mount('#app')
