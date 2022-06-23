<template>
  <p class="section-title">{{ $t("qSelect") }}</p>
  <q-select
  outlined
  v-model="selectedQuerie"
  :options="queiresOrdered"
  :option-value="'id'"
  :option-label="'name'"
  :label="$t('query')"
  @filter="filterFn"
  @update:model-value="updateQuery"
  input-debounce="10"
  use-input
  hide-selected
  fill-input
  :disable="queiresOrdered.length === 0"/>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from "vuex"

export default {
  name: "ProjectPick",
  components: {
  },
  setup() {
    const projectsOrdered = ref()
    const selectedQuerie = ref()
    const store = useStore()
    const queiresOrdered = ref([])
    let queries
    let stringOptions
  
    async function _getProjectQueriesWithOffset(offset=0) {
        const response = await RedmineService.getProjectQueries(store.state.user.api_key, offset)
        return {
          queries: response?.data?.queries || [],
          total_count: response?.data?.total_count || 0
        }
    }
    
    async function getProjectQueries() {
      selectedQuerie.value = null
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
      stringOptions = queiresOrdered.value
    }

    function filterFn (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        queiresOrdered.value = stringOptions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
      })
    }

    function updateQuery() {
      store.commit({
        type: 'addQuerie',
        payload: queries.filter(i => i.id === selectedQuerie.value.value)[0]
      })
    }

    watch(()=> store.state.project, function() {
      getProjectQueries()
    });

    onMounted(() => {
    }) 

    return {
      projectsOrdered,
      selectedQuerie,
      queiresOrdered,
      filterFn,
      updateQuery,
      store
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

.q-field {
  width: 45%;
}
</style>
