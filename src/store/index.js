import { createStore } from 'vuex'
import router from "../router";
import cast_list from "./cast_list";
import show_order from "./show_order";
import prefs from "./prefs";

// eslint-disable-next-line no-unused-vars
let timer;

export default createStore({
  state() {
    return {
      season: '',
      city: '',
      possible_seasons: {'nyc': [], 'boston': []},
      updateTimes: {},
      loggedIn: false,
      userId: null,
      token: null,
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
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.loggedIn = payload.loggedIn;
    },
  },
  actions: {
    async uploadData(context, payload) {
      // this uploads data from the payload
      const city = context.getters.city;
      const season = context.getters.season;
      const token = context.getters.token;

      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/${city}/season${season}/${payload.node}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify(payload.data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send!');
      }
    },
    async loadData(context, payload) {
      const city = context.getters.city;
      const season = context.getters.season;
      const token = context.getters.token;

      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/${city}/season${season}/${payload.node}.json?auth=${token}`);
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
      const token = context.getters.token;

      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/current_config.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send!');
      }
    },
    async loadConfig(context) {
      const token = context.getters.token;

      const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/current_config.json?auth=${token}`);
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
      console.log('update');
      if (payload.current_path === '/cast_list') {
        context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'});
        context.dispatch('loadData', {node: 'change_log', mutation: 'cast_list/setChangeLog'});
      } else if (payload.current_path === '/show_order') {
        context.dispatch('loadData', {node: 'show_order', mutation: 'show_order/setAllShowOrders'});
        context.dispatch('loadData', {node: 'pieces', mutation: 'show_order/setPieces'});
        context.dispatch('show_order/calculateQuickChanges', {force: false});
      } else if (payload.current_path === '/prefs/dancer' || payload.current_path === '/prefs/choreographer') {
        context.dispatch('prefs/loadAllData').then(() => {
          context.dispatch('prefs/inializeData')
        });
      }
    },
    async auth(context, payload) {
      const mode = payload.mode;
      const apiKey = 'AIzaSyAhaLnWgFoUhx3AZnDm24lCbcjZ68skDzc';

      const url_type = mode === 'login' ? 'signInWithPassword' : 'signUp';
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:${url_type}?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Problem signing up')
      }

      const expiresIn = +responseData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      timer = setTimeout(() => {
        context.commit('setUser', {
          token: null,
          userId: null,
          loggedIn: false
        });
      }, expiresIn);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
        loggedIn: true
      })
    },
    autoLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return
      }
      timer = setTimeout(() => {
        context.commit('setUser', {
          token: null,
          userId: null,
          loggedIn: false
        });
      }, expiresIn);


      if (token && userId) {
        context.commit('setUser', {
          token: token,
          userId: userId,
          loggedIn: true
        })
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
    updateTimes(state) {
      return state.updateTimes
    },
    loggedIn(state) {
      return state.loggedIn;
    },
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    }
  },
  modules: {
    cast_list: cast_list,
    show_order: show_order,
    prefs: prefs
  }
})


// todo: create view pref sheet pages
// todo: start casting
