<template>
  <section >
    <div v-if="loading" class="loading-container">
      <q-inner-loading :showing="loading" />
    </div>
        <div v-else class="q-pa-md">
      <q-table
        :loading="loading"
        flat bordered
        title="Activites"
        :rows="result"
        :columns="columns"
        row-key="name"
        hide-bottom
      />
    </div>
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
import ActivityCol from '@/components/ActivityCol';
import TaskCol from '@/components/TaskCol';

export default {
  name: 'ActivityTable',
  props: {
    range: {
      type: String,
    },
    key: {
      type: Number
    }
  },
  components: {
    ActivityCol,
    TaskCol
  },
  setup(props) {
    const store = useStore();
    const result = ref([]);
    const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
    const lastWeek = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24 * 7);
    const range = computed(() => props.range);
    const key = computed(() => props.key);
    const loading = ref(false);
    const selectedAssignee = computed(() => store.state.assignee[0]);

    const columns = ref([{
      name: 'project',
      label: 'Project',
      align: 'left',
      field: row => row.project.name
    },
    {
      name: 'task',
      label: 'Task',
      align: 'left',
      field: row => getIssueData(row.id)
    },
    {
      name: 'action',
      label: 'Action',
    }
    ]);

    const getIssueData = (id) => {
      const issue = store.state.issues.filter(i => i.id === id)[0];
      return `${issue?.tracker.name} #${issue?.id}: ${issue?.subject}`
    }

    watch(selectedAssignee, () => {
      result.value = []
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    })

    watch([range, key], () => {
      result.value = []
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    })

    const filterJournalsForUser = (journals) => {
      return journals.journals.some(issue => issue.user.id === selectedAssignee.value.id)
    }

    const filterByTime = async (rangeToCheck) => {
      loading.value = true;
      for (const key of Object.keys(store.state.issues)) {
        const lastUpdatedOn = new Date(store.state.issues[key].updated_on);

        if (lastUpdatedOn > rangeToCheck) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue;
          if (issueWithJournals.assigned_to?.id === selectedAssignee.value.id || filterJournalsForUser(issueWithJournals)) {
            store.commit({
              type: 'updateIssue',
              key,
              payload: issueWithJournals,
            });
            issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals);
          }
        }
      }
      loading.value = false;
    }

    const renderJournals = (journals) => {
      const actions = [];
      journals = journals.filter(journal => new Date(journal.created_on) > (range.value === 'day' ? yesterday : lastWeek))
      for (let i = 0; i < journals.length; i += 1) {
        if(journals[i]?.details.length > 0) {
          for (let j = 0; j < journals[i].details.length; j += 1) {
            actions.push(journals[i].details[j])
          }
        } else {
          actions.push({
            name: 'note',
            new_value: journals[i].notes
          })
        }
      }
      return actions;
    }

    onMounted(async () => {
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    });

    return {
      result,
      range,
      loading,
      renderJournals,
      columns,
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


tr > *:nth-child(1) { width:20%; }
tr > *:nth-child(2) { width:30%; }
tr > *:nth-child(3) { width:50%; }

tr > td {
  padding-block-start: 6px;
  vertical-align: baseline;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

td > ul > li  {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

section {
  padding-block-start: 24px;
  padding-block-end: 24px;
}
</style>
