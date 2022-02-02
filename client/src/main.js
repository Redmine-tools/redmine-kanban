import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'

const kanbanApp = createApp(App)
kanbanApp.use(router)
kanbanApp.use(store)

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
