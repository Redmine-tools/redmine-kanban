<template>
  <td @click="open()">{{ issue?.tracker.name }} #{{ issue?.id }} {{ issue?.subject }}</td>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import RedmineService from '@/services/RedmineService';

export default {
  name: 'TaskCol',
  props: {
    issueId: {
      type: Number,
    }
  },
  components: {
  },
  setup(props) {
    const store = useStore();
    const issue = store.state.issues.filter(i => i.id === props.issueId)[0];

    async function open() {
      const response = await RedmineService.getRedmineUrl()
      window.open(`${response.data}issues/${props.issueId}`, '_blank');
    }

    return {
      issue,
      open
    };
  },
};
</script>

<style scoped>
td {
  padding-inline-end: 16px;
}

td:hover {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
}
</style>
