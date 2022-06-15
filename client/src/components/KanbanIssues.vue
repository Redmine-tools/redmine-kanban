<template>
  <section id="kanban-container" class="kanban-container">
    <header>
      <q-input debounce="600" outlined v-model="searchKeyWord" label="filter">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <p class="path">{{ store.state.project.name }} / {{ store.state.query.name }}</p>
      <h1>{{ store.state.query.name }}</h1>
    </header>
    <div class="kanban">
      <div class="" v-for="status in columnConfig" :id="status.id" :key="status.id">
        <h6 class="status-name">{{ status.name }} <p> {{ (Object.keys(issuesByStatus).indexOf(status.name) > -1) ? issuesByStatus[status.name].length : 0 }} </p></h6>
        <div class="kanban-col">
          <draggable
                  class="list-group"
                  :list="(Object.keys(issuesByStatus).indexOf(status.name) > -1) ? issuesByStatus[status.name] : createNewStatusGroup(status.name)"
                  @add="add"
                  itemKey="id"
                  group="issues"
                  v-bind:id="status.name"
          >
            <template #item="{ element }">
              <div class="list-item" v-bind:id="element.id" @click="openTicket(element)">
                <div class="title">#{{ element.id }}</div>
                <div class="title subject">{{ element.subject }}</div>
                <div class="author-circle" v-if="element?.assigned_to?.name">
                  <span class="author-tooltiptext">{{ $t("assignedTo") }}: {{ element.assigned_to.name }}</span>
                  {{ element.assigned_to.name.split(' ').map(word => word[0]).join('') }}
                </div>
              </div>
            </template> 
          </draggable>
        </div>
      </div>
    </div>
    <q-dialog v-model="openIssueDialoge" persistent>
      <q-card>
          <header class="card-header">
            <h4 class="text-h5">{{ clickedIssue.subject }}</h4>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup /> 
          </header>

        <q-card-section class="row card-data">
          <div><span class="gray-text">{{ $t("subject") }}:</span> {{ clickedIssue.subject }}</div>
          <div><span class="gray-text">{{ $t("createdOn") }}:</span> <time datetime="2008-02-14 20:00">{{ clickedIssue.created_on }}</time></div>
          <div><span class="gray-text">{{ $t("updatedOn") }}:</span> <time datetime="2008-02-14 20:00">{{ clickedIssue.updated_on }}</time></div>
          <div><span class="gray-text">{{ $t("priority") }}:</span> {{ clickedIssue.priority.name }}</div>
          <div><span class="gray-text">{{ $t("project") }}:</span> {{ clickedIssue.project.name }}</div>
          <div><span class="gray-text">{{ $t("status") }}:</span> {{ clickedIssue.status.name }}</div>
          <div v-if="clickedIssue.assigned_to?.name"><span class="gray-text">{{ $t("assignedTo") }}:</span> {{ clickedIssue.assigned_to.name }} </div>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn @click="open()" :label="$t('openInRedmine')" class="action" v-close-popup />
          <q-btn :label="$t('closePopup')" class="cancel" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
  import draggable from 'vuedraggable'
  import lodash from "lodash"
  import { ref, onMounted, watch, computed } from 'vue'
  import RedmineService from '@/services/RedmineService.js'
  import { useStore } from "vuex"

  export default {
    name: 'KanbanIssues',
    components: {
      draggable
    },
    props: {
      issues: {
        required: true
      }
    },
    setup(props) {
      const searchKeyWord = ref('')
      const clickedIssue = ref()
      const openIssueDialoge = ref(false)
      let originalIssuesStringifyed = computed(() => {
        if (props.issues.value.length > 0) {
          return JSON.stringify(props.issues.value).split('},{')
        } else {
          return []
        }
      })
      const store = useStore()
      const columnConfig = ref([])
      const issuesByStatus = ref([])

      async function openTicket(element) {
        openIssueDialoge.value = true
        clickedIssue.value = element
        console.log(clickedIssue.value)
      }

      async function open() {
        const response = await RedmineService.getRedmineUrl()
        window.open(response.data + 'issues/' + clickedIssue.value.id, '_blank');
      }

      async function setupColumnConfig() {
        let redmineStatuses
        let configIssue
        let columnNames
        try {
          redmineStatuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses
          configIssue = await RedmineService.getKanbanConfigTracker(store.state.user.api_key).then(async (res) =>
            (await RedmineService.getKanbanConfig(store.state.user.api_key, store.state.project.id, res.data.trackers.find(tracker => tracker.name === 'Kanban').id)).data.issues[0]
          )
          let config = JSON.parse(configIssue.description).config
          columnNames = config.columns
        } catch (error) {
          console.log("error in config")
        }
        columnConfig.value = redmineStatuses.filter(status => columnNames.includes(status.name))
      }

      async function add(event){
        const movedTo = event.to.id
        const movedId = parseInt(event.item.id)
        const newStatus = columnConfig.value.find(i => i.name === movedTo)
        await RedmineService.updateIssueStatus(store.state.user.api_key, movedId, newStatus.id)
      }

      const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => ((el.toLowerCase()).includes(val.toLowerCase()) ? [...acc, i] : acc), [])
    
      const searchByKeyWord = (searchKeyWord) => {
        const foundIndexes = indexOfAll(originalIssuesStringifyed.value, searchKeyWord)
        let foundItems = []
        foundIndexes.forEach(i => foundItems.push(props.issues.value[i]))
        return foundItems
      }

      watch(searchKeyWord, () => {
        if (searchKeyWord.value != '') {
          const issuesToHighlight = searchByKeyWord(searchKeyWord.value.toString())
          const matches = document.querySelectorAll(".list-item")
          matches.forEach(i => {
            if(!(issuesToHighlight.some(j => j.id == i.id))) {
              i.style.display = 'none'
            }
          })
        } else {
          const matches = document.querySelectorAll(".list-item")
          matches.forEach(i => {
              i.style.display = 'flex'
          })
        }
      })

      function createNewStatusGroup(status) {
        issuesByStatus.value[status] = []
        return []
      }

      onMounted(() => {
        setupColumnConfig()
        issuesByStatus.value = lodash.groupBy(props.issues.value, 'status.name')
      })

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
        createNewStatusGroup
      }
    }
  }
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
  height: 60px;
}

.status-name > p {
  margin: 0px;
  padding-inline-start: 6px;
  color: rgba(0, 0, 0, 0.35);
}

.filter-field {
  padding: 4px;
  margin: 0 20px 20px;
}

.kanban-col {
  height: calc(100vh - 300px);
  overflow: auto;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-right: 12px;
  width: 240px;
  display: flex;
  justify-content: center;
}

::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
html {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.kanban-container {
  display: grid;
  grid-template-rows: 200px 1fr;
  grid-template-areas: 
  "header"
  "kanban"
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

.kanban-container > header > .q-field {
  width: 320px;
}

.kanban-container > .kanban {
  grid-area: kanban;
}

.kanban-container > .kanban > div:first-of-type {
  margin-inline-start: 48px;
}

.author {
  color: rgba(0, 0, 0, 0.50);
}

.card-header {
  border-bottom: 2px solid #FDB600;
}

.action {
  background: #295365;
  color: #ffffff;
}

.cancel {
  background: rgba(0, 0, 0, 0.1);;
  color: #000;
}

.q-card {
  padding-block-start: 24px;
  padding-block-end: 24px;
  padding-inline-start: 24px;
  padding-inline-end: 24px;
}

.card-header {
  display: flex;
}

.card-header > h4 {
  margin: 0;
  padding: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
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
  padding-block-start: 24px;
}

.card-data > div:last-of-type {
  padding-block-end: 24px;
}

 .gray-text {
  color: rgba(0, 0, 0, 0.65);
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

.author-circle {
  width: 28px;
  height: 28px;
  line-height: 28px;
  border-radius: 50%;
  font-size: 10px;
  text-align: center;
  font-weight: 600;
  color: #fff;
}

.author-circle:nth-child(1n) {
  background: #FDB600;
}

.author-circle:nth-child(2n) {
  background: rgba(35, 140, 185, 0.38);
}

.author-circle:nth-child(3n) {
  background: #E2B1FF;
}

.author-circle:nth-child(4n) {
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
  margin-top: 28px;
}
</style>
