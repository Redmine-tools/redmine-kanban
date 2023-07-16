<template>
  <section class="table-container">
    <div class="header">
    </div>
    <div class="header-row">
      <div class="date-container">
        <div class="card date-spacer">
          <span v-if="typeof(date) === 'string'">
            {{ date }}
          </span>
          <span color="teal" v-if="typeof(date) === 'object'">
            {{ date.from }}-{{ date.to }}
          </span>
        </div>

        <q-btn icon="event" round color="primary">
          <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date
              v-model="proxyDate"
              range
            >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </div>
      <div class="refresh-container">
        <q-btn type="a" :disable="disableRefreshButton" round color="primary" icon="refresh" @click="forceReload" >
          <q-tooltip anchor="top middle" self="center middle" v-if="showTooltip">
            {{ $t("waitForButtonCooldown") }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <TimeTables :range="date" :key="key"></TimeTables>
    <ActivityTable :range="date" :key="key"></ActivityTable>
  </section>
</template>

<script>
import TimeTables from '@/components/TimeTables.vue';
import ActivityTable from '@/components/ActivityTable.vue';
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Tables',
  props: {
    range: {
    },
    key: {
      type: Number
    }
  },
  components: {
    TimeTables,
    ActivityTable,
  },
  setup(props) {
    const store = useStore();
    const disableRefreshButton = ref(false);
    const issuesForProject = [];
    const loading = ref(false);
    const showTooltip = ref(false);
    const selectedAssignees = ref(store.state.assignee[0]);
    const assignees = computed(() => store.state.assignee)
    const availableAssignees = computed(() => {
      let resArr = [];
      const names = store.state.issues.filter((i) => i.assigned_to).map((i) => i.assigned_to)
      names.forEach(function(item){
        let i = resArr.findIndex(x => x.name == item.name);
        if(i <= -1){
          resArr.push({id: item.id, name: item.name});
        }
      })
      return resArr;
    });
    const key = ref(0);
    const today = new Date().toISOString().slice(0, 10);
    const date = ref(today)
    const proxyDate = ref(today)

    const updateProxy = () => {
      proxyDate.value = date.value
    }

    const save = () => {
      date.value = proxyDate.value
    }
    
    function updateAssigneeInStore(assignee) {
      store.commit({
        type: 'updateAssignee',
        payload: [assignee],
      });
    }

    watch(selectedAssignees, () => {
      updateAssigneeInStore(selectedAssignees.value);
    });

    const forceReload = () => {
      showTooltip.value = true
      disableRefreshButton.value = true
      key.value+=1
      setTimeout(() => {
        showTooltip.value = false
        disableRefreshButton.value = false
      }, 5000)
    }

    return {
      selectedAssignees,
      assignees,
      availableAssignees,
      key,
      forceReload,
      showTooltip,
      disableRefreshButton,
      date,
      proxyDate,
      updateProxy,
      save
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.table-container {
  background: #F7F7F7;
  border-radius: 12px;
  margin-block-start: 16px;
  margin-inline: 48px;
  filter: drop-shadow(0px 6px 15px rgba(0, 0, 0, 0.25));
  min-height: 192px;
}

.table-container > .header {
  height: 18px;
  border-radius: 12px 12px 0% 0%; 
  background: linear-gradient(90deg, rgba(41, 83, 101, 0.38) 0%, rgba(35, 140, 185, 0.29) 23.41%, rgba(253, 182, 0, 0.29) 65.06%, rgba(226, 177, 255, 0.62) 89.76%), #D9D9D9;
}

.card {
  display: flex;
  align-items: center;
  color: #000;
  font-size: 20px;
  letter-spacing: .7px;
}

.header-row {
  padding-block-start: 12px;
  padding-inline-start: 12px;
  display: flex;
}

.refresh-container {
  display: flex;
  align-items: center;
}

.banner-container {
  padding-block-start: 8px;
  display: flex;
  align-items: flex-start;
  height: 36px;
}

.date-container {
  display: flex;
  padding: 8px;
}

.date-spacer {
  margin-inline-end: 8px;
}
</style>

