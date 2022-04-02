<template>
  <q-layout view="hHh lpR fFf" style="background: #FBFBFB">
    <q-drawer
      v-if="store.state.user.api_key"
      v-model="leftDrawerOpen"
      side="left"
      bordered
      show-if-above
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
      :width="315"
      :breakpoint="500"
      class="bg-white-3">
      <div class="q-mini-drawer-hide absolute" style="top: 60px; right: -17px;">
        <q-btn
          dense
          round
          elevated
          color="grey-6"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
      <div v-if="miniState" class="q-mini-drawer-show absolute" style="top: 60px; right: -17px;">
        <q-btn
          dense
          round
          elevated
          color="grey-6"
          icon="chevron_right"
          @click="leftDrawerOpen = true; miniState = false"
        />
      </div>
      <aside v-if="!miniState" class="image-container">
        <img class="company-logo" src="@/assets/logo.svg" alt="company-logo">
      </aside>
      <aside v-else class="mini-image-container">
        <img class="company-logo" src="@/assets/logo-mini.svg" alt="company-logo">
      </aside>
      <aside class="settings">
        <div class="lang-select-container">
          <p class="settings-title"> <q-icon name="settings" /> {{ $t("langSelectTitle") }}</p>
          <div class="buttons">
            <q-btn :color="activeLang === 'hu' ? 'black': 'grey-6'" outline rounded @click="setLang('hu')">Magyar</q-btn>
            <q-btn :color="activeLang === 'en' ? 'black': 'grey-6'" outline rounded @click="setLang('en')">English</q-btn>
          </div>
        </div>
      </aside>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, ref } from 'vue'
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
    const leftDrawerOpen = ref(true)
    const miniState = ref(false)
    const activeLang = ref(locale.value)
    console.log(activeLang)

    if (localeFromStorage) {
      locale.value = localeFromStorage;
    } else if (navigator.language) {
      locale.value = navigator.language.substring(0, 2);
    }

    function setLang(selectedLang) {
      locale.value = selectedLang
      localStorage.setItem('locale', locale.value)
      activeLang.value = locale.value
    }

    return {
      user,
      t,
      locale,
      leftDrawerOpen,
      miniState,
      store,
      setLang,
      activeLang
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

.mini-image-container > .company-logo {
  height: 48px;
  width: 100%;
  padding: 6px;
}

.company-logo {
  padding: 24px;
}

.settings-title {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.42);
  margin-block-end: 24px;
}

.buttons {
  display: flex;
  margin-inline-start: 24px;
}

.buttons > button {
  margin-inline-end: 24px;
}
</style>
