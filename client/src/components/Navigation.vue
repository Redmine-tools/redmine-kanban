<template>
  <MainNavigation v-if="!props.miniState"/>
  <MiniNavigation v-else />
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import MainNavigation from '@/components/MainNavigation';
import MiniNavigation from '@/components/MiniNavigation';

export default {
  name: 'Navigation',
  components: {
    MainNavigation,
    MiniNavigation,
  },
  props: {
    miniState: Boolean,
  },
  setup(props) {
    return {
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
