<template>
  <section class="tasks-page-container">
    <header>
      <q-select
        v-model="selectedAssignees"
        filled
        :options="availableAssignees"
        :option-label="'name'"
        use-chips
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
        <q-btn-toggle
          v-model="range"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
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
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Tables from '@/components/Tables.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const selectedAssignees = computed(() => store.state.assignee[0]);
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

    console.log(availableAssignees)

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
      availableAssignees
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
</style>
