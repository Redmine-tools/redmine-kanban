<template>
  <section>
    <article v-if="assignee.length < 1">
      <h4>
        Please select a user.
      </h4>
    </article>
    <section v-else class="tasks-page">
    <h3>Tasks for {{ assignee }}</h3>

    <Tables />
  </section>
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
