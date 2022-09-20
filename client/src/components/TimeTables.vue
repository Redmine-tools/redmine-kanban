

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
  setup() {
    const store = useStore();
    const timeEntriesForUser = ref([]);

    onMounted(async () => {
      timeEntriesForUser.value = (await RedmineService.getTimeEntriesByUser(store.state.user.api_key, store.state.project.id, store.state.user.id)).data.time_entries;
    });
    return {
      timeEntriesForUser,
    };
  },
};
</script>

<style scoped>
</style>
