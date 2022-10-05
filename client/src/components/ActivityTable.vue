<template>
  <section class="tasks-page">
    <h4>Activity table</h4>
    <div>{{ range }}</div>
    <table class="demTable">
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

    watch(range, () => {
      result.value = []
      filterByTime(range.value === 'day' ? yesterday : lastWeek);
    })

    const filterByTime = async (rangeToCheck) => {
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
    }

    onMounted(async () => {
      filterByTime(range.value === 'day' ? yesterday : lastWee);
    });

    console.log(result.value);

    return {
      result,
      range,
    };
  },
};
</script>

<style scoped>
</style>
