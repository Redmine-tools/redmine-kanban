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
      {{ $t("selectUserWarning") }}
      <template v-slot:action>
        <q-btn flat color="white" label="Nice" @click="hideBanner"/>
        <q-btn flat color="white" label="Back to kanban board" @click="navigateBackToKanban"/>
      </template>
    </q-banner>
    <article v-if="assignees.length < 1">
      <h4>
        {{ $t("selectUser") }}
      </h4>
    </article>
    <section v-else >
    <Tables />
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
    const key = ref(0);
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
    const showTooltip = ref(false);
    const disableRefreshButton = ref(false);

    function updateAssigneeInStore(assignee) {
      store.commit({
        type: 'updateAssignee',
        payload: [assignee],
      });
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

    const forceReload = () => {
      showTooltip.value = true
      disableRefreshButton.value = true
      key.value+=1
      setTimeout(() => {
        showTooltip.value = false
        disableRefreshButton.value = false
      }, 5000)
    }

    return {
      selectedAssignees,
      assignees,
      hideBanner,
      showBanner,
      navigateBackToKanban,
      availableAssignees,
      key,
      forceReload,
      showTooltip,
      disableRefreshButton
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
