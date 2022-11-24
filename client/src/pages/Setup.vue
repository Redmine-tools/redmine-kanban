<template>
  <section class="setup-page">
    <header>
      <h1>{{ $t("setupTitle") }}</h1>
      <p>{{ $t("setupHelper") }}</p>
    </header>
    <section
      id="setup-container"
      class="setup-container"
    >
      <article class="input-container">
        <ProjectPick />
      </article>
      <article class="input-container">
        <QueriesPick />
      </article>
    </section>
    <div class="button-container">
      <q-btn
        :disabled="!store.state.query.id"
        class="action"
        @click="proceedToKanbanBoard"
      >
        {{ $t("proceed") }}
      </q-btn>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';
import ProjectPick from '@/components/ProjectPick.vue';
import QueriesPick from '@/components/QueriesPick.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'Setup',
  components: {
    ProjectPick,
    QueriesPick,
  },
  setup() {
    const projectSelected = ref(false);
    const router = useRouter();
    const store = useStore();

    function proceedToKanbanBoard() {
      router.push('/kanban');
    }

    /*
    onBeforeRouteLeave((to) => {
      if(to.name === 'Login') {
        const answer = window.confirm(
          'Do you really want to log out?'
        )
        if (!answer) {
          return false
        } else {
          store.commit({
            type: 'resetState'
          })
        }
      }
    })
    */

    return {
      projectSelected,
      proceedToKanbanBoard,
      store,
    };
  },
};
</script>

<style scoped>
.title {
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 24px;
}

.sub-title {
  padding-block-start: 24px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.38);
}

.button-container {
  text-align: left;
  padding-inline-start: 100px;
}

.action {
  background: #295365;
  color: #ffffff;
}

.lang-select {
  padding: 24px;
}

.q-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

header {
  padding-block-start: 128px;
  padding-inline-start: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

header > h1 {
  font-weight: 700;
  font-size: 36px;
  line-height: 24px;
  padding-block-end: 24px;
}

header > p {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.38);
  padding-block-end: 48px;
}

.setup-container {

}

.setup-container > .input-container {
  display: flex;
  padding-inline-start: 100px;
  flex-direction: column;
  align-items: flex-start;
  padding-block-end: 48px;
}

.setup-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
