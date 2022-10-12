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
  watch,
} from 'vue';
import RedmineService from '@/services/RedmineService';

export default {
  name: 'TimeTables',
  props: {
    range: {
      type: String,
    },
  },
  components: {
  },
  setup(props) {
    const store = useStore();
    const timeEntriesForUser = ref([]);
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24).toISOString().slice(0, 10);
    const lastWeek = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10);
    const range = computed(() => props.range);
    const loading = ref(false);

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
}

caption {
  padding-block-start: 24px;
  padding-inline-start: 24px;
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  color: #333;
}

thead {
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.45);
}

tbody {
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.45);
}

tbody > tr {
  background: #EDF2F2;
  height: 38px;
  border-bottom-right-radius: 1px solid red;
}
</style>
