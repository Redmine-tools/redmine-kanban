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
      <div class="" v-for="status in columnConfig" :key="status.id">
        <h6 class="status-name">{{ status.name }} <p> {{ issuesByStatus[status.name].length }} </p></h6>
        <div class="kanban-col">
          <draggable
                  class="list-group"
                  :list="issuesByStatus[status.name]"
                  @change="log"
                  @add="add"
                  itemKey="id"
                  group="issues"
          >
            <template #item="{ element }">
              <div class="list-item" v-bind:id="element.id" @click="openTicket(element.id)">
                <div class="title">#{{ element.id }}</div>
                <div class="title">{{ element.subject }}</div>
                <div>Szerző: {{ element.author.name }} </div>
                <div v-if="element?.assigned_to?.name">Felelős: {{ element.assigned_to.name }} </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
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
      const issueIdRegex = /\d+/
      const columnConfig = ref([])
      let issuesForProject = []
      let issuesByStatus = ref()
      let originalIssuesStringifyed
      const leftDrawerOpen = ref(true)
      const miniState = ref(false)

      function log() {
        //window.console.log(evt)
      }

      async function openTicket(id) {
        const response = await RedmineService.getRedmineUrl()
        window.open(response.data + 'issues/' + id, '_blank');
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
          console.log(configIssue)
          let config = JSON.parse(configIssue.description).config
          columnNames = config.columns
        } catch (error) {
          console.log("error in config")
        }
        columnConfig.value = redmineStatuses.filter(status => columnNames.includes(status.name))
        console.log(columnConfig.value)
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
            issuesForProject.value = [...issues, ...currentIssues]
          }
        }
        originalIssuesStringifyed = JSON.stringify(issuesForProject.value).split('},{')
        issuesByStatus.value = lodash.groupBy(issuesForProject.value, 'status.name')
      }

      async function add(event){
        const movedTo = event.to.parentNode.firstElementChild.textContent
        const movedId = parseInt(event.item.innerText.match(issueIdRegex)[0])
        const newStatus = columnConfig.value.find(i => i.name === movedTo)
        const originalIssue = issuesForProject.value.find(i => i.id === movedId)
        originalIssue.status = newStatus
        issuesByStatus.value = lodash.groupBy(issuesForProject.value, 'status.name')
        await RedmineService.updateIssueStatus(store.state.user.api_key, originalIssue.id, newStatus.id)
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
        setupColumnConfig()
        getIssuesForProject()
      })

      return {
        log,
        add,
        issuesByStatus,
        columnConfig,
        searchKeyWord,
        openTicket,
        leftDrawerOpen,
        miniState,
        store
      }
    }
  }
</script>

<style scoped>
.kanban {
  display: flex;
}

.list-item {
  background: #FFFFFF;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  height: 142px;;
  width: 210px;
  margin-block-start: 12px;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
  padding-inline-start: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100px;
}

.status-name > p {
  margin: 0px;
  padding-inline-start: 6px;
}

.filter-field {
  padding: 4px;
  margin: 0 20px 20px;
}

.kanban-col {
  height: calc(100vh - 270px);
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
</style>
