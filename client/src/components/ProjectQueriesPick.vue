<template>
  <aside>
    <q-select :options="projectQueries" behavior="menu" label="Queries" />
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useStore } from "vuex"

export default {
  name: "ProjectQueriesPick",
  emits: ["ProjectQueries"],
  components: {
  },
  setup() {
    const projectQueries = computed(() => store.state.projectQueries.queries)
    const store = useStore()

    console.log(store.state.projectQueries.queries)

    return {
      projectQueries
    }
  }
}
</script>

<style scoped>
  .q-field {
    padding-inline: 24px;
  }
</style>
