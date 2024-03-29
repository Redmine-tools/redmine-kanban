<template>
  <section
    id="kanban-container"
    class="kanban-container"
  >
    <header>
      <aside class="partial-header">
        <q-select
          v-model="selectedAssignees"
          filled
          multiple
          :options="assignees"
          :option-label="'name'"
          use-chips
          :label="$t('assignee')"
          options-cover
        />
        <q-input
          v-model="searchKeyWord"
          debounce="600"
          outlined
          :label="$t('filter')"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </aside>
      <p class="path">
        <router-link to="/setup">
          {{ $t("setupTitle") }}
        </router-link> / {{ store.state.project.name }} / {{ store.state.query.name }}
      </p>
      <h1>{{ store.state.query.name }}</h1>
    </header>
    <section class="kanban">
      <div
        v-for="status in columnConfig"
        :id="status.id"
        :key="status.id"
        class=""
      >
        <h6 class="status-name">
          {{ status.name }}
          <p>
            {{ (Object.keys(issuesByStatus).indexOf(status.name) > -1) ? issuesByStatus[status.name].length : 0 }}
          </p>
        </h6>
        <div class="kanban-col">
          <draggable
            :id="status.name"
            class="list-group"
            :list="(Object.keys(issuesByStatus).indexOf(status.name) > -1) ?
              issuesByStatus[status.name] :
              createNewStatusGroup(status.name)"
            item-key="id"
            :group="{
              name: 'issues',
            }"
            :move=add
          >
            <template #item="{ element }">
              <div
                :id="element.id"
                class="list-item"
                @click="openTicket(element)"
              >
                <div class="title-container">
                  <div class="title">
                    #{{ element.id }}
                  </div>
                  <div
                    v-if="element?.assigned_to?.name"
                    class="author-circle"
                  >
                    <span class="author-tooltiptext">
                      {{ $t("assigned_to_id") }}: {{ element.assigned_to.name }}
                    </span>
                    {{ element.assigned_to.name.split(' ').map(word => word[0]).join('') }}
                  </div>
                </div>
                <div class="title subject">
                  {{ element.subject }}
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </section>
    <q-dialog
      v-model="openIssueDialoge"
      persistent
    >
      <q-card>
        <header class="card-header">
          <div class="col">
            <h4 class="text-h6">
              {{ clickedIssue.subject }}
            </h4>
          </div>
          <div class="col" v-if="clickedIssue.assigned_to?.name">
            <span class="gray-text">{{ $t("assigned_to_id") }}:</span>
            {{ clickedIssue.assigned_to.name }}
          </div>
        </header>

        <q-card-section flat bordered class="row card-data">
          <div>
            <span class="gray-text">{{ $t("subjectKeyword") }}:</span>
            {{ clickedIssue.subject }}
          </div>
          <div>
            <span class="gray-text">{{ $t("createdOn") }}:</span>
            {{ new Date(clickedIssue.created_on).toLocaleString() }}
          </div>
          <div>
            <span class="gray-text">{{ $t("updatedOn") }}:</span>
            {{ new Date(clickedIssue.updated_on).toLocaleString() }}
          </div>
          <div>
            <span class="gray-text">{{ $t("priority") }}:</span>
            {{ clickedIssue.priority.name }}
          </div>
          <div>
            <span class="gray-text">{{ $t("project") }}:</span>
            {{ clickedIssue.project.name }}
          </div>
          <div>
            <span class="gray-text">{{ $t("status") }}:</span>
            {{ clickedIssue.status.name }}
          </div>
        </q-card-section>
        <div class="separator" />
        <q-card-actions align="left">
          <q-btn
            v-close-popup
            :label="$t('openInRedmine')"
            class="action"
            @click="open()"
          />
          <div class="spacer" />
          <q-btn
            v-close-popup
            :label="$t('closePopup')"
            class="cancel"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import draggable from 'vuedraggable';
import lodash from 'lodash';
import {
  ref, onMounted, watch, computed,
} from 'vue';
import RedmineService from '@/services/RedmineService';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import {useI18n} from "vue-i18n";

export default {
  name: 'KanbanIssues',
  components: {
    draggable,
  },
  props: {
    issues: {
      required: true,
    },
  },
  setup(props) {
    const searchKeyWord = ref('');
    const clickedIssue = ref();
    const openIssueDialoge = ref(false);
    const originalIssuesStringifyed = computed(() => {
      if (props.issues.value.length > 0) {
        return JSON.stringify(props.issues.value).split('},{');
      }
      return [];
    });
    const $q = useQuasar()
    const i18n = useI18n()

    const store = useStore();
    const columnConfig = ref([]);
    const issuesByStatus = ref([]);
    let originalIssuesByStatus;

    const assignees = computed(() => {
      const names = props.issues.value
        ? props?.issues?.value.filter((i) => i.assigned_to).map((i) => i.assigned_to)
        : [];
      let resArr = [];
      names.forEach(function(item){
        let i = resArr.findIndex(x => x.name == item.name);
        if(i <= -1){
          resArr.push({id: item.id, name: item.name});
        }
      })
      return resArr;
    });

    let selectedAssignees = ref();

    async function openTicket(element) {
      openIssueDialoge.value = true;
      clickedIssue.value = element;
    }

    async function open() {
      const response = await RedmineService.getRedmineUrl();
      window.open(`${response.data}issues/${clickedIssue.value.id}`, '_blank');
    }

    async function setupColumnConfig() {
      let redmineStatuses;
      let configIssue;
      let columnNames;
      try {
        redmineStatuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses;
        configIssue = await RedmineService.getKanbanConfigTracker(store.state.user.api_key).then(async (res) => (await RedmineService.getKanbanConfig(store.state.user.api_key, store.state.project.id, res.data.trackers.find((tracker) => tracker.name === 'Kanban').id)).data.issues[0]);
        const { config } = JSON.parse(configIssue.description);
        columnNames = config.columns;
      } catch (error) {
        console.log('error in config');
      }

      columnConfig.value = columnNames.map((status_name) => redmineStatuses.find((status) => status.name === status_name)).filter(Boolean);
    }

    async function add(event) {
      const movedTo = event.to.id;
      const movedId = parseInt(event.dragged.id, 10);
      const newStatus = columnConfig.value.find((i) => i.name === movedTo);
      await RedmineService.updateIssueStatus(store.state.user.api_key, movedId, newStatus.id).then(res => {
        RedmineService.getIssueById(store.state.user.api_key, movedId).then(res => {
          if(event.to.id !== res.data.issue.status.name) {
            $q.notify({
              message: i18n.t('redmineWorkflowError'),
              color: 'negative',
              position: 'top'
            })
            return -1;
          }
        })
      })
    }

    const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => ((el.toLowerCase()).includes(val.toLowerCase()) ? [...acc, i] : acc), []);

    const searchByKeyWord = (searchKeyWord) => {
      const foundIndexes = indexOfAll(originalIssuesStringifyed.value, searchKeyWord);
      const foundItems = [];
      foundIndexes.forEach((i) => foundItems.push(props.issues.value[i]));
      return foundItems;
    };

    function updateAssigneeInStore(assignee) {
      store.commit({
        type: 'updateAssignee',
        payload: assignee,
      });
    }

    watch(selectedAssignees, () => {
      if (Object.keys(selectedAssignees.value).length === 0) {
        updateAssigneeInStore(selectedAssignees.value);
        issuesByStatus.value = JSON.parse(JSON.stringify(originalIssuesByStatus));
      } else {
        updateAssigneeInStore(selectedAssignees.value);
        issuesByStatus.value = JSON.parse(JSON.stringify(originalIssuesByStatus));
        for (const group in issuesByStatus.value) {
          issuesByStatus.value[group] = issuesByStatus.value[group].filter((issue) => selectedAssignees.value.some(person => person.name === issue?.assigned_to?.name));
        }
      }
    });

    watch(searchKeyWord, () => {
      if (searchKeyWord.value != '') {
        const issuesToHighlight = searchByKeyWord(searchKeyWord.value.toString());
        const matches = document.querySelectorAll('.list-item');
        matches.forEach((i) => {
          if (!(issuesToHighlight.some((j) => j.id == i.id))) {
            i.style.display = 'none';
          }
        });
      } else {
        const matches = document.querySelectorAll('.list-item');
        matches.forEach((i) => {
          i.style.display = 'flex';
        });
      }
    });

    function createNewStatusGroup(status) {
      issuesByStatus.value[status] = [];
      return [];
    }

    onMounted(() => {
      setupColumnConfig();
      issuesByStatus.value = lodash.groupBy(props.issues.value, 'status.name');
      originalIssuesByStatus = JSON.parse(JSON.stringify(issuesByStatus.value));
      selectedAssignees.value = store.state?.assignee ? [...store.state?.assignee] : [];
    });

    return {
      add,
      issuesByStatus,
      columnConfig,
      searchKeyWord,
      openTicket,
      store,
      openIssueDialoge,
      clickedIssue,
      open,
      createNewStatusGroup,
      assignees,
      selectedAssignees,
    };
  },
};
</script>

<style scoped>
.kanban {
  display: flex;
  overflow-y: scroll;
}

.list-item {
  background: #FFFFFF;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  width: 210px;
  margin-block-start: 12px;
  padding: 10px;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.list-item > div {
  padding-bottom: 5px;
}

.title-container {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.title {
  font-size: 14px;
  font-weight: 600;
}

.subject {
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-name {
  color: rgba(0, 0, 0, 0.50);
  padding-inline-start: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.status-name > p {
  margin: 0px;
  padding-inline-start: 6px;
  color: rgba(0, 0, 0, 0.35);
}

.kanban-col {
  height: 92%;
  overflow: scroll;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-right: 12px;
  width: 240px;
  display: flex;
  justify-content: center;
}

.kanban div:nth-child(1n) .kanban-col {
   border-top: 5px solid #FDB600;
}

.kanban div:nth-child(2n) .kanban-col {
   border-top: 5px solid rgba(35, 140, 185, 0.38);
}

.kanban div:nth-child(3n) .kanban-col {
   border-top: 5px solid #E2B1FF;
}

.kanban div:nth-child(4n) .kanban-col {
   border-top: 5px solid #295365;
}

.partial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
}

.partial-header > .q-select {
  padding-inline-end: 24px;
}

.kanban-container {
  display: grid;
  grid-template-rows: 200px calc(100vh - 200px);
  grid-template-areas:
  "header"
  "kanban";
}

.kanban-container > header {
  grid-area: header;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  margin-inline-start: 48px;
}

.kanban-container > header > h1 {
  font-weight: 700;
  font-size: 28px;
  line-height: 24px;
  padding-block-start: 16px;
}

.kanban-container > header > .path {
  margin: 0px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.50);
  padding-block-start: 24px;
}

.kanban-container > header > .path > a {
  color: rgba(0, 0, 0, 0.50);
  text-decoration: none;
}

.kanban-container > header > .path > a:hover {
  color: rgba(0, 0, 0, 0.50);
  text-decoration: underline;
}

.kanban-container > header > .q-field {
  width: 320px;
}

.kanban-container > .kanban {
  grid-area: kanban;
}

.q-field, .q-select {
  height: 57px;
  overflow: auto;
}

.q-field--auto-height .q-field__control {
  height: -webkit-fill-available;
}

.kanban-container > .kanban > div:first-of-type {
  margin-inline-start: 48px;
}

.author {
  color: rgba(0, 0, 0, 0.50);
}

.card-header {
  display: flex;
  flex-direction: column;
}

.action {
  background: #295365;
  color: #ffffff;
}

.cancel {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

.q-card {
  padding-block-start: 24px;
  padding-block-end: 24px;
  padding-inline-start: 24px;
  padding-inline-end: 24px;
  width: 437px;
  height: 351px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.q-select {
  width: 280px;
}

.card-header {
  display: flex;
}

.card-header > h4 {
  margin: 0;
  padding: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 32px;
}

.card-data {
  margin: 0;
  padding: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  display: flex;
  flex-direction: column;
}

.card-data > div {
  padding-block-start: 12px;
}

.card-data > div:last-of-type {
  padding-block-end: 12px;
}

 .gray-text {
  color: rgba(0, 0, 0, 0.65);
}

.author-circle {
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
  font-size: 10px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  position: relative;
  display: inline-block;
}

.author-circle:nth-of-type(1n) {
  background: #FDB600;
}

.author-circle:nth-of-type(2n) {
  background: rgba(35, 140, 185, 0.38);
}

.author-circle:nth-of-type(3n) {
  background: #E2B1FF;
}

.author-circle:nth-of-type(4n) {
  background: #295365;
}

.author-circle:hover .author-tooltiptext {
  visibility: visible;
}

.author-circle .author-tooltiptext {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 10;
  top: -5px;
  right: 105%;
  white-space: nowrap;
}

.text-h5 {
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 26px;
}

.q-card__actions {
  padding-left: 0;
  padding-top: 16px;
}

.spacer {
  margin-inline-end: 16px;
}

.separator {
  height: 2px;
  background: linear-gradient(90deg, rgba(41, 83, 101, 0.38) 0%, rgba(35, 140, 185, 0.29) 23.41%, rgba(253, 182, 0, 0.29) 65.06%, rgba(226, 177, 255, 0.62) 89.76%), #D9D9D9;
}
</style>
