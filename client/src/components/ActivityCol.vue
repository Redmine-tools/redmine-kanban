<template>
  <li>{{ props.journal[0] }} - {{ props.journal[1] }}</li>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ActivityCol',
  props: {
    journal: {
      type: Object
    }
  },
  components: {
  },
  setup(props) {

    return {
      props
    };
  },
};
</script>

<style scoped>

</style>
