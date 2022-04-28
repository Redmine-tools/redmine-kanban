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

      },
      project: {

      },
      query: {

      },
      kanbanTrackerId: null
   },
   mutations: {
      addUser (state, payload) {
         state.user = {...payload.payload}
      },
      addProject (state, payload){
         state.project = {...payload.payload}
      },
      addQuerie (state, payload) {
         state.query = {...payload.payload}
      },
      addKanbanTrackerId (state, payload) {
         state.kanbanTrackerId = {...payload.payload}
      }
   }
})

export default store
