<template>
    <q-btn-toggle
      v-model="range"
      toggle-color="primary"
      :options="[
        {label: 'Day', value: 'day'},
        {label: 'Week', value: 'week'},
      ]"
    />
  <TimeTables :range="range"></TimeTables>
  <ActivityTable :range="range"></ActivityTable>
</template>

<script>
import TimeTables from '@/components/TimeTables.vue';
import ActivityTable from '@/components/ActivityTable.vue';
import { ref } from 'vue';

export default {
  name: 'Tables',
  components: {
    TimeTables,
    ActivityTable,
  },
  setup() {
    const range = ref('day');
    return {
      range,
    };
  },
};
</script>

<style scoped>
</style>
