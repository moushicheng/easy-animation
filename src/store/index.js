import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    trackTarget:0,

  },
  mutations: {
    choiceTrack(state,v){
      state.trackTarget=v;
    }
  },
  actions: {
  },
  modules: {
  }
})
