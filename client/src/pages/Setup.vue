<template>
  <q-layout view="hHh lpR fFf">

    <q-drawer
      v-model="leftDrawerOpen" side="left"
      overlay
      bordered
      show-if-above
      :mini="!leftDrawerOpen || miniState"
      @click.capture="drawerClick"
      :width="315"
      :breakpoint="500"
      class="bg-white-3">
      <p>beállítások</p>
    </q-drawer>
    <section id="setup-container">
      <article>
        <ProjectPick @projectPicked="loadQueriesPick"/>
      </article>
      <article v-if="projectSelected">
        <component :is="QueriesPick"/>
      </article>
    </section>

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
      leftDrawerOpen
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css">
article {
    margin: 12px;
}
</style>
