import { createStore } from "vuex"
import createPersistedState from "vuex-persistedstate"

const store = createStore({
  state: {
    user: {},
    project: {},
    query: {}
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
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
});

export default store
