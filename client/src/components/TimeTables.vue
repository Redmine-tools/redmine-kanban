<template>
  <section >
    <div v-if="loading" class="loading-container">
      <q-inner-loading :showing="loading" />
    </div>
    <div v-else class="q-pa-md">
      <q-table
        :loading="loading"
        flat bordered
        title="Time reported"
        :rows="timeEntriesForUser"
        :columns="columns"
        row-key="name"
      >
        <template #body-cell-task="props">
          <q-td
            :props="props"
            class="link"
          >
            <a @click="open(props.row.issue.id)">{{ props.value }}</a>
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
import TaskCol from '@/components/TaskCol';
import { useI18n } from 'vue-i18n';

export default {
  name: 'TimeTables',
  props: {
    range: {
    },
    key: {
      type: Number
    }
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
    const key = computed(() => props.key);
    const loading = ref(false);
    const selectedAssignee = computed(() => store.state.assignee[0]);
    const { t, locale } = useI18n({ useScope: 'global' });
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
      field: row => getIssueData(row.issue.id)
    },
    {
      name: 'hours',
      label: t('hours'),
      align: 'left',
      field: row => row.hours
    },
    {
      name: 'comment',
      label: t('comment'),
      align: 'left',
      field: row => row.comments
    }
    ]);

    watch(selectedAssignee, () => {
      getTimeEntriesForUser(range)
    })

    watch([range, key], () => {
      timeEntriesForUser.value = []
      getTimeEntriesForUser(range)
    })

    const getIssueData = (id) => {
      const issue = store.state.issues.filter(i => i.id === id)[0];
      const title = `${issue?.tracker.name} #${issue?.id}: ${issue?.subject}`
      if (title.length > 80) {
        return title.slice?.(0, 80) + '...';
      } else {
        return title;
      }
    }

    const getTimeEntriesForUser = async (range) => {
      let from;
      let to;
      if(typeof(range.value) === 'string') {
        from=(range.value).replaceAll('/', '-');
        to=(range.value).replaceAll('/', '-');
      }
      if(typeof(range.value) === 'object') {
        to=(range.value?.from).replaceAll('/', '-');
        from=(range.value?.to).replaceAll('/', '-');
      }
      loading.value = true;
      timeEntriesForUser.value = (await RedmineService.getTimeEntriesByUser(
        store.state.user.api_key,
        store.state.project.id,
        store.state.assignee[0].id,
        from,
        to)
      ).data.time_entries;
      loading.value = false;
    }

    async function open(issueId) {
      const response = await RedmineService.getRedmineUrl()
      window.open(`${response.data}issues/${issueId}`, '_blank');
    }

    onMounted(async () => {
      getTimeEntriesForUser(range)
    });

    return {
      timeEntriesForUser,
      range,
      loading,
      columns,
      open
    };
  },
};
</script>

<style scoped>
.link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
