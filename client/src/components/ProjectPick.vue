<template>
  <article class="full-screen">
    <form @submit.prevent>
      <p class="section-title">{{ $t("pSelect") }}</p>
      <q-select
        outlined
        v-model="selectedProject"
        :options="projectsOrdered"
        :option-value="'value'"
        :option-label="'name'"
        label="Project"
        @update:model-value="updateProject"/>
    </form>
  </article>
</template>

<script>
import { ref, onMounted } from 'vue'
import RedmineService from '@/services/RedmineService.js'
import { useStore } from "vuex"

export default {
  name: "ProjectPick",
  emits: ["projectPicked"],
  components: {
  },
  setup(_,{ emit }) {
    let projectsOrdered = ref()
    let selectedProject = ref()
    const store = useStore()
    let projects

    async function _getProjectsWithOffset(offset=0) {
        const response = await RedmineService.getProjects(store.state.user.api_key, offset)
        return {
          projects: response?.data?.projects || [],
          total_count: response?.data?.total_count || 0
        }
    }
    
    async function getProjects() {
      const PAGE_SIZE = 100
      const { projects: firstProjects, total_count } = await _getProjectsWithOffset()
      projects = [...firstProjects]
      if(total_count > PAGE_SIZE) {
        const iterations = Math.ceil(total_count / PAGE_SIZE)
        for(let i = 1; i < iterations; i++) {
          const { projects: currentProjects } = await _getProjectsWithOffset(i * PAGE_SIZE)
          projects = [...projects, ...currentProjects]
        }
      }
      projectsOrdered.value = projects.map(({ id, name }) => ({ value:id, name:name }))
    }

    function updateProject() {
      store.commit({
        type: 'addProject',
        payload: projects.filter(i => i.id === selectedProject.value.value)[0]
      })
      emit('projectPicked', true)
    }

    onMounted(getProjects) 

    return {
      projectsOrdered,
      selectedProject,
      updateProject
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
