<template>
  <section class="tasks-page">
<<<<<<< HEAD
    <h4>Activity table</h4>
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
=======
    <h4>hey</h4>
    {{ result }}
>>>>>>> init new table
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
<<<<<<< HEAD
export default {
  name: 'ActivityTable',
  components: {
=======

export default {
  name: 'ActivityTable',
  components: {

>>>>>>> init new table
  },
  setup() {
    const store = useStore();
    const result = ref([]);
<<<<<<< HEAD
    onMounted(async () => {
      const yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
      
      for (const key of Object.keys(store.state.issues)) {
        const lastUpdatedOn = new Date(store.state.issues[key].updated_on)
        if(lastUpdatedOn > yesterday) {
          const issueWithJournals = (await RedmineService.getIssueJournals(store.state.user.api_key, store.state.issues[key].id)).data.issue
          store.commit({
            type: 'updateIssue',
            key,
            payload: issueWithJournals
          });
          issueWithJournals?.journals.length > 0 && result.value.push(issueWithJournals.journals);
        }
      }
    });

    console.log(result.value);

=======

    onMounted(async () => {
      console.log(store.state.issues)
    });

>>>>>>> init new table
    return {
      result,
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
=======

>>>>>>> init new table
</style>
