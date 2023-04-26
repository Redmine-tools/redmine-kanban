<template>
  <section class="tasks-page-container">
    <header>
      <q-select
        v-model="selectedAssignees"
        filled
        :options="availableAssignees"
        :option-label="'name'"
        stack-label
        label="Assignee"
      />
    </header>
    <q-banner v-if="assignees.length > 1 && showBanner" class="text-white bg-red">
      <template v-slot:avatar>
        <q-icon name="announcement" color="white" />
      </template>
      Selecting more than one user from the kanban board filter will be clipped and only one user will be kept.
      <template v-slot:action>
        <q-btn flat color="white" label="Nice" @click="hideBanner"/>
        <q-btn flat color="white" label="Back to kanban board" @click="navigateBackToKanban"/>
      </template>
    </q-banner>
    <article v-if="assignees.length < 1">
      <h4>
        Please select a user.
      </h4>
    </article>
    <section v-else >
      <header>
        <h3 class="assignee-title">{{ selectedAssignees.name }}'s activity</h3>
        <q-btn round color="primary" icon="refresh" @click="getIssuesForProject" />
        <q-btn-toggle
          v-model="range"
          no-caps
          unelevated
          toggle-color="teal-10"
          :options="[
            {label: 'Day', value: 'day'},
            {label: 'Week', value: 'week'},
          ]"
        />
      </header>
    <Tables :range="range" />
  </section>
</section>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Tables from '@/components/Tables.vue';
import { useRouter } from 'vue-router';
import RedmineService from '@/services/RedmineService';

export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const selectedAssignees = ref(store.state.assignee[0]);
    const assignees = computed(() => store.state.assignee)
    const showBanner = ref(true);
    const range = ref('day');
    const router = useRouter();
    const availableAssignees = computed(() => {
      let resArr = [];
      const names = store.state.issues.filter((i) => i.assigned_to).map((i) => i.assigned_to)
      names.forEach(function(item){
        let i = resArr.findIndex(x => x.name == item.name);
        if(i <= -1){
          resArr.push({id: item.id, name: item.name});
        }
      })
      return resArr;
    });
    const issuesForProject = [];
    const loading = ref(false);

    function updateAssigneeInStore(assignee) {
      store.commit({
        type: 'updateAssignee',
        payload: [assignee],
      });
    }

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
      console.log("getting the good stuff")
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

    watch(selectedAssignees, () => {
      updateAssigneeInStore(selectedAssignees.value);
    });

    const hideBanner = () => {
      showBanner.value = false;
    }

    const navigateBackToKanban = () => {
      router.back();
    }

    return {
      selectedAssignees,
      assignees,
      range,
      hideBanner,
      showBanner,
      navigateBackToKanban,
      availableAssignees,
      getIssuesForProject
    };
  },
};
</script>

<style scoped>
.tasks-page-container {
  height: 100vh;
  overflow-y: scroll;
  padding-block-end: 24px;
}

header {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-inline: 48px;
  margin-block-start: 24px;
}

.assignee-title {
  font-weight: 700;
  font-size: 36px;
  line-height: 24px;
  letter-spacing: 0.15px;
}

.q-select {
  width: 280px;
}
</style>
