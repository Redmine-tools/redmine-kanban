<template>
  <section id="setup-container">
    <article>
      <ProjectPick @projectPicked="loadQueriesPick"/>
    </article>
    <article v-if="projectSelected">
      <component :is="QueriesPick"/>
    </article>
  </section>
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

    function loadQueriesPick() {
      import('@/components/QueriesPick.vue').then(val => {
        projectSelected.value = true
        QueriesPick.value = val.default
      })
    }

    return {
      projectSelected,
      loadQueriesPick,
      QueriesPick
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css">
article {
    margin: 12px;
}
</style>
