<template>
  <article class="full-screen">
    <form @submit.prevent="addQuerie">
      <p class="section-title">{{ $t("qSelect") }}</p>
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
      <q-btn
        color="green-10"
        type="submit"
        style="margin-block-start:12px;">{{ $t("select") }}</q-btn>
    </form>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import Multiselect from '@vueform/multiselect'
import { useStore } from "vuex"
import { useRouter } from 'vue-router'

export default {
  name: "ProjectPick",
  components: {
    Multiselect
  },
  setup() {
    const router = useRouter()
    let projectsOrdered = ref()
    let selectedQuerie = ref()
    const store = useStore()
    let queiresOrdered = ref()
    let queries
  
    async function _getProjectQueriesWithOffset(offset=0) {
        const response = await RedmineService.getProjectQueries(store.state.user.api_key, offset)
        return {
          queries: response?.data?.queries || [],
          total_count: response?.data?.total_count || 0
        }
    }
    
    async function getProjectQueries() {
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
  
    function addQuerie() {
      store.commit({
        type: 'addQuerie',
        payload: queries.filter(i => i.id === selectedQuerie.value)[0]
      })
      router.push('/kanban')
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

.section-title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

</style>
