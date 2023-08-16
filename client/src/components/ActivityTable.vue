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
      >
        <template #body-cell-task="props">
          <q-td
            :props="props"
            class="link"
          >
            <a @click="open(props.row.id)">{{ props.value }}</a>
          </q-td>
        </template>
        <template #body-cell-action="props">
          <q-td
            :props="props"
          >
            <ul v-for="journal in renderJournals(props.row.journals)" :key="journal.id">
              <ActivityCol
              :journal="journal"
              />
            </ul>
          </q-td>
        </template>
      </q-table>
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
import { useI18n } from 'vue-i18n';

export default {
  name: 'ActivityTable',
  props: {
    range: {
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
    const range = computed(() => props.range);
    const key = computed(() => props.key);
    const loading = ref(false);
    const selectedAssignee = computed(() => store.state.assignee[0]);
    const { t, locale } = useI18n();
    const columns = computed(() => [{
      name: 'project',
      label: t('project'),
      align: 'left',
      field: row => row.project.name
    },
    {
      name: 'task',
      label: t('task'),
      align: 'left',
      field: row => getIssueData(row.id)
    },
    {
      name: 'action',
      label: t('action'),
      align: 'left',
      field: row => row.journals
    }
    ]);

    const getIssueData = (id) => {
      const issue = store.state.issues.filter(i => i.id === id)[0];
      const title = `${issue?.tracker.name} #${issue?.id}: ${issue?.subject}`
      if (title.length > 50) {
        return title.slice?.(0, 50) + '...';
      }
      return title;
    }

    async function open(issueId) {
      const response = await RedmineService.getRedmineUrl()
      window.open(`${response.data}issues/${issueId}`, '_blank');
    }

    watch(selectedAssignee, () => {
      result.value = []
      filterByTime(range);
    })

    watch([range, key], () => {
      result.value = []
      filterByTime(range);
    })

    const filterJournalsForUser = (journals) => {
      return journals.journals.some(issue => issue.user.id === selectedAssignee.value.id)
    }

    const getTimeRanges = (range) => {
      if(typeof(range) === 'string') {
        return {
          from: new Date(range),
          to: new Date(range)
        }
      }
      if(typeof(range) === 'object') {
        return {
          from: new Date(range?.from),
          to: new Date(range?.to)
        }
      }
    }

    const filterByTime = async (rangeToCheck) => {
      loading.value = true;
      let {from, to } = getTimeRanges(range.value);
      to.setDate(to.getDate() + 1)
      const yesterday = new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24);
      const tomorrow = new Date((new Date()).valueOf() + 1000 * 60 * 60 * 24);
      const today = new Date().toISOString().slice(0, 10);

      for (const key of Object.keys(store.state.issues)) {
        const createdOn = new Date(store.state.issues[key].created_on);
        const lastUpdatedOn = new Date(store.state.issues[key].updated_on);
        
        if (lastUpdatedOn > yesterday) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue;
          const matchesTimeRange = issueWithJournals.journals.filter(i => (new Date(i.created_on) >= from && new Date(i.created_on) <= to ))
          if ((issueWithJournals.assigned_to?.id === selectedAssignee.value.id || filterJournalsForUser(issueWithJournals)) &&  matchesTimeRange.length > 0) {
            store.commit({
              type: 'updateIssue',
              key,
              payload: issueWithJournals,
            });
            issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals);
          }
        }


        else if (from >= createdOn && to.getDate() !== tomorrow.getDate()) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue;
          const matchesTimeRange = issueWithJournals.journals.filter(i => (new Date(i.created_on) >= from && new Date(i.created_on) <= to ))
          if ((issueWithJournals.assigned_to?.id === selectedAssignee.value.id || filterJournalsForUser(issueWithJournals)) &&  matchesTimeRange.length > 0) {
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
      let {from, to } = getTimeRanges(range.value);
      const actions = [];
      journals = journals.filter(journal => new Date(journal.created_on) >= from && new Date(journal.created_on) <= new Date(to.setDate(to.getDate() + 1)))
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
      filterByTime(range);
    });

    return {
      result,
      range,
      loading,
      renderJournals,
      columns,
      open,
    };
  },
};
</script>

<style scoped>
.link {
  text-decoration: underline;
  cursor: pointer;
}

section {
  padding-block-start: 24px;
  padding-block-end: 24px;
}
</style>
