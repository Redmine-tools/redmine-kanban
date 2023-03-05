<template>
  <li v-if="activity.newValue && activity?.oldValue"><b>{{ $t(activity.name) }}</b> {{ $t("changed") }} {{ activity.oldValue }} {{ $t("to") }} {{ activity.newValue }}</li>
  <li v-else-if="activity.newValue && !activity?.oldValue"><b>{{ $t(activity.name) }}</b> {{ $t("newKeyword") }} {{ activity.newValue }}</li>
  <li v-else><b>{{ $t(activity.name) }}</b> {{ $t("deleted") }} (<s> {{ activity.oldValue }}</s>)</li>
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
      oldValue: '',
      newValue: '',
    });

    const getJournalDetails = async() => {
      switch(props.journal.name) {
        case "assigned_to_id":
          const oldAssignee = props.journal?.old_value && (await RedmineService.getUserById(store.state.user.api_key, props.journal.old_value)).data.user;
          const newAssignee = props.journal?.new_value && (await RedmineService.getUserById(store.state.user.api_key, props.journal.new_value)).data.user;
          activity.value.oldValue = oldAssignee && `${oldAssignee.firstname} ${oldAssignee.lastname}`
          activity.value.name = props.journal.name
          activity.value.newValue = newAssignee && `${newAssignee.firstname} ${newAssignee.lastname}`
          console.log(oldAssignee)
          console.log(newAssignee)
          break;
        case "status_id":
          const statuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses;
          activity.value.name = 'New status'
          activity.value.newValue = statuses.filter(i => i.id == props.journal[1])[0].name
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
          activity.value.name = 'New priority'
          activity.value.newValue = priorities.filter(i => i.id == props.journal[1])[0].name
          break;
        case "start_date":
          activity.value.name = 'New start date set to'
          activity.value.newValue = props.journal[1]
          break;
        case "due_date":
          activity.value.name = 'New due date set to'
          activity.value.newValue = props.journal[1]
          break;
        case "done_ratio":
          activity.value.name = 'Done ratio'
          activity.value.newValue = props.journal[1] + '%'
          break;
        case "project_id":
          const project = (await RedmineService.getProjectById(store.state.user.api_key, props.journal[1])).data.project;
          activity.value.name = 'New Project'
          activity.value.newValue = project.name
          break;
        case "category_id":
          const categories = (await RedmineService.getCategoriesByProjectId(store.state.user.api_key, store.state.project.id)).data.issue_categories;
          activity.value.name = 'New category'
          activity.value.newValue = categories.filter(i => i.id = props.journal[1])[0].name
          break;
        case "estimated_hours":
          activity.value.name = 'Estimated hours'
          activity.value.newValue = props.journal[1] + 'h'
          break;
        case "relates":
          const issue = store.state.issues.filter(i => i.id == props.journal[1])[0]
          activity.value.name = 'Relates to'
          activity.value.newValue = `${issue?.subject} (id: ${issue?.id})`
          break;
        case "parent_id":
          const parentIssue = store.state.issues.filter(i => i.id == props.journal[1])[0]
          activity.value.name = 'Parent'
          activity.value.newValue = `${parentIssue?.subject} (id: ${parentIssue?.id})`
          break;
        case "description":
          activity.value.name = 'Description'
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
