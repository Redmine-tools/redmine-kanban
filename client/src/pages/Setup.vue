<template>
  <q-layout view="hHh lpR fFf">
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
      <div class="q-mini-drawer-hide absolute" style="top: 30px; right: -17px;">
        <q-btn
          dense
          round
          elevated
          color="grey-6"
          icon="chevron_left"
          @click="miniState = true"
        />
      </div>
      <div v-if="miniState" class="q-mini-drawer-show absolute" style="top: 30px; right: -17px;">
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
    </q-drawer>
    <q-page-container>
      <section id="setup-container">
        <article>
          <ProjectPick @projectPicked="loadQueriesPick"/>
        </article>
        <article v-if="projectSelected">
          <component :is="QueriesPick"/>
        </article>
      </section>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, shallowRef } from 'vue'
import ProjectPick from '@/components/ProjectPick'

export default {
  name: "Setup",
  components: {
    ProjectPick
  },
  setup() {
    const projectSelected = ref(false)
    let QueriesPick = shallowRef('')
    const leftDrawerOpen = ref(true)
    const miniState = ref(false)

    function loadQueriesPick() {
      import('@/components/QueriesPick.vue').then(val => {
        projectSelected.value = true
        QueriesPick.value = val.default
      })
    }

    return {
      projectSelected,
      loadQueriesPick,
      QueriesPick,
      leftDrawerOpen,
      miniState
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css">
article {
    margin: 12px;
}
</style>
