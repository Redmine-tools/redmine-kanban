<template>
  <article class="full-screen">
    <form @submit.prevent="addQuerie">
      <h1>Beállítások</h1>
      <p>Válassz lekérdezést!</p>
      <div>
        <Multiselect 
        required 
        v-model="selectedQuerie" 
        label="name" 
        trackBy="name" 
        :searchable="true"  
        :minChars="1" 
        :options="queiresOrdered"
        placeholder="Type to search"/>
      </div>
      <button class="primary">Kiválasztás</button>
    </form>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import Multiselect from '@vueform/multiselect'
import { useStore } from "vuex"

export default {
  name: "ProjectPick",
  components: {
    Multiselect
  },
  setup(_, { emit }) {
    let projectsOrdered = ref()
    let selectedQuerie = ref()
    const store = useStore()
    let queiresOrdered = ref()
  
    async function _getProjectQueriesWithOffset(offset=0) {
        const response = await RedmineService.getProjectQueries(store.state.user.api_key, offset)
        return {
          queries: response?.data?.queries || [],
          total_count: response?.data?.total_count || 0
        }
    }
    
    async function getProjectQueries() {
      const PAGE_SIZE = 100;
      const { queries: firstQueries, total_count } = await _getProjectQueriesWithOffset();
      let queries = [...firstQueries];
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
  
    function addQuerie() {
      store.commit({
        type: 'addQuerie',
        payload: selectedQuerie.value
      })
      emit('increaseStepCount', 3);
    }

    onMounted(getProjectQueries) 

    return {
      projectsOrdered,
      selectedQuerie,
      queiresOrdered,
      addQuerie
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css">

</style>