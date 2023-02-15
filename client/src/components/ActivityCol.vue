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
      console.log(props.journal)
      switch(props.journal[0]) {
        case "status_id":
          const statuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses;
          activity.value.name = 'New status'
          activity.value.newValue = statuses.filter(i => i.id == props.journal[1])[0].name
          break;
        case "assigned_to_id":
          const assignedTo = (await RedmineService.getUserById(store.state.user.api_key, props.journal[1])).data.user;
          activity.value.name = "Newly assigned to"
          activity.value.newValue = `${assignedTo.firstname} ${assignedTo.lastname}`
          break;
        case "note":
          activity.value.name = 'New note'
          activity.value.newValue = props.journal[1]
          break;
        case "subject":
          activity.value.name = 'New title/subject'
          activity.value.newValue = props.journal[1]
          break;
        case "tracker_id":
          const trackers = (await RedmineService.getRedmineTrackers(store.state.user.api_key)).data.trackers;
          activity.value.name = 'New tracker'
          activity.value.newValue = trackers.filter(i => i.id == props.journal[1])[0].name
          break;
        case "fixed_version_id":
          const fixedVersion = (await RedmineService.getRedmineFixedVersion(store.state.user.api_key, props.journal[1])).data.version;
          activity.value.name = 'New version'
          activity.value.newValue = fixedVersion.name
          break;
        case "priority_id":
          const priorities = (await RedmineService.getRedminePriority(store.state.user.api_key)).data.issue_priorities;
          console.log(priorities)
          activity.value.name = 'New priority'
          activity.value.newValue = priorities.filter(i => i.id == props.journal[1])[0].name
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
