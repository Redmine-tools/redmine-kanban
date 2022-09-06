<template>
  <section class="tasks-page">
    <h2>tasks</h2>
    <TimeTable></TimeTable>
  </section>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed,
} from 'vue';
import TimeTable from '@/components/TimeTable.vue';

export default {
  name: 'Tasks',
  components: {
    TimeTable
  },
  setup() {
    const store = useStore();
    const assignee = computed(() => {
      return store.state.assignee;
    });

    console.log(assignee.value)

    return {
      assignee
    };
  },
};
</script>

<style scoped>

</style>
