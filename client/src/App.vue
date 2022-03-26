<template>
  <div  class="app-container">
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n';

export default {
  name: 'App',
  components: {
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.user)
    const { t, locale } = useI18n({ useScope: 'global' })
    const localeFromStorage = localStorage.getItem('locale')
    if (localeFromStorage) {
      locale.value = localeFromStorage;
    } else if (navigator.language) {
      locale.value = navigator.language.substring(0, 2);
    }

    return {
      user,
      t,
      locale 
    }
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #F8F9FF;
}

.app-container {
  width: 100%;
  height: 100%;
}
</style>
