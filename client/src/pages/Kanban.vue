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
    <div class="loading-container">
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="100px" color="dark" />
      </q-inner-loading>
    </div>
    <div class="kanban">
      <div class="" v-for="status in columnConfig" :id="status.id" :key="status.id">
        <h6 class="status-name">{{ status.name }} <p> {{ issuesByStatus[status.name].length }} </p></h6>
        <div class="kanban-col">
          <draggable
                  class="list-group"
                  :list="issuesByStatus[status.name]"
                  @add="add"
                  itemKey="id"
                  group="issues"
                  v-bind:id="status.name"
          >
            <template #item="{ element }">
              <div class="list-item" v-bind:id="element.id" @click="openTicket(element)">
                <div class="title">#{{ element.id }}</div>
                <div class="title">{{ element.subject }}</div>
                <div class="author">Szerző: {{ element.author.name }} </div>
                <div v-if="element?.assigned_to?.name">Felelős: {{ element.assigned_to.name }} </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <q-dialog v-model="openIssueDialoge" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <h4>{{ clickedIssue.id }}</h4>
        </q-card-section>
        <q-card-section class="row items-center">
          <h5>subject: {{ clickedIssue.subject }}</h5>
          <div>created on: {{ clickedIssue.created_on }}</div>
          <div>updated on: {{ clickedIssue.updated_on }}</div>
          <div>priority: {{ clickedIssue.priority.name }}</div>
          <div>project: {{ clickedIssue.project.name }}</div>
          <div>status: {{ clickedIssue.status.name }}</div>
        </q-card-section>
        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn @click="open()" label="Open ticket in redmine" color="primary" v-close-popup />
          <q-btn label="Close popup" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
  import { ref, onMounted, watch } from 'vue'
  import draggable from 'vuedraggable'
  import RedmineService from '@/services/RedmineService.js'
  import { useStore } from "vuex"
  import lodash from "lodash"

  export default {
    name: "Kanban",
    components: {
      draggable
    },
    setup() {
      const store = useStore()
      const searchKeyWord = ref('')
      const columnConfig = ref([])
      let issuesForProject = []
      let issuesByStatus = ref()
      let originalIssuesStringifyed
      const leftDrawerOpen = ref(true)
      const miniState = ref(false)
      const loading = ref(false)
      const clickedIssue = ref()
      const openIssueDialoge = ref(false)

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

      async function _getIssuesWithOffset(offset=0) {
        const response = (await RedmineService.getIssuesForProject(store.state.user.api_key, store.state.query.id, store.state.project.id, offset))
        return {
          issues: response?.data?.issues || [],
          total_count: response?.data?.total_count || 0
        }
      }

      async function getIssuesForProject() {
        const PAGE_SIZE = 100
        const { issues, total_count } = await _getIssuesWithOffset()
        issuesForProject.value = [...issues]
        if(total_count > PAGE_SIZE) {
          const iterations = Math.ceil(total_count / PAGE_SIZE)
          for(let i = 1; i < iterations; i++) {
            const { issues: currentIssues } = await _getIssuesWithOffset(i * PAGE_SIZE)
            issuesForProject.value = [...issuesForProject.value, ...currentIssues]
          }
        }
        originalIssuesStringifyed = JSON.stringify(issuesForProject.value).split('},{')
        issuesByStatus.value = lodash.groupBy(issuesForProject.value, 'status.name')
        loading.value = false
        console.log(issuesByStatus.value)
      }

      async function add(event){
        const movedTo = event.to.id
        const movedId = parseInt(event.item.id)
        const newStatus = columnConfig.value.find(i => i.name === movedTo)
        issuesForProject.value = issuesForProject.value.map(issue => (issue.id === movedId) ? {...issue, status: newStatus} : issue)
        issuesByStatus.value = lodash.groupBy(issuesForProject.value, 'status.name')
        await RedmineService.updateIssueStatus(store.state.user.api_key, movedId, newStatus.id)
      }

      const indexOfAll = (arr, val) => arr.reduce((acc, el, i) => ((el.toLowerCase()).includes(val.toLowerCase()) ? [...acc, i] : acc), [])
    
      const searchByKeyWord = (searchKeyWord) => {
        const foundIndexes = indexOfAll(originalIssuesStringifyed, searchKeyWord)
        let foundItems = []
        foundIndexes.forEach(i => foundItems.push(issuesForProject.value[i]))
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

      onMounted(() => {
        loading.value = true
        setupColumnConfig()
        getIssuesForProject()
      })

      return {
        add,
        issuesByStatus,
        columnConfig,
        searchKeyWord,
        openTicket,
        leftDrawerOpen,
        miniState,
        store,
        loading,
        openIssueDialoge,
        clickedIssue,
        open
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
  height: 142px;;
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
  font-size: 17px;
  font-weight: 600;
}

.status-name {
  color: rgba(0, 0, 0, 0.50);
  padding-inline-start: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100px;
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
  border-top: 5px solid #FDB600;
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
  font-size: 36px;
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
  padding-block-start: 24px;
  width: 320px;
}

.kanban-container > .kanban {
  grid-area: kanban;
}

.kanban-container > .kanban > div:first-of-type {
  margin-inline-start: 48px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.author {
  color: rgba(0, 0, 0, 0.50);
}
</style>
