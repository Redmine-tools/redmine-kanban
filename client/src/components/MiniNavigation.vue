<template>
  <aside class="mini-navigation">
    <router-link v-if="store.state?.issues.length > 0"  to="/kanban">
      <q-icon name="leaderboard" size="24px">
        <q-tooltip anchor="center end" self="center left">
          {{ $t("kanbanBoard") }}
        </q-tooltip>
      </q-icon>
    </router-link>
    <router-link v-if="store.state?.issues.length > 0"  to="/tasks">
      <q-icon name="toys" size="24px">
        <q-tooltip anchor="center end" self="center left">
          {{ $t("tasks") }}
        </q-tooltip>
      </q-icon>
    </router-link>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MiniNavigation',
  components: {
  },
  setup() {
    const store = useStore();

    return {
      store
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
