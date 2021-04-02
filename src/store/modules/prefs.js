import router from "../../router";

export default {
    namespaced: true,
    state() {
        return {
            dancerPrefsAll: [],
            choreographerPrefsAll: [],
            currentIndex: 0,
            currentPref: {},
            allDancerStatuses: {},
            currentDancerStatuses: {},
            allCastStatuses: {},
            currentCastStatuses: {},
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
        setAllDancerStatuses(state, payload) {
            state.allDancerStatuses = payload;
        },
        setCurrentDancerStatuses(state, payload) {
            state.currentDancerStatuses = payload;
        },
        setCurrentCastStatuses(state, payload) {
            state.currentCastStatuses = payload;
        },
        setAllCastStatuses(state, payload) {
            state.allCastStatuses = payload;
        },
        setShowDropped(state, payload) {
            state.showDropped = payload;
        },
        setView(state, payload) {
            state.view = payload;
        }
    },
    actions: {
        loadAllData(context) {
            console.log('load all data');
            const split_path = router.currentRoute.value.path.split('/');
            const path = split_path[split_path.length - 1];
            let keyMutationPairs = {
                cast_list: 'cast_list/setCastList',
                dancer_prefs: 'prefs/setDancerPrefsAll',
                choreographer_prefs: 'prefs/setChoreographerPrefsAll',
            };

            if (path === 'choreographer') {
                keyMutationPairs.all_cast_statuses = 'prefs/setAllCastStatuses'
            } else if (path === 'dancer') {
                keyMutationPairs.all_dancer_statuses = 'prefs/setAllDancerStatuses'
            }

            context.dispatch('calculateData', {
                functionName: 'prefs',
                keyMutationPairs: keyMutationPairs,
                extraArgs: [
                    {key: 'path', value: path},
                    {key: 'mode', value: context.getters.casting_mode}
                    ]
            }, {root: true}).then(() => {
                console.log('initialize data');
                let current_pref = {};
                if (path === 'choreographer') {
                    current_pref = context.getters.choreographerPrefsAll[0];
                    context.commit('setCurrentCastStatuses', context.getters.allCastStatuses[current_pref.name]);
                    context.commit('setCurrentPref', current_pref);
                    context.commit('setCurrentIndex', 0);
                } else if (path === 'dancer')
                {
                    current_pref = context.getters.dancerPrefsAll[0];
                    context.commit('setCurrentDancerStatuses', context.getters.allDancerStatuses[current_pref.name]);
                    context.commit('setCurrentPref', current_pref);
                    context.commit('setCurrentIndex', 0);
                }
            });
        },

        // getNextOrderedPref(context, payload) {
        //
        // },
        // jumpToPref(context, payload) {
        //
        // },
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
            if (payload.change_direction === 'next') {
                const current_index = +context.getters.currentIndex;
                if (current_index < prefs_all.length-1) {
                    new_index = current_index + 1;
                }
            } else if (payload.change_direction === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    new_index = current_index - 1;
                }
            } else if (payload.change_direction === 'jump') {
                new_index = context.getters[field].indexOf(payload.to);
            }

            if (new_index !== -1) {
                const new_pref = prefs_all[new_index];
                context.commit('setCurrentIndex', new_index);
                context.commit('setCurrentPref', new_pref);
                if (current_path === '/prefs/dancer')
                {
                    context.commit('setCurrentDancerStatuses', context.getters.allDancerStatuses[new_pref.name])
                }
                else if (current_path === '/prefs/choreographer')
                {
                    context.commit('setCurrentCastStatuses', context.getters.allCastStatuses[new_pref.name])
                }
            }
        },

        toggleShowDropped(context) {
            context.commit('setShowDropped', !context.getters.showDropped)
        },
        toggleView(context, payload) {
            if (payload && payload.new_view) {
                context.commit('setView', payload.new_view)
            } else if (context.getters.view === 'list') {
                context.commit('setView', 'calendar')
            } else {
                context.commit('setView', 'list')
            }
        },

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
        allDancerStatuses(state) {
            return state.allDancerStatuses;
        },
        currentDancerStatuses(state) {
            return state.currentDancerStatuses;
        },
        currentCastStatuses(state) {
            return state.currentCastStatuses;
        },
        allCastStatuses(state) {
            return state.allCastStatuses;
        },
        allDancerValidation(state) {
            return state.allDancerValidation;
        },
        showDropped(state) {
            return state.showDropped;
        },
        view(state) {
            return state.view;
        },


    }
}

// todo: add preview changes option



