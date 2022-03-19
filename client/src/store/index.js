import { createStore } from "vuex" 

const store = createStore({
   state:{
      user: {},
      project: {},
      query: {}
   },
   mutations: {
      addUser (state, payload) {
         state.user = {...payload.payload}
      },
      addProject (state, payload){
         console.log(payload)
         state.project = {...payload.payload}
      },
      addQuerie (state, payload) {
         state.query = {...payload.payload}
      }
   }
})

export default store
