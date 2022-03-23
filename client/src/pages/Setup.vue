<template>
  <q-layout view="hHh lpR fFf" style="background: #FBFBFB">
    <q-drawer
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
      <aside class="image-container">
        <img class="company-logo" src="@/assets/logo.svg" alt="company-logo">
      </aside>
      <q-select
      outlined
      v-model="selectedLang"
      :options="langOptions"
      class="lang-select"
      label="Language" />
    </q-drawer>
    <q-page-container>
      <header>
        <h1 class="title">{{ $t("setupTitle") }}</h1>
        <p class="sub-title">{{ $t("setupHelper") }}</p>
      </header>
      
      <section id="setup-container" class="setup-container">
        <article>
          <ProjectPick />
        </article>
        <article>
          <QueriesPick />
        </article>
      </section>
      <q-btn class="action" @click="proceedToKanbanBoard">{{ $t("proceed") }}</q-btn>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, watch } from 'vue'
import ProjectPick from '@/components/ProjectPick'
import QueriesPick from '@/components/QueriesPick'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
  name: "Setup",
  components: {
    ProjectPick,
    QueriesPick
  },
  setup() {
    const projectSelected = ref(false)
    const leftDrawerOpen = ref(true)
    const miniState = ref(false)
    const { t, locale } = useI18n({ useScope: 'global' })
    const selectedLang = ref(localStorage.getItem('locale'))
    const langOptions = ref(['en', 'hu'])
    const router = useRouter()

    watch(selectedLang, () => {
      locale.value = selectedLang.value
      localStorage.setItem('locale', locale.value)
    })

    function proceedToKanbanBoard() {
      router.push('/kanban')
    }

    return {
      projectSelected,
      leftDrawerOpen,
      miniState,
      t,
      locale,
      selectedLang,
      langOptions,
      proceedToKanbanBoard
    }
  }
}
</script>

<style>
article {
    margin: 12px;
}

header {
  padding-block-start: 8rem;
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 24px;
}

.company-logo {
  padding: 24px;
}

.sub-title {
  padding-block-start: 24px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.38);
}

.action {
  background: #295365;
  color: #ffffff;
}

.lang-select {
  padding: 24px;
}

.q-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
