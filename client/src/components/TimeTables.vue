<template>
  <section class="tasks-page">
    <p>{{ assignee }}</p>
  </section>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed,
} from 'vue';
import RedmineService from '@/services/RedmineService';

export default {
  name: 'TimeTables',
  components: {

  },
  setup() {
    const store = useStore();
    const assignee = computed(() => {
      return store.state.assignee;
    });

    RedmineService.getTimeEntriesByUser(store.state.user.api_key, store.state.project.id, store.state.user.id).then(res => console.log(res))

    return {
      assignee
    };
  },
};
</script>

<style scoped>

</style>
