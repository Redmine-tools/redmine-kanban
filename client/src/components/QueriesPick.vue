<template>
  <article class="full-screen">
    <form @submit.prevent>
      <p class="section-title">{{ $t("qSelect") }}</p>
      <q-select
      outlined
      v-model="selectedQuerie"
      :options="queiresOrdered"
      :option-value="'id'"
      :option-label="'name'"
      label="Query"
      disable/>
    </form>
  </article>
</template>

<script>
import { ref, watch } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from "vuex"
import { useRouter } from 'vue-router'

export default {
  name: "ProjectPick",
  components: {
  },
  setup() {
    const router = useRouter()
    const projectsOrdered = ref()
    const selectedQuerie = ref()
    const store = useStore()
    const queiresOrdered = ref([])
    let queries
  
    async function _getProjectQueriesWithOffset(offset=0) {
        const response = await RedmineService.getProjectQueries(store.state.user.api_key, offset)
        return {
          queries: response?.data?.queries || [],
          total_count: response?.data?.total_count || 0
        }
    }
    
    async function getProjectQueries() {
      console.log('running shit')
      const PAGE_SIZE = 100;
      const { queries: firstQueries, total_count } = await _getProjectQueriesWithOffset()
      queries = [...firstQueries]
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { queries: currentQueries } = await _getProjectQueriesWithOffset(i * PAGE_SIZE)
          queries = [...queries, ...currentQueries]
        }
      }
      const filteredQueries = queries.filter(i => i?.project_id === store.state.project.id)
      queiresOrdered.value = filteredQueries.map(({ id, name }) => ({ value:id, name:name }))
    }
  
    function updateQuery() {
      store.commit({
        type: 'addQuerie',
        payload: queries.filter(i => i.id === selectedQuerie.value)[0]
      })
      router.push('/kanban')
    }

    watch(()=> store.state.project, function() {
      getProjectQueries()
    });

    return {
      projectsOrdered,
      selectedQuerie,
      queiresOrdered,
      updateQuery
    }
  }
}
</script>

<style scoped>

.section-title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

</style>
