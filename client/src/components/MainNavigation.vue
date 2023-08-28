<template>
  <aside class="navigation">
    <router-link v-if="store.state?.issues.length > 0" to="/kanban"><q-icon name="view_kanban" size="24px" />{{ $t("kanbanBoard") }}</router-link>
    <router-link v-if="store.state?.issues.length > 0"  to="/tasks"><q-icon name="backup_table" size="24px" />{{ $t("tasks") }}</router-link>
    <router-link to="/setup"><q-icon name="tune" size="24px" />{{ $t("setup") }}</router-link>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'MainNavigation',
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
.navigation {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-inline-start: 24px;
}

.navigation > a > i {
  padding-right: 4px;
  padding-bottom: 5px;
}

.navigation > a {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: black;
  text-decoration: unset;
  padding-top: 30px;
}

.navigation > a:hover {
  text-decoration: underline;
}
</style>
