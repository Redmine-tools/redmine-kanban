<template>
  <section >
    <div v-if="loading" class="loading-container">
      <q-inner-loading :showing="loading" />
    </div>
    <table v-else class="">
    <caption>Activities</caption>
    <thead>
			<tr>
				<th>Project</th>
				<th>Task</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<tr
        v-for="entry in result"
        :id="entry.id"
        :key="entry.id">
				<td>{{ entry.project.name }}</td>
        <td>{{ entry.id }}</td>
        <td>
          <ul>
            <li v-for="journal in renderJournals(entry.journals)">
              {{ journal[0] }}: {{ journal[1] }}
            </li>
          </ul>
        </td>
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
  name: 'ActivityTable',
  props: {
    range: {
      type: String,
    },
  },
  components: {
  },
  setup(props) {
    const store = useStore();
    const result = ref([]);
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
    const lastWeek = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7);
    const range = computed(() => props.range);
    const loading = ref(false);

    watch(range, () => {
      result.value = []
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    })

    const filterByTime = async (rangeToCheck) => {
      loading.value = true;
      for (const key of Object.keys(store.state.issues)) {
        const lastUpdatedOn = new Date(store.state.issues[key].updated_on);
        
        if (lastUpdatedOn > rangeToCheck) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue;
          store.commit({
            type: 'updateIssue',
            key,
            payload: issueWithJournals,
          });
          issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals);
        }
      }
      loading.value = false;
    }

    const renderJournals = (journals) => {
      const actions = new Map();
      journals = journals.filter(journal => new Date(journal.created_on) > (range.value === 'day' ? yesterday : lastWeek))
      for (let i = 0; i < journals.length; i += 1) {
        if(journals[i]?.details.length > 0) {
          for (let j = 0; j < journals[i].details.length; j += 1) {
            switch (journals[i].details[j].name) {
              case "status_id":
                actions.set('status updated to', journals[i].details[j].new_value)
                break;
              case "tracker_id":
                actions.set('tracker updated to', journals[i].details[j].new_value)
                break;
              case "assigned_to_id":
                actions.set('assignee updated to', journals[i].details[j].new_value)
                break;
              default:
                actions.set(journals[i].details[j].name, journals[i].details[j].new_value)
                break;
            }
          }
        } else {
          actions.set('note added', journals[i].notes)
        }
      }
      return actions.entries();
    }

    onMounted(async () => {
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    });

    return {
      result,
      range,
      loading,
      renderJournals,
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
  width: 100%;
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
  table-layout: fixed;
  width: 100%;
}

tbody {
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.45);
}

tbody > tr {
  background: #EDF2F2;
  height: 38px;
  border-bottom: 1px solid #C3D1D1;
}

tbody > tr:hover {
  background: #EBEDED;
}

tr > th:first-of-type {
  padding-inline-start: 24px;
}

tr > td:first-of-type {
  padding-inline-start: 24px;
}

section {
  padding-block-start: 24px;
  padding-block-end: 24px;
}
</style>
