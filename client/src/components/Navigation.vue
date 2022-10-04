<template>
  <aside v-if="!props.miniState" class="navigation">
    <router-link to="/kanban" :class="{active: activeRoute.includes('kanban')}" >Kanban board</router-link>
    <router-link to="/tasks" :class="{active: activeRoute.includes('tasks')}" >Tasks</router-link>
  </aside>
  <aside v-else class="mini-container">
    <q-icon name="leaderboard" />
    <q-icon name="toys" />
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  name: 'Navigation',
  components: {

  },
  props: {
    miniState: Boolean,
  },
  setup(props) {
    const router = useRouter();
    const activeRoute = computed(() => router.currentRoute._value.path);

    return {
      activeRoute,
      props,
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

.mini-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.mini-container> i {
  font-size: 24px;
  padding-block-start: 12px;
}
</style>
