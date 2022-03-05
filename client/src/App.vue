<template>
  <HeaderComponent/>
  <div  class="app-container">
    <router-view/>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent'
import { computed } from 'vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n';

export default {
  name: 'App',
  components: {
    HeaderComponent
  },
  setup() {
    const store = useStore()
    const user = computed(() => store.state.user)
    const { t, locale } = useI18n({ useScope: 'global' });
    const localeFromStorage = localStorage.getItem('locale');
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: F8F9FF;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
