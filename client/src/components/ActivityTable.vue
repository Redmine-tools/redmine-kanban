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
    const selectedRange = range === 'day' ? yesterday : lastWeek;
    const range = computed(() => props.range);

    onMounted(async () => {
      for (const key of Object.keys(store.state.issues)) {
        const lastUpdatedOn = new Date(store.state.issues[key].updated_on);
        if (lastUpdatedOn > selectedRange) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue;
          store.commit({
            type: 'updateIssue',
            key,
            payload: issueWithJournals,
          });
          issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals.journals);
        }
      }
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
