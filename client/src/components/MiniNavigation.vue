<template>
  <aside class="mini-navigation">
    <router-link to="/kanban">
      <q-icon name="leaderboard" size="24px">
        <q-tooltip anchor="center end" self="center left">
          Kanban board
        </q-tooltip>
      </q-icon>
    </router-link>
    <router-link to="/tasks">
      <q-icon name="toys" size="24px">
        <q-tooltip anchor="center end" self="center left">
          Tasks
        </q-tooltip>
      </q-icon>
    </router-link>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

export default {
  name: 'MiniNavigation',
  components: {
  },
  setup() {


    return {

    };
  },
};
</script>

<style scoped>
.mini-navigation {
  padding-block-start: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.mini-navigation> a {
  font-size: 24px;
  padding-block-start: 12px;
  color: black;
}

.mini-navigation> a:hover {
  color: #555;
}
</style>
