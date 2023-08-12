import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

function initialState() {
  return {
    user: {},
    project: {},
    query: {},
    issues: [],
    projectQueries: {},
    assignee: "",
    statuses: [],
    trackers: [],
    priorities: [],
    categories: [], 
  };
}

const store = createStore({
  state: {
    user: {},
    project: {},
    query: {},
    issues: [],
    projectQueries: {},
    assignee: "",
    statuses: [],
    trackers: [],
    priorities: [],
    categories: [],
  },
  mutations: {
    addUser(state, payload) {
      state.user = { ...payload.payload };
    },
    addProject(state, payload) {
      state.project = { ...payload.payload };
    },
    addQuerie(state, payload) {
      state.query = { ...payload.payload };
    },
    addAllIssues(state, payload) {
      state.issues = [...payload.payload];
    },
    updateIssue(state, payload) {
      state.issues[parseInt(payload.key, 10)] = payload.payload;
    },
    updateAssignee(state, payload) {
      state.assignee = payload.payload;
    },
    resetState(state) {
      const s = initialState();
      Object.keys(s).forEach(key => {
        state[key] = s[key];
      });
    },
    addStatuses(state, payload) {
      state.statuses = [...payload.payload];
    },
    addTrackers(state, payload) {
      state.trackers = [...payload.payload];
    },
    addPriorities(state, payload) {
      state.priorities = [...payload.payload];
    },
    addCategories(state, payload) {
      state.categories = [...payload.payload]
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
});

export default store;
