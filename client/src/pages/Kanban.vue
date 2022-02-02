<template>
  <section class="app-container">
    <h1>Kanban board</h1>
    <input class="filter-field" type="text" placeholder="filter" v-model="searchKeyWord" name="" id="">
    <div class="kanban">
      <div v-for="status in columnConfig" :key="status.id">
        <h2 class="status-name">{{ status.name }}</h2>
        <draggable
                class="list-group"
                :list="getLimitedList(issuesByStatus[status.name])"
                @change="log"
                @add="add"
                itemKey="id"
                group="issues"
        >
          <template #item="{ element }">
            <div class="list-item" v-bind:id="element.id">
              <div class="title">#{{ element.id }}</div>
              <div class="title">{{ element.subject }}</div>
              <div>Szerző: {{ element.author.name }} </div>
              <div v-if="element?.assigned_to?.name">Felelős: {{ element.assigned_to.name }} </div>
            </div>
          </template>
        </draggable>
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
  import useDebouncedRef from '@/composables/useDebouncedRef'

  export default {
    name: "Kanban",
    components: {
      draggable
    },
    setup() {
      const issueIdRegex = /\d+/
      const store = useStore()
      const columnConfig = ref([])
      const wipLimit = ref()
      const fallbackColumnConfig = ["Új", "Folyamatban", "Megoldva"]
      const fallbackWipLimit = 20
      const searchKeyWord = useDebouncedRef('', 800)
      let issuesForProject = []
      let issuesByStatus = ref()
      let originalIssuesStringifyed

      function log() {
        //window.console.log(evt)
      }

      async function setupColumnConfig() {
        let redmineStatuses
        let configIssue
        let columnNames
        let wipLimitFromConfig
        try {
          redmineStatuses = (await RedmineService.getRedmineStatuses(store.state.user.api_key)).data.issue_statuses
          configIssue = await RedmineService.getKanbanConfigTracker(store.state.user.api_key).then(async (res) =>
            (await RedmineService.getKanbanConfig(store.state.user.api_key, store.state.project.id, res.data.trackers.find(tracker => tracker.name === 'Kanban').id)).data.issues[0]
          )
          
          let config = JSON.parse(configIssue.description).config
          columnNames = config.columns || fallbackColumnConfig
          wipLimitFromConfig = config.WIP || fallbackWipLimit
        } catch (error) {
          columnNames = fallbackColumnConfig
          wipLimitFromConfig = fallbackWipLimit
        }
        columnConfig.value = redmineStatuses.filter(status => columnNames.includes(status.name))
        wipLimit.value = wipLimitFromConfig
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

      function getLimitedList(issueList){
        if (issueList && issueList.length > wipLimit.value) {
          return issueList.slice(0, wipLimit.value)
        } else {
          return issueList
        }
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
        getLimitedList,
        searchKeyWord
      }
    }
  }
</script>

<style>
  .kanban {
    display: flex;
  }

  .list-item {
    background: rgba(0, 0, 0, 0.04);
    box-shadow: 3px 3px 7px 0px rgb(0 0 0 / 35%);
    border-radius: 10px;
    height: 100%;
    width: 250px;
    margin: 10px;
    padding: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: move;
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
    margin: 30px;
  }

  .filter-field {
    padding: 4px;
    margin: 0 20px 20px;
  }
</style>
