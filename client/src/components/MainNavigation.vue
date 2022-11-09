<template>
  <aside class="navigation">
    <router-link to="/kanban">Kanban board</router-link>
    <router-link to="/tasks">Tasks</router-link>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  name: 'MainNavigation',
  components: {

  },
  setup() {
    return {
    };
  },
};
</script>

<style scoped>
.navigation {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-inline-start: 24px;
}

.navigation > a {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: black;
  text-decoration: unset;
}

.navigation > a:hover {
  text-decoration: underline;
}
</style>
