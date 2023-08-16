<template>
  <q-layout
    view="hHh lpR fFf"
    style="background: #FBFBFB"
  >
    <FloatingLogoutButton />
    <q-drawer
      v-if="store.state.user.api_key"
      v-model="leftDrawerOpen"
      side="left"
      bordered
      show-if-above
      :mini="!leftDrawerOpen || miniState"
      :width="315"
      :breakpoint="500"
      class="bg-white-3"
    >
      <div
        class="q-mini-drawer-hide absolute"
        style="top: 60px; right: -17px;"
      >
        <q-btn
          dense
          round
          elevated
          color="grey-6"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
      <div
        v-if="miniState"
        class="q-mini-drawer-show absolute"
        style="top: 60px; right: -17px;"
      >
        <q-btn
          dense
          round
          elevated
          color="grey-6"
          icon="chevron_right"
          @click="leftDrawerOpen = true; miniState = false"
        />
      </div>
      <aside
        v-if="!miniState"
        class="image-container"
      >
        <img
          class="company-logo"
          src="@/assets/logo.svg"
          alt="company-logo"
        >
      </aside>
      <aside
        v-else
        class="mini-image-container"
      >
        <img
          class="company-logo"
          src="@/assets/logo-mini.svg"
          alt="company-logo"
        >
      </aside>
      <Navigation :miniState="miniState" />
      <aside class="settings">
        <div
          v-if="!miniState"
          class="lang-select-container"
        >
          <p class="settings-title">
            <q-icon name="settings" /> {{ $t("langSelectTitle") }}
          </p>
          <div class="buttons">
            <q-btn
              :color="locale === 'hu' ? 'black': 'grey-6'"
              outline
              rounded
              @click="setLang('hu')"
            >
              Magyar
            </q-btn>
            <q-btn
              :color="locale === 'en' ? 'black': 'grey-6'"
              outline
              rounded
              @click="setLang('en')"
            >
              English
            </q-btn>
          </div>
          <p class="version">
            v {{ version }}
          </p>
        </div>
        <div
          v-else
          class="mini-lang-select-container"
        >
          <q-icon name="settings" />
        </div>
      </aside>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Navigation from '@/components/Navigation';
import FloatingLogoutButton from '@/components/FloatingLogoutButton';

export default {
  name: 'App',
  components: {
    Navigation,
    FloatingLogoutButton
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);
    const { t, locale } = useI18n({ useScope: 'global' });
    const localeFromStorage = localStorage.getItem('locale');
    const leftDrawerOpen = ref(true);
    const miniState = ref(false);
    const version = ref(process.env.VUE_APP_VERSION);

    if (localeFromStorage) {
      locale.value = localeFromStorage;
    }

    function setLang(selectedLang) {
      locale.value = selectedLang;
      localStorage.setItem('locale', locale.value);
    }

    return {
      user,
      t,
      locale,
      leftDrawerOpen,
      miniState,
      store,
      setLang,
      version,
    };
  },
};
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

.q-layout {
  overflow-x: hidden;
  overflow: hidden;
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

.version {
  display: flex;
  margin: 0;
  margin-block-start: 16px;
  margin-inline-start: 24px;
  color: rgba(0, 0, 0, 0.42);
}

.buttons {
  display: flex;
  margin-inline-start: 24px;
}

.buttons > button {
  margin-inline-end: 24px;
}

.lang-select-container {
  text-align: left;
}

.mini-lang-select-container {
  margin-inline-start: 17px;
}

.mini-lang-select-container> i {
  font-size: 24px
}

.lang-select-container > .settings-title {
  margin-inline-start: 24px;
}

.settings {
  position: absolute;
  bottom: 0;
  margin-block-end: 24px;
}
</style>
