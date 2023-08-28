<template>
  <div
    v-if="loading"
    class="loading-container"
  >
    <q-inner-loading :showing="loading">
      <q-spinner-gears
        size="100px"
        color="dark"
      />
    </q-inner-loading>
  </div>
  <KanbanIssues
    v-else
    :issues="issuesForProject"
  />
</template>

<script>
import { ref, onMounted } from 'vue';
import RedmineService from '@/services/RedmineService';
import { useStore } from 'vuex';
import KanbanIssues from '@/components/KanbanIssues.vue';

export default {
  name: 'KanbanView',
  components: {
    KanbanIssues,
  },
  setup() {
    const store = useStore();
    const issuesForProject = [];

    const loading = ref(false);

    async function getIssuesWithOffset(offset = 0) {
      const response = (await RedmineService.getIssuesForProject(
        store.state.user.api_key, store.state.query.id, store.state.project.id, offset,
      ));
      return {
        issues: response?.data?.issues || [],
        totalCount: response?.data?.total_count || 0,
      };
    }

    async function getIssuesForProject() {
      const PAGE_SIZE = 100;
      const { issues, totalCount } = await getIssuesWithOffset();
      issuesForProject.value = [...issues];
      if (totalCount > PAGE_SIZE) {
        const iterations = Math.ceil(totalCount / PAGE_SIZE);
        for (let i = 1; i < iterations; i += 1) {
          const { issues: currentIssues } = await getIssuesWithOffset(i * PAGE_SIZE);
          issuesForProject.value = [...issuesForProject.value, ...currentIssues];
        }
      }
      store.commit({
        type: 'addAllIssues',
        payload: issuesForProject.value,
      });
      loading.value = false;
    }

    onMounted(() => {
      loading.value = true;
      getIssuesForProject();
    });

    return {
      loading,
      issuesForProject,
    };
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
