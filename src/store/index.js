import { createStore } from 'vuex'
import router from "../router";
import cast_list from "./modules/cast_list";
import show_order from "./modules/show_order";
import prefs from "./modules/prefs";

// const api_prefix = 'https://cemiller220.pythonanywhere.com';
const api_prefix = 'http://127.0.0.1:5000';

export default createStore({
  state() {
    return {
      season: '',
      city: '',
      possible_seasons: {'nyc': [], 'boston': []},
      metadata: null,
      updateTimes: {}
    }
  },
  mutations: {
    setCitySeason(state, payload) {
      state.city = payload.city;
      state.season = payload.season;
      state.possible_seasons = payload.possible_seasons;
    },
    setUpdateTimes(state, payload) {
      state.updateTimes = payload;
    },
    setMetadata(state, payload) {
      state.metadata = payload;
    }
  },
  actions: {
    async uploadData(context, payload) {
      // this uploads data from the payload
      const city = context.getters.city;
      const season = context.getters.season;

      const args = city && season ? `?city=${city}&season=${season}` : '';

      const response = await fetch(`${api_prefix}/api/${payload.node}${args}`, {
        method: 'PUT',
        body: JSON.stringify(payload.data)
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to send!');
      }
    },
    async loadData(context, payload) {
      const city = context.getters.city;
      const season = context.getters.season;

      const args = city && season ? `?city=${city}&season=${season}` : '';
      const response = await fetch(`${api_prefix}/api/${payload.node}${args}`);

      const responseData = await response.json();

      console.log('load ' + payload.node + ' city ' + city + ' season ' + season);
      console.log(responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch!');
      } else {
        context.commit(payload.mutation, responseData);
        return true;
      }
    },
    async uploadConfig(context, payload) {
      const response = await fetch(`${api_prefix}/config`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Failed to send!');
      }
    },
    async loadConfig(context) {
      const response = await fetch(`${api_prefix}/config`);
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
    async calculateData(context, payload) {
      const city = context.getters.city;
      const season = context.getters.season;

      let extra_args = '';
      if (payload.extraArgs) {
        payload.extraArgs.forEach((arg) => {
          extra_args += `&${arg.key}=${arg.value}`
        });
      }

      const args = city && season ? `?city=${city}&season=${season}${extra_args}` : '';
      let api_payload = {method: 'GET'};
      if (payload.data) {
        api_payload = {
          method: 'PUT',
          body: JSON.stringify(payload.data)
        };
      }

      const response = await fetch(`${api_prefix}/calculation/${payload.functionName}${args}`, api_payload);

      const responseData = await response.json();

      console.log('calculate ' + payload.functionName + ' city ' + city + ' season ' + season);
      console.log(responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch!');
      } else {
        Object.keys(payload.keyMutationPairs).forEach((key) => {
          context.commit(payload.keyMutationPairs[key], responseData[key])
        });
        return true;
      }
    },
    async changeCitySeason(context, payload) {
      payload.possible_seasons = context.getters.possible_seasons;
      context.commit('setCitySeason', payload);

      // send config to backend
      await context.dispatch('uploadConfig', payload);

      // update all data on current page
      context.dispatch('updateCurrentPageData', {current_path: router.currentRoute.value.path});
    },
    updateCurrentPageData(context, payload) {
      console.log('update');
      context.dispatch('loadData', {node: 'metadata', mutation: 'setMetadata'});
      if (payload.current_path === '/cast_list') {
        context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'});
        context.dispatch('loadData', {node: 'change_log', mutation: 'cast_list/setChangeLog'});
      } else if (payload.current_path === '/show_order') {
        context.dispatch('calculateData', {
          functionName: 'show_order',
          keyMutationPairs: {dancer_overlap: 'show_order/setDancerOverlap', allowed_next: 'show_order/setAllowedNext', all_show_orders: 'show_order/setAllShowOrders'},
          extraArgs: [{key: 'force', value: false}]
        });
      } else if (['/prefs/dancer', '/prefs/choreographer', '/run_casting'].indexOf(payload.current_path) !== -1) {
        context.dispatch('prefs/loadAllData');
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
    },
    metadata(state) {
      return state.metadata;
    },
    updateTimes(state) {
      return state.updateTimes
    },
    pieces(state) {
      let pieces = [];
      if (state.metadata) {
        Object.values(state.metadata.rehearsal_schedule).forEach((time_slot_value) => {
          Object.values(time_slot_value).forEach((value) => {
            value.forEach((piece) => {
              pieces.push(piece);
            })
          })

        });
      }
      return pieces;
    }
  },
  modules: {
    cast_list: cast_list,
    show_order: show_order,
    prefs: prefs
  }
})

