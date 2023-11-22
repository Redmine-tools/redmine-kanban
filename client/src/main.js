import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import { Quasar, Notify } from "quasar";
import i18n from './i18n';
import App from './App.vue';
import quasarUserOptions from './quasar-user-options';

const kanbanApp = createApp(App);
kanbanApp.use(Quasar, {
  plugins: {
    Notify
  },
  config: {
    notify: {}
  }
})
kanbanApp.use(router);
kanbanApp.use(store);
kanbanApp.use(i18n);

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach((fileName) => {
  let baseComponentConfig = requireComponent(fileName);
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig;
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  );
  kanbanApp.component(baseComponentName, baseComponentConfig);
});

kanbanApp.mount('#app');
