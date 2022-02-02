<template>
  <header>
    <router-link :to="{name: 'Setup'}">
      <div class="info" v-if="project.name">
        <span class="small-text">Project:</span>
        <span class="large-text">{{ project.name }}</span>
      </div>
    </router-link>

    <router-link :to="{name: 'Setup'}">
      <div class="info" v-if="query.name">
        <span class="small-text">Query:</span>
        <span class="large-text">{{ query.name }}</span>
      </div>
    </router-link>

    <div class ="float-right">
      <button class="logout" v-if="user.firstname" @click="logoutUser">
        Logout
      </button>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from "vuex"

export default {
  name: 'Header',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    const project = computed(() => store.state.project);
    const query = computed(() => store.state.query);

    const logOutUser = () => {

    }

    return {
      user,
      project,
      query,
      logOutUser
    }
  }
}
</script>

<style>
header {
  background-color: white;
  height: 45px;
  display: flex;
}

.info {
  height: 45px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-right: 15px;
  margin-left: 30px;
}

.small-text {
  font-size: 14px;
  font-weight: 400;
}

.large-text {
  font-size: 18px;
  font-weight: 700;
}

.logout {
  cursor: pointer;
  padding: 6px;
  background: none;
  border: none;
}

.float-right {
  display: flex;
  margin-left: auto;
}
</style>
