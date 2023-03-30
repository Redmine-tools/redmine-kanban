<template>
  <section >
    <div v-if="loading" class="loading-container">
      <q-inner-loading :showing="loading" />
    </div>
    <table v-else class="">
      <caption>Time reported</caption>
		<thead>
			<tr>
				<th>Project</th>
				<th>Task</th>
				<th>Hours ({{ timeEntriesForUser.reduce((sum, value) => {return sum + value.hours}, 0) }})</th>
        <th>Comment</th>
			</tr>
		</thead>
		<tbody>
			<tr
        v-for="entry in timeEntriesForUser"
        :id="entry.id"
        :key="entry.id">
				<td>{{ entry.project.name }}</td>
				<TaskCol :issueId="entry.issue.id " />
				<td>{{ entry.hours }}</td>
        <td>{{ entry?.comments }}</td>
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
  watch,
} from 'vue';
import RedmineService from '@/services/RedmineService';
import TaskCol from '@/components/TaskCol';

export default {
  name: 'TimeTables',
  props: {
    range: {
      type: String,
    },
  },
  components: {
    TaskCol
  },
  setup(props) {
    const store = useStore();
    const timeEntriesForUser = ref([]);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10);
    const lastWeek = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10);
    const range = computed(() => props.range);
    const loading = ref(false);
    const selectedAssignee = computed(() => store.state.assignee[0]);


    watch(selectedAssignee, () => {
      getTimeEntriesForUser(range.value === 'day' ? yesterday : lastWeek);
    })

    watch(range, () => {
      timeEntriesForUser.value = []
      getTimeEntriesForUser(range.value === 'day' ? yesterday : lastWeek);
    })

    const getTimeEntriesForUser = async (rangeToCheck) => {
      loading.value = true;
      timeEntriesForUser.value = (await RedmineService.getTimeEntriesByUser(
        store.state.user.api_key,
        store.state.project.id,
        store.state.assignee[0].id,
        today,
        range.value === 'day' ? yesterday : lastWeek)
      ).data.time_entries;
      loading.value = false;
      console.log(timeEntriesForUser)
    }


    onMounted(async () => {
      getTimeEntriesForUser(range.value === 'day' ? yesterday : lastWeek);
    });

    return {
      timeEntriesForUser,
      range,
      loading,
    };
  },
};
</script>

<style scoped>
table {
  padding: 24px;
  width: 100%;
  text-align: justify;
  vertical-align: baseline;
  border-collapse: collapse;
  table-layout: fixed;
}

caption {
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  color: #333;
  padding-inline-start: 24px;
}

thead {
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.45);
  padding-inline-start: 24px;
}

tbody {
  font-style: normal;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.45);
}

tbody > tr {
  background: #EBEDED;
  height: 38px;
  border-bottom: 1px solid #C3D1D1;
}

tbody > tr:hover {
  background: #EDF2F2;
}

tr > *:nth-child(1) { width:20%; }
tr > *:nth-child(2) { width:30%; }
tr > *:nth-child(3) { width:25%; }
tr > *:nth-child(4) { width:25%; }

tr > td {
  padding-block-start: 6px;
  vertical-align: baseline;
}

tr > th:first-of-type {
  padding-inline-start: 24px;
  padding-inline-end: 24px;
}

tr > td:first-of-type {
  padding-inline-start: 24px;
  padding-inline-end: 24px;
}

tr > td:nth-child(3), th:nth-child(3) {
  padding-inline-start: 24px;
}

section {
  padding-block-start: 24px;
}
</style>
