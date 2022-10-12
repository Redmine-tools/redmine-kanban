<template>
  <section >
    <div v-if="loading" class="loading-container">
      <q-inner-loading :showing="loading" />
    </div>
    <table v-else class="">
    <caption>Activities</caption>
		<tbody>
			<tr
        v-for="entry in result"
        :id="entry.id"
        :key="entry.id">
				<td>{{ entry }}</td>

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
          issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals.journals);
        }
      }
      loading.value = false;
    }

    onMounted(async () => {
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    });

    return {
      result,
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
}

caption {
  padding-block-start: 24px;
  padding-inline-start: 24px;
  font-weight: bold;
  font-size: 24px;
  text-align: left;
  color: #333;
}
</style>
