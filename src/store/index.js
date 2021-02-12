import { createStore } from 'vuex'
import router from "../router";
import cast_list from "./cast_list";
import show_order from "./show_order";


export default createStore({
  state() {
    return {
      season: '',
      city: '',
      possible_seasons: {'nyc': [], 'boston': []}
    }
  },
  mutations: {
    setCitySeason(state, payload) {
      state.city = payload.city;
      state.season = payload.season;
      state.possible_seasons = payload.possible_seasons;
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
      payload.possible_seasons = context.getters.possible_seasons;
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
    },
    possible_seasons(state) {
      return state.possible_seasons;
    },
    nyc_seasons(state) {
      return state.possible_seasons.nyc;
    },
    boston_seasons(state) {
      return state.possible_seasons.boston;
    }
  },
  modules: {
    cast_list: cast_list,
    show_order: show_order
  }
})
