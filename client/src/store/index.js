import { createStore } from "vuex"
import createPersistedState from "vuex-persistedstate"

function initialState() {
  return {
    user: { },
    project: { },
    query: { }
  }
}

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
    },
    resetState(state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage
    })
  ]
});

export default store
