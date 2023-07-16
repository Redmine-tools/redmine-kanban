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
    const statuses = computed(() => store.state.issues.map(issue => issue.status))

    const getJournalDetails = async() => {
      switch(props.journal.name) {
        case "assigned_to_id":
          if (props.journal?.old_value && (store.state.user.id === props.journal?.old_value)) {
            activity.value.oldValue = `${props.state.user.firstname} ${props.state.user.lastname}`
          } else if (props.journal?.old_value && (store.state.assignee.id === props.journal?.old_value)) {
            activity.value.oldValue = props.state.assignee.name
          } else {
            const oldAssignee = props.journal?.old_value && (await RedmineService.getUserById(store.state.user.api_key, props.journal.old_value)).data.user;
            activity.value.oldValue = oldAssignee && `${oldAssignee.firstname} ${oldAssignee.lastname}`
          }
          if(props.journal?.new_value && (store.state.user.id === props.journal?.new_value)) {
            activity.value.newValue = `${props.state.user.firstname} ${props.state.user.lastname}`
          } else if (props.journal?.new_value && (store.state.assignee.id === props.journal?.new_value)) {
            activity.value.newValue = props.state.assignee.name
          } else {
            const newAssignee = props.journal?.new_value && (await RedmineService.getUserById(store.state.user.api_key, props.journal.new_value)).data.user;
            activity.value.newValue = newAssignee && `${newAssignee.firstname} ${newAssignee.lastname}`
          }
          activity.value.name = props.journal.name
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
          let newFixedVersion;
          let oldFixedVersion;
          if(props.journal.new_value) {
            newFixedVersion = (await RedmineService.getRedmineFixedVersion(store.state.user.api_key, props.journal.new_value)).data.version;
          }
          if(props.journal.old_value) {
            const oldFixedVersion = (await RedmineService.getRedmineFixedVersion(store.state.user.api_key, props.journal.old_value)).data.version;
          }
          activity.value.name = props.journal.name
          activity.value.newValue = newFixedVersion?.name
          activity.value.oldValue = oldFixedVersion?.name
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
          activity.value.name = props.journal.name
          if(props.journal.new_value) {
            activity.value.newValue = categories.filter(i => i.id == props.journal.new_value)[0].name
          }
          if(props.journal.old_value) {
            activity.value.oldValue = categories.filter(i => i.id == props.journal.old_value)[0].name
          } 
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
          if(activity.value.oldValue) {
            activity.value.oldValue = props.journal.old_value + '%'
          }
          break;
        case "estimated_hours":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value + ' h'
          activity.value.oldValue = props.journal.old_value || 0 + ' h'
          break;
        case "relates":
        case "parent_id":
          const newIssue = store.state.issues.filter(i => i.id == props.journal.new_value)[0]
          const oldIssue = store.state.issues.filter(i => i.id == props.journal.old_value)[0]
          activity.value.name = props.journal.name
          activity.value.newValue = newIssue?.id ? `${newIssue?.subject} (id: ${newIssue?.id})` : null
          activity.value.oldValue = oldIssue?.id ? `${oldIssue?.subject} (id: ${oldIssue?.id})` : null
          break;
        case "subject":
          activity.value.name = props.journal.name
          activity.value.newValue = props.journal.new_value
          activity.value.oldValue = props.journal.old_value
          break;
        case "description":
        case "note":
          activity.value.name = props.journal.name
          let cutOutLenght = 70
          if (props.journal.new_value && props.journal.old_value) {
            cutOutLenght = 25
          } 
          if (props.journal.new_value?.length > cutOutLenght) {
            activity.value.newValue = props.journal.new_value.slice?.(0, cutOutLenght) + '...';
          } else {
            activity.value.newValue = props.journal.new_value
          }
          if (props.journal.old_value?.length > cutOutLenght) {
            activity.value.oldValue = props.journal.old_value.slice?.(0, cutOutLenght) + '...';
          } else {
            activity.value.oldValue = props.journal.old_value
          }
          break;
        default:
          if(props.journal.property === 'attachment') {
            activity.value.name = 'file'
            activity.value.newValue = props.journal.new_value
          } else {
            activity.value.name = props.journal.name
            activity.value.newValue = props.journal.new_value
            activity.value.oldValue = props.journal.old_value
          }
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
