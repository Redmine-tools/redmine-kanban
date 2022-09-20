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
<<<<<<< HEAD
=======

>>>>>>> init new table
export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const assignee = computed(() => store.state.assignee);
<<<<<<< HEAD
=======

>>>>>>> init new table
    return {
      assignee,
    };
  },
};
</script>

<style scoped>
</style>
