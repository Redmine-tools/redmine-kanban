<template>
  <section class="tasks-page">
    <h3>Tasks</h3>
    <TimeTables></TimeTables>
  </section>
</template>

<script>
import TimeTables from '@/components/TimeTables.vue';

export default {
  name: 'Tasks',
  components: {
    TimeTables
  },
  setup() {


    return {
    };
  },
};
</script>

<style scoped>

</style>
