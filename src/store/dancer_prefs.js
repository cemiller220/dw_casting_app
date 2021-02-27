export default {
    namespaced: true,
    state() {
        return {
            prefsAll: [],
            currentIndex: 0,
            currentPref: {},
            currentStatuses: {}
        }
    },
    mutations: {
        setPrefsAll(state, payload) {
            state.prefsAll = payload || [];
            if (payload) {
                state.currentPref = payload[state.currentIndex];
            }
        },
        setCurrentIndex(state, payload) {
            state.currentIndex = payload || 0;
        },
        setCurrentPref(state, payload) {
            state.currentPref = payload;
        },
        setCurrentStatuses(state, payload) {
            state.currentStatuses = payload;
        },
    },
    actions: {
        async loadAllData(context) {
            console.log('load all data');
            await context.dispatch('loadData', {node: 'dancer_prefs', mutation: 'dancer_prefs/setPrefsAll'}, {root: true});
            await context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'}, {root: true});
            await context.dispatch('loadData', {node: 'choreographer_prefs', mutation: 'choreographer_prefs/setPrefsAll'}, {root: true});
        },
        inializeData(context) {
            console.log('initialize data');
            const current_pref = context.getters.prefsAll[context.getters.currentIndex];
            context.commit('setCurrentPref', current_pref);
            context.dispatch('calculateStatuses', {currentPref: current_pref}).then((statuses) => {
                console.log(statuses);
                context.commit('setCurrentStatuses', statuses);
            });
        },
        changeDancerPref(context, payload) {
            let new_index = -1;
            if (payload.type === 'next') {
                const current_index = +context.getters.currentIndex;
                if (current_index < context.getters.prefsAll.length-1) {
                    new_index = current_index + 1;
                }
            } else if (payload.type === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    new_index = current_index - 1;
                }
            } else if (payload.type === 'jump') {
                new_index = context.getters.dancers.indexOf(payload.to);
            }

            if (new_index !== -1) {
                const new_pref = context.getters.prefsAll[new_index];
                context.commit('setCurrentIndex', new_index);
                context.commit('setCurrentPref', new_pref);
                context.dispatch('calculateStatuses', {currentPref: new_pref}).then((statuses) => {
                    context.commit('setCurrentStatuses', statuses);
                });
            }
        },
        calculateStatuses(context, payload) {
            console.log('calculate statuses');
            console.log(payload);
            const choreographer_prefs = context.rootGetters['choreographer_prefs/prefsAll'];
            const cast_list = context.rootGetters['cast_list/castList'];

            let statuses = {};
            payload.currentPref.prefs.forEach((piece) => {
                console.log(piece);
                let preference = 'not preffed';
                let rank = '';
                let choreographer_pref = choreographer_prefs.find(pref => pref.name === piece).prefs;
                if (choreographer_pref.favorites.indexOf(payload.currentPref.name) !== -1) {
                    preference = 'favorite';
                    rank = choreographer_pref.favorites.indexOf(payload.currentPref.name);
                } else if (choreographer_pref.alternates.indexOf(payload.currentPref.name) !== -1) {
                    preference = 'alternate';
                    rank = choreographer_pref.favorites.length + choreographer_pref.alternates.indexOf(payload.currentPref.name);
                }

                let status = preference !== 'not preffed' ? 'dropped' : '';
                let cast_status = cast_list.find(cast => cast.name === piece).cast.find(dancer => dancer.name === payload.currentPref.name);
                if (cast_status) {
                    status = cast_status.status;
                }
                statuses[piece] = {preference, status, rank}
            });

            return statuses;
        }
    },
    getters: {
        dancers(state) {
            return state.prefsAll.map(pref => pref.name)
        },
        prefsAll(state) {
            return state.prefsAll;
        },
        currentPref(state) {
            return state.currentPref;
        },
        currentIndex(state) {
            return state.currentIndex;
        },
        currentStatuses(state) {
            return state.currentStatuses;
        }
    }
}
