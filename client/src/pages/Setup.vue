<template>
  <section id="setup-container" class="setup-container">
    <article>
      <ProjectPick />
    </article>
    <article>
      <QueriesPick />
    </article>
  </section>
  <q-btn class="action" @click="proceedToKanbanBoard">{{ $t("proceed") }}</q-btn>
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

<style scoped>
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
