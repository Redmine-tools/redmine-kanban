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
import TaskCol from '@/components/TaskCol';

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
    console.log(range)
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
      field: row => getIssueData(row.issue.id)
    },
    {
      name: 'hours',
      label: 'Hours',
      align: 'left',
      field: row => row.hours
    },
    {
      name: 'comment',
      label: 'Comment',
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
      return `${issue?.tracker.name} #${issue?.id}: ${issue?.subject}`
    }

    const getTimeEntriesForUser = async (range) => {
      let from;
      let to;
      if(typeof(range.value) === 'string') {
        from=today;
        to=(range.value).replaceAll('/', '-');
      }
      if(typeof(range.value) === 'object') {
        to=(range.value.from).replaceAll('/', '-');
        from=(range.value.to).replaceAll('/', '-');
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


    onMounted(async () => {
      getTimeEntriesForUser(range)
    });

    return {
      timeEntriesForUser,
      range,
      loading,
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
tr > *:nth-child(3) { width:15%; }
tr > *:nth-child(4) { width:35%; }

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

section {
  padding-block-start: 24px;
}
</style>
