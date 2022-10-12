<template>
  <section>
    <article v-if="assignee.length < 1">
      <h4>
        Please select a user.
      </h4>
    </article>
    <section v-else class="tasks-page">
      <header>
        <h3>{{ assignee.name }}'s activity</h3>
        <q-btn-toggle
          v-model="range"
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

export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const assignee = computed(() => store.state.assignee[0]);
    const range = ref('day');
    return {
      assignee,
      range,
    };
  },
};
</script>

<style scoped>
.tasks-page > header {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-inline: 48px;
  margin-block-start: 96px;
}
</style>
