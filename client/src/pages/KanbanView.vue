<template>
  <div v-if="loading" class="loading-container">
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="100px" color="dark" />
    </q-inner-loading>
  </div>
  <KanbanIssues v-else :issues="issuesForProject" />
</template>

<script>
  import { ref, onMounted } from 'vue'
  import RedmineService from '@/services/RedmineService.js'
  import { useStore } from "vuex"
  import KanbanIssues from '@/components/KanbanIssues'

  export default {
    name: "KanbanView",
    components: {
      KanbanIssues
    },
    setup() {
      const store = useStore()
      let issuesForProject = []
      
      const loading = ref(false)
    
      async function _getIssuesWithOffset(offset=0) {
        const response = (await RedmineService.getIssuesForProject(store.state.user.api_key, store.state.query.id, store.state.project.id, offset))
        return {
          issues: response?.data?.issues || [],
          total_count: response?.data?.total_count || 0
        }
      }

      async function getIssuesForProject() {
        const PAGE_SIZE = 100
        const { issues, total_count } = await _getIssuesWithOffset()
        issuesForProject.value = [...issues]
        if(total_count > PAGE_SIZE) {
          const iterations = Math.ceil(total_count / PAGE_SIZE)
          for(let i = 1; i < iterations; i++) {
            const { issues: currentIssues } = await _getIssuesWithOffset(i * PAGE_SIZE)
            issuesForProject.value = [...issuesForProject.value, ...currentIssues]
          }
        }
        loading.value = false
      }

      onMounted(() => {
        loading.value = true
        getIssuesForProject()
      })

      return {
        loading,
        issuesForProject
      }
    }
  }
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
