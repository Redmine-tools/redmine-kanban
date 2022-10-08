<template>
  <section class="tasks-page">
    <table class="demTable">
		<thead>
			<tr>
				<th>Project</th>
				<th>Task</th>
				<th>Note</th>
				<th>Hours</th>
			</tr>
		</thead>
		<tbody>
			<tr
        v-for="entry in timeEntriesForUser"
        :id="entry.id"
        :key="entry.id">
				<td>{{ entry.project.name }}</td>
				<td>{{ entry.issue.id }}</td>
				<td>{{ entry.comments }}</td>
				<td>{{ entry.hours }}</td>
			</tr>
		</tbody>
	</table>
  </section>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed,
  onMounted,
  ref,
} from 'vue';
import RedmineService from '@/services/RedmineService';

export default {
  name: 'TimeTables',
  components: {
  },
  setup(props) {
    const store = useStore();
    const timeEntriesForUser = ref([]);
    const range = computed(() => props.range);
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
    const lastWeek = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7);
    console.log(yesterday.toISOString());

    onMounted(async () => {
      // &from=${process.env.VUE_APP_YEAR}-01-01&to=${process.env.VUE_APP_YEAR}-12-31
      timeEntriesForUser.value = (await RedmineService.getTimeEntriesByUser(
        store.state.user.api_key,
        store.state.project.id,
        store.state.assignee[0].id)
      ).data.time_entries;
    });
    return {
      timeEntriesForUser,
    };
  },
};
</script>

<style scoped>
</style>
