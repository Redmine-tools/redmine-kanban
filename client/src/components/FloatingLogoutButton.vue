<template>
  <q-btn
    unelevated
    rounded
    @click="logout"
  >
    {{ $t("logout") }}
  </q-btn>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Navigation from '@/components/Navigation';

export default {
  name: 'FloatingLogoutButton',
  components: {
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t, locale } = useI18n();

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
  button {
    margin-block-start: 24px;
    margin-inline-start: 24px;
    background: rgba(0, 0, 0, 0.1);
    color: #000;
  }
</style>
