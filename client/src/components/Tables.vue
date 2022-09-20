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
<<<<<<< HEAD
=======

>>>>>>> init new table
export default {
  name: 'Tables',
  components: {
    TimeTables,
    ActivityTable,
  },
  setup() {
    const range = ref('day');
<<<<<<< HEAD
=======

>>>>>>> init new table
    return {
      range,
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
=======

>>>>>>> init new table
</style>
