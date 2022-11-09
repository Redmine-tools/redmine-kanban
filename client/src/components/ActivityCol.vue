<template>
  <li>{{ activity.name }}: {{ activity.newValue }}</li>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import RedmineService from '@/services/RedmineService';

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
    const store = useStore();
    const activity = ref({
      name: '',
      newValue: '',
    });

    const getJournalDetails = async() => {
      switch(props.journal[0]) {
        case "status_id":
          const statuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses;
          activity.value.name = 'New status'
          activity.value.newValue = statuses.filter(i => i.id == props.journal[1])[0].name
          break;
        case "assigned_to_id":
          const assignedTo = (await RedmineService.getUserById(store.state.user.api_key, props.journal[1])).data.user;
          console.log(assignedTo);
          activity.value.name = "Newly assigned to"
          activity.value.newValue = `${assignedTo.firstname} ${assignedTo.lastname}`
          break;
        case "note":
          activity.value.name = 'New note'
          activity.value.newValue = props.journal[1]
          break;
        default:
          activity.value.name = props.journal[0]
          activity.value.newValue = props.journal[1]
          break;
      }
    }

    onMounted(async () => {
      getJournalDetails();
    });

    return {
      activity
    };
  },
};
</script>

<style scoped>

</style>
