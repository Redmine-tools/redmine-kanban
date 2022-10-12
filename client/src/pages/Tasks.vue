<template>
  <section>
    <q-banner v-if="assignees.length > 1 || showBanner" class="text-white bg-red">
      <template v-slot:avatar>
        <q-icon name="announcement" color="white" />
      </template>
      Selecting more than one user for kanban board filter will be clipped and only one user will be kept for this page.
      <template v-slot:action>
        <q-btn flat color="white" label="Nice" @click="hideBanner"/>
        <q-btn flat color="white" label="Back to kanban board" @click="navigateBackToKanban"/>
      </template>
    </q-banner>
    <article v-if="assignees.length < 1">
      <h4>
        Please select a user.
      </h4>
    </article>
    <section v-else >
      <header>
        <h3>{{ assignee.name }}'s activity</h3>
        <q-btn-toggle
          v-model="range"
          no-caps
          rounded
          unelevated
          toggle-color="primary"
          :options="[
            {label: 'Day', value: 'day'},
            {label: 'Week', value: 'week'},
          ]"
        />
      </header>
    <Tables :range="range" />
  </section>
</section>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Tables from '@/components/Tables.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Tasks',
  components: {
    Tables,
  },
  setup() {
    const store = useStore();
    const assignee = computed(() => store.state.assignee[0]);
    const assignees = computed(() => store.state.assignee)
    const range = ref('day');
    const showBanner = ref(true);
    const router = useRouter();

    const hideBanner = () => {
      showBanner.value = false;
    }

    const navigateBackToKanban = () => {
      router.back();
    }

    return {
      assignee,
      assignees,
      range,
      showBanner,
      hideBanner,
      navigateBackToKanban
    };
  },
};
</script>

<style scoped>
header {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-inline: 48px;
  margin-block-start: 96px;
}
</style>
