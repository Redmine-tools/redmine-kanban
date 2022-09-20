<template>
  <p class="section-title">
    {{ $t("qSelect") }}
  </p>
  <q-select
    v-model="selectedQuerie"
    outlined
    :options="queiresOrdered"
    :option-value="'id'"
    :option-label="'name'"
    :label="$t('query')"
    input-debounce="10"
    use-input
    hide-selected
    fill-input
    :disable="queiresOrdered.length === 0"
    @filter="filterFn"
    @update:model-value="updateQuery"
  />
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import RedmineService from '@/services/RedmineService';
import { useStore } from 'vuex';

export default {
  name: 'ProjectPick',
  components: {
  },
  setup() {
    const projectsOrdered = ref();
    const selectedQuerie = ref();
    const store = useStore();
<<<<<<< HEAD
=======
    const selectedQuerie = ref(store.state?.query?.id ? { value: store.state.query.id, name: store.state.query.name } : {});
>>>>>>> init new table
    const queiresOrdered = ref([]);
    let queries;
    let stringOptions;

    async function getProjectQueriesWithOffset(offset = 0) {
      const response = await RedmineService.getProjectQueries(store.state.user.api_key, offset);
      return {
        queries: response?.data?.queries || [],
        totalCount: response?.data?.total_count || 0,
      };
    }

    async function getProjectQueries() {
      selectedQuerie.value = null;
      const PAGE_SIZE = 100;
      const { queries: firstQueries, totalCount } = await getProjectQueriesWithOffset();
      queries = [...firstQueries];
      if (totalCount > PAGE_SIZE) {
        const iterations = Math.ceil(totalCount / PAGE_SIZE);
        for (let i = 1; i < iterations; i += 1) {
          const { queries: currentQueries } = await getProjectQueriesWithOffset(i * PAGE_SIZE);
          queries = [...queries, ...currentQueries];
        }
      }
      const filteredQueries = queries.filter((i) => i?.project_id === store.state.project.id);
      queiresOrdered.value = filteredQueries.map(({ id, name }) => ({ value: id, name }));
      stringOptions = queiresOrdered.value;
    }

    function filterFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        queiresOrdered.value = stringOptions.filter((v) => v.name.toLowerCase().indexOf(needle) > -1);
      });
    }

    function updateQuery() {
      store.commit({
        type: 'addQuerie',
        payload: queries.filter((i) => i.id === selectedQuerie.value.value)[0],
      });
    }

    watch(() => store.state.project.id, () => {
<<<<<<< HEAD
=======
      selectedQuerie.value = {};
      store.commit({
        type: 'addQuerie',
        payload: {},
      });
>>>>>>> init new table
      getProjectQueries();
    });

    onMounted(() => {
    });

    return {
      projectsOrdered,
      selectedQuerie,
      queiresOrdered,
      filterFn,
      updateQuery,
      store,
    };
  },
};
</script>

<style scoped>
.section-title {
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
}

.q-field {
  width: 45%;
}
</style>
