<template>
  <section class="tasks-page">
    <h3>Tasks for {{ assignee }}</h3>

    <Tables />
  </section>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Tables from '@/components/Tables.vue';
export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const assignee = computed(() => store.state.assignee);
    return {
      assignee,
    };
  },
};
</script>

<style scoped>
</style>
