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
          break;
        case "status_id":
          const statuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses;
          activity.value.name = props.journal.name
          activity.value.newValue = statuses.filter(i => i.id == props.journal?.new_value)[0].name
          activity.value.oldValue = statuses.filter(i => i.id == props.journal?.old_value)[0].name
          break;
        case "tracker_id":
          const trackers = (await RedmineService.getRedmineTrackers(store.state.user.api_key)).data.trackers;
          activity.value.name = props.journal.name
          activity.value.newValue = trackers.filter(i => i.id == props.journal?.new_value)[0].name
          activity.value.oldValue = trackers.filter(i => i.id == props.journal?.old_value)[0].name
          break;
        case "fixed_version_id":
          const newFixedVersion = (await RedmineService.getRedmineFixedVersion(store.state.user.api_key, props.journal.new_value)).data.version;
          const oldFixedVersion = (await RedmineService.getRedmineFixedVersion(store.state.user.api_key, props.journal.old_value)).data.version;
          activity.value.name = props.journal.name
          activity.value.newValue = newFixedVersion.name
          activity.value.oldValue = oldFixedVersion.name
          break;
        case "priority_id":
          const priorities = (await RedmineService.getRedminePriority(store.state.user.api_key)).data.issue_priorities;
          activity.value.name = props.journal.name
          activity.value.newValue = priorities.filter(i => i.id == props.journal.new_value)[0].name
          activity.value.oldValue = priorities.filter(i => i.id == props.journal.old_value)[0].name
          break;
        case "project_id":
          const newProject = (await RedmineService.getProjectById(store.state.user.api_key, props.journal.new_value)).data.project;
          const oldProject = (await RedmineService.getProjectById(store.state.user.api_key, props.journal.old_value)).data.project;
          activity.value.name = props.journal.name
          activity.value.newValue = newProject.name
          activity.value.oldValue = oldProject.name
          break;
        case "category_id":
          const categories = (await RedmineService.getCategoriesByProjectId(store.state.user.api_key, store.state.project.id)).data.issue_categories;
          activity.value.name = 'New category'
          activity.value.newValue = categories.filter(i => i.id = props.journal[1])[0].name
          break;
        case "start_date":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
          break;
        case "due_date":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
          break;
        case "done_ratio":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value + '%'
          activity.value.oldValue = props.journal.old_value + '%'
          break;
        case "estimated_hours":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value + 'h'
          activity.value.oldValue = props.journal.old_value + 'h'
          break;
        case "relates":
        case "parent_id":
          const newIssue = store.state.issues.filter(i => i.id == props.journal.new_value)[0]
          const oldIssue = store.state.issues.filter(i => i.id == props.journal.old_value)[0]
          activity.value.name = props.journal.name
          activity.value.newValue = `${newIssue?.subject} (id: ${newIssue?.id})`
          activity.value.oldIssue = `${oldIssue?.subject} (id: ${oldIssue?.id})`
          break;
        case "description":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
          break;
        case "subject":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
          break;
        case "note":
          activity.value.name = props.journal.name
          if (props.journal.new_value.length > 70) {
            activity.value.newValue = props.journal.new_value.slice?.(0, 70) + '...';
          } else {
            activity.value.newValue = props.journal.new_value
          }
          if (props.journal.new_value.length > 70) {
            activity.value.oldValue = props.journal.old_value.slice?.(0, 70) + '...';
          } else {
            activity.value.oldValue = props.journal.old_value
          }
          break;
        default:
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
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
li {
  text-align: justify;
}
</style>
