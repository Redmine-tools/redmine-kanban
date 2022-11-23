<template>
  <section class="table-container">
    <div class="header"></div>
    <TimeTables :range="range"></TimeTables>
    <ActivityTable :range="range"></ActivityTable>
  </section>
</template>

<script>
import TimeTables from '@/components/TimeTables.vue';
import ActivityTable from '@/components/ActivityTable.vue';
import { ref, computed } from 'vue';

export default {
  name: 'Tables',
  props: {
    range: {
      type: String,
    },
  },
  components: {
    TimeTables,
    ActivityTable,
  },
  setup(props) {
    const range = computed(() => props.range);

    return {
      range,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.table-container {
  background: #F7F7F7;
  border-radius: 12px;
  margin-block-start: 48px;
  margin-inline: 48px;
  filter: drop-shadow(0px 6px 15px rgba(0, 0, 0, 0.25));
  min-height: 192px;
}

.table-container > .header {
  height: 18px;
  border-radius: 12px 12px 0% 0%; 
  background: linear-gradient(90deg, rgba(41, 83, 101, 0.38) 0%, rgba(35, 140, 185, 0.29) 23.41%, rgba(253, 182, 0, 0.29) 65.06%, rgba(226, 177, 255, 0.62) 89.76%), #D9D9D9;
}
</style>
