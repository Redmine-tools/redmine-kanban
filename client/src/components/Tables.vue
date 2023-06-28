<template>
  <section class="table-container">
    <div class="header">
    </div>
    <div class="header-row">
      <div class="banner-container">
        <div class="card-title">{{ selectedAssignees.name }}{{ $t("usersActivity") }}</div>
        <q-btn type="a" :disable="disableRefreshButton" round color="primary" icon="refresh" @click="forceReload" >
          <q-tooltip anchor="top middle" self="center middle" v-if="showTooltip">
            {{ $t("waitForButtonCooldown") }}
          </q-tooltip>
        </q-btn>
      </div>
      <q-space />
      <div class="refresh-container">

      </div>
      <div class="q-pa-md">
        <div class="q-mb-sm">
          <q-badge color="teal">
            Date: {{ date }}
          </q-badge>
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

.card-title {
  margin-left: -12px;
  padding: 4px 8px 4px 28px;
  position: relative;
  border-radius: 3px 5px 5px 0;
  background: #D8E1E5;
  color: #757575;
  font-size: 18px;
  letter-spacing: .7px;
  margin-right: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.card-title::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-width: 9px 0 0 11px;
  border-top-color: #b0c2ca;
}

.header-row {
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
</style>
