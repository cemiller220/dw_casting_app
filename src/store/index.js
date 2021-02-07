import { createStore } from 'vuex'
import cast_list from "./cast_list";
import router from "../router";

export default createStore({
  state() {
    return {
      season: '',
      city: ''
    }
  },
  mutations: {
    setCitySeason(state, payload) {
      state.city = payload.city;
      state.season = payload.season;
    }
  },
  actions: {
    async uploadConfig(context, payload) {
      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/current_config.json`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send!');
      }
    },
    async loadConfig(context) {
      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/current_config.json`);
      const responseData = await response.json();

      console.log('load config');
      console.log(responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch!');
      }

      await context.commit('setCitySeason', responseData);

      // update all data on current page
      context.dispatch('updateCurrentPageData', {current_path: router.currentRoute.value.path});
    },
    async changeCitySeason(context, payload) {
      context.commit('setCitySeason', payload);

      // send config to firebase
      await context.dispatch('uploadConfig', payload);

      // update all data on current page
      context.dispatch('updateCurrentPageData', {current_path: router.currentRoute.value.path});
    },
    updateCurrentPageData(context, payload) {
      if (payload.current_path === '/cast_list') {
        context.dispatch('cast_list/loadData', {node: 'cast_list', mutation: 'setCastList'});
        context.dispatch('cast_list/loadData', {node: 'change_log', mutation: 'setChangeLog'});
      }
    }
  },
  getters: {
    city(state) {
      return state.city;
    },
    season(state) {
      return state.season;
    }
  },
  modules: {
    cast_list: cast_list
  }
})
