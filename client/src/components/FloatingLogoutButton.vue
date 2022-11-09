<template>
  <q-page-sticky
    v-if="store.state.user.firstname"
    position="top-right"
    :offset="[18, 18]"
  >
    <q-btn
      unelevated
      rounded
      color="light-blue-8"
      @click="logout"
    >
      {{ $t("logout") }}
    </q-btn>
  </q-page-sticky>
</template>

<script>
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import Navigation from '@/components/Navigation';

export default {
  name: 'FloatingLogoutButton',
  components: {
  },
  setup() {
    const store = useStore();
    const { t, locale } = useI18n({ useScope: 'global' });

    function logout() {
      store.commit({
        type: 'resetState',
      });
      router.push('/');
    }

    return {
      t,
      store,
      logout,
    };
  },
};
</script>

<style scoped>
</style>
