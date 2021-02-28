import router from "../../router";

export default {
    namespaced: true,
    state() {
        return {
            dancerPrefsAll: [],
            choreographerPrefsAll: [],
            currentIndex: 0,
            currentPref: {},
            currentStatuses: {},
            currentCast: {},
            showDropped: true,
            view: 'list'
        }
    },
    mutations: {
        setDancerPrefsAll(state, payload) {
            state.dancerPrefsAll = payload || [];
        },
        setChoreographerPrefsAll(state, payload) {
            state.choreographerPrefsAll = payload || [];
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
        setCurrentCast(state, payload) {
            state.currentCast = payload;
        },
        setShowDropped(state, payload) {
            state.showDropped = payload;
        },
        setView(state, payload) {
            state.view = payload;
        }
    },
    actions: {
        async loadAllData(context) {
            console.log('load all data');
            await context.dispatch('loadData', {node: 'dancer_prefs', mutation: 'prefs/setDancerPrefsAll'}, {root: true});
            await context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'}, {root: true});
            await context.dispatch('loadData', {node: 'choreographer_prefs', mutation: 'prefs/setChoreographerPrefsAll'}, {root: true});
        },
        inializeData(context) {
            console.log('initialize data');
            const current_path = router.currentRoute.value.path;
            let current_pref = {};
            if (current_path === '/prefs/choreographer') {
                current_pref = context.getters.choreographerPrefsAll[0];
                context.dispatch('calculateCurrentCast', {currentPref: current_pref}).then((cast) => {
                    console.log(cast);
                    context.commit('setCurrentCast', cast);
                });
            } else if (current_path === '/prefs/dancer') {
                current_pref = context.getters.dancerPrefsAll[0];
                context.dispatch('calculateStatuses', {currentPref: current_pref}).then((statuses) => {
                    console.log(statuses);
                    context.commit('setCurrentStatuses', statuses);
                });
            }

            context.commit('setCurrentPref', current_pref);
            context.commit('setCurrentIndex', 0);
        },
        changePref(context, payload) {
            const current_path = router.currentRoute.value.path;
            let prefs_all = [];
            let field = '';
            if (current_path === '/prefs/choreographer') {
                prefs_all = context.getters.choreographerPrefsAll;
                field = 'pieces';
            } else if (current_path === '/prefs/dancer') {
                prefs_all = context.getters.dancerPrefsAll;
                field = 'dancers';
            }

            let new_index = -1;
            if (payload.type === 'next') {
                const current_index = +context.getters.currentIndex;
                if (current_index < prefs_all.length-1) {
                    new_index = current_index + 1;
                }
            } else if (payload.type === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    new_index = current_index - 1;
                }
            } else if (payload.type === 'jump') {
                new_index = context.getters[field].indexOf(payload.to);
            }

            if (new_index !== -1) {
                const new_pref = prefs_all[new_index];
                context.commit('setCurrentIndex', new_index);
                context.commit('setCurrentPref', new_pref);
                if (current_path === '/prefs/dancer') {
                    context.dispatch('calculateStatuses', {currentPref: new_pref}).then((statuses) => {
                        context.commit('setCurrentStatuses', statuses);
                    });
                } else if (current_path === '/prefs/choreographer') {
                    context.dispatch('calculateCurrentCast', {currentPref: new_pref}).then((cast) => {
                        console.log(cast);
                        context.commit('setCurrentCast', cast);
                    });
                }
            }
        },
        calculateStatuses(context, payload) {
            console.log('calculate statuses');
            console.log(payload);
            const choreographer_prefs = context.getters.choreographerPrefsAll;
            const cast_list = context.rootGetters['cast_list/castList'];
            console.log(cast_list);

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
        },
        calculateCurrentCast(context, payload) {
            const cast_list = context.rootGetters['cast_list/castList'];
            const cast = cast_list.filter(piece => piece.name === payload.currentPref.name)[0].cast;
            let cast_reformat = {}
            cast.forEach((dancer) => {
                cast_reformat[dancer.name] = dancer.status;
            });

            return cast_reformat;
        },
        toggleShowDropped(context) {
            context.commit('setShowDropped', !context.getters.showDropped)
        },
        toggleView(context) {
            if (context.getters.view === 'list') {
                context.commit('setView', 'calendar')
            } else {
                context.commit('setView', 'list')
            }
        }
    },
    getters: {
        dancers(state) {
            return state.dancerPrefsAll.map(pref => pref.name)
        },
        pieces(state) {
            return state.choreographerPrefsAll.map(pref => pref.name)
        },
        dancerPrefsAll(state) {
            return state.dancerPrefsAll;
        },
        choreographerPrefsAll(state) {
            return state.choreographerPrefsAll;
        },
        currentPref(state) {
            return state.currentPref;
        },
        currentIndex(state) {
            return state.currentIndex;
        },
        currentStatuses(state) {
            return state.currentStatuses;
        },
        currentCast(state) {
            return state.currentCast;
        },
        showDropped(state) {
            return state.showDropped;
        },
        view(state) {
            return state.view;
        }
    }
}
