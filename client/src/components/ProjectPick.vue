<template>
  <p class="section-title">
    {{ $t("pSelect") }}
  </p>
  <q-select
    v-model="selectedProject"
    outlined
    :options="projectsOrdered"
    :option-value="'value'"
    :option-label="'name'"
    :label="$t('project')"
    input-debounce="10"
    use-input
    hide-selected
    fill-input
    @filter="filterFn"
    @update:model-value="updateProject"
  />
</template>

<script>
import { ref, onMounted } from 'vue';
import RedmineService from '@/services/RedmineService';
import { useStore } from 'vuex';

export default {
  name: 'ProjectPick',
  components: {
  },
  emits: ['projectPicked'],
  setup() {
    const projectsOrdered = ref();
    let stringOptions;
    const selectedProject = ref();
    const store = useStore();
    let projects;

    async function getProjectsWithOffset(offset = 0) {
      const response = await RedmineService.getProjects(store.state.user.api_key, offset);
      return {
        projects: response?.data?.projects || [],
        totalCount: response?.data?.totalCount || 0,
      };
    }

    async function getProjects() {
      const PAGE_SIZE = 100;
      const { projects: firstProjects, totalCount } = await getProjectsWithOffset();
      projects = [...firstProjects];
      if (totalCount > PAGE_SIZE) {
        const iterations = Math.ceil(totalCount / PAGE_SIZE);
        for (let i = 1; i < iterations; i += 1) {
          const { projects: currentProjects } = await getProjectsWithOffset(i * PAGE_SIZE);
          projects = [...projects, ...currentProjects];
        }
      }
      projectsOrdered.value = projects.map(({ id, name }) => ({ value: id, name }));
      stringOptions = projectsOrdered.value;
    }

    function updateProject() {
      store.commit({
        type: 'addProject',
        payload: projects.filter((i) => i.id === selectedProject.value.value)[0],
      });
    }

    function filterFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        projectsOrdered.value = stringOptions.filter((v) => v.name.toLowerCase().indexOf(needle) > -1);
      });
    }

    onMounted(getProjects);

    return {
      projectsOrdered,
      selectedProject,
      updateProject,
      filterFn,
    };
  },
};
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
