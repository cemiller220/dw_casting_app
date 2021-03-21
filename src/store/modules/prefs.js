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
            keepDrop: {},
            allDancerValidation: null,
            prefsValid: {},
            lastChanges: [],
            showDropped: true,
            view: 'list',
            casting_mode: 'finalize'
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
        setKeepDrop(state, payload) {
            state.keepDrop = payload;
        },
        setAllDancerValidation(state, payload) {
            state.allDancerValidation = payload || null;
        },
        setPrefsValid(state, payload) {
            state.prefsValid = payload;
        },
        setLastChanges(state, payload) {
            state.lastChanges = payload;
        },
        setShowDropped(state, payload) {
            state.showDropped = payload;
        },
        setView(state, payload) {
            state.view = payload;
        },
        setCastingMode(state, payload) {
            state.casting_mode = payload;
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
            } else if (path === 'run_casting') {
                keyMutationPairs.all_dancer_statuses = 'prefs/setAllDancerStatuses';
                keyMutationPairs.all_dancer_validation = 'prefs/setAllDancerValidation';
                keyMutationPairs.current_pref = 'prefs/setCurrentPref';
                keyMutationPairs.current_index = 'prefs/setCurrentIndex';
                keyMutationPairs.current_statuses = 'prefs/setCurrentDancerStatuses';
                keyMutationPairs.keep_drop = 'prefs/setKeepDrop';
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
                else if (path === 'run_casting')
                {
                    current_pref = context.getters.currentPref;
                    const statuses = context.getters.currentDancerStatuses;
                    const keepDrop = context.getters.keepDrop;

                    context.dispatch('validateCasting', {current_pref, statuses, keepDrop}).then((valid) => {
                        console.log(valid);
                        context.commit('setPrefsValid', valid);
                    })
                }
            });
        },
        calculateThenInitialize(context, payload) {
            const keyMutationPairs = {
                cast_list: 'cast_list/setCastList',
                dancer_prefs: 'prefs/setDancerPrefsAll',
                choreographer_prefs: 'prefs/setChoreographerPrefsAll',
                all_dancer_statuses: 'prefs/setAllDancerStatuses',
                all_dancer_validation: 'prefs/setAllDancerValidation',
                current_pref: 'prefs/setCurrentPref',
                current_index: 'prefs/setCurrentIndex',
                current_statuses: 'prefs/setCurrentDancerStatuses',
                keep_drop: 'prefs/setKeepDrop',
                changes: 'prefs/setLastChanges'
            };

            context.dispatch('calculateData', {
                functionName: payload.functionName,
                keyMutationPairs: keyMutationPairs,
            }, {root: true}).then(() => {
                const current_pref = context.getters.currentPref;
                const statuses = context.getters.currentDancerStatuses;
                const keepDrop = context.getters.keepDrop;

                context.dispatch('validateCasting', {current_pref, statuses, keepDrop}).then((valid) => {
                    console.log(valid);
                    context.commit('setPrefsValid', valid);
                })
            });
        },
        changePref(context, payload) {
            const current_path = router.currentRoute.value.path;
            let prefs_all = [];
            let field = '';
            if (current_path === '/prefs/choreographer') {
                prefs_all = context.getters.choreographerPrefsAll;
                field = 'pieces';
            } else if (current_path === '/prefs/dancer' || current_path === '/run_casting') {
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
                if (current_path === '/prefs/dancer')
                {
                    context.commit('setCurrentDancerStatuses', context.getters.allDancerStatuses[new_pref.name])
                }
                else if (current_path === '/run_casting')
                {
                    const statuses = context.getters.allDancerStatuses[new_pref.name];
                    context.commit('setCurrentDancerStatuses', statuses);

                    context.dispatch('calculateData', {
                        functionName: 'keep_drop',
                        keyMutationPairs: {keep_drop: 'prefs/setKeepDrop'},
                        extraArgs: [
                            {key: 'dancer_name', value: new_pref.name},
                            {key: 'mode', value: context.getters.casting_mode}
                            ]
                    }, {root: true}).then(() => {
                        context.dispatch('validateCasting', {current_pref: new_pref, statuses, keepDrop: context.getters.keepDrop}).then((valid) => {
                            context.commit('setPrefsValid', valid);
                        })
                    });

                }
                else if (current_path === '/prefs/choreographer')
                {
                    context.commit('setCurrentCastStatuses', context.getters.allCastStatuses[new_pref.name])
                }
            }
        },
        updateKeepDrop(context, payload) {
            let keep_drop = context.getters.keepDrop;
            keep_drop[payload.piece] = payload.value;
            context.commit('setKeepDrop', keep_drop);
            context.dispatch('validateCasting', {
                current_pref: context.getters.currentPref,
                statuses: context.getters.currentDancerStatuses,
                keepDrop: keep_drop
            }).then((valid) => {
                context.commit('setPrefsValid', valid);
            })
        },
        validateCasting(context, payload) {
            console.log('validate');
            const days = context.getters.piece_days;
            const times = context.getters.piece_times;

            let all_cast_days = [];
            let day_times = [];
            let num_cast = 0;
            let same_time = false;
            Object.keys(payload.keepDrop).forEach((piece) => {
                if (payload.keepDrop[piece] === 'keep' && payload.statuses[piece].status === 'cast') {
                    num_cast++;
                    if (all_cast_days.indexOf(days[piece]) === -1) {
                        all_cast_days.push(days[piece]);
                    }
                    if (day_times.indexOf(days[piece] + times[piece]) !== -1) {
                        same_time = true;
                    } else {
                        day_times.push(days[piece] + times[piece])
                    }

                }
            });

            let max_days = 'match';
            let done = false;
            if (payload.current_pref.max_days < all_cast_days.length) {
                max_days = 'more'
            }
            // else if (payload.current_pref.max_days === all_cast_days.length) {
            //     max_days = 'match';
            // }

            let max_dances = 'less';
            if (payload.current_pref.max_dances < num_cast) {
                max_dances = 'more'
            } else if (payload.current_pref.max_dances === num_cast) {
                max_dances = 'match'
            }

            if (max_days !== 'more' && max_dances !== 'more' &&
                Object.values(payload.keepDrop).indexOf('drop') === -1 &&
                Object.values(payload.statuses).map(piece => piece.status).indexOf('waitlist') === -1) {
                done = true;
            }

            return {max_days: max_days, max_dances: max_dances, same_time: same_time, done: done};
        },
        saveChanges(context) {
            const current_pref = context.getters.currentPref;
            const keep_drop = context.getters.keepDrop;

            context.dispatch('calculateData', {
                functionName: 'save_pref_changes',
                keyMutationPairs: {
                    cast_list: 'cast_list/setCastList',
                    changes: 'prefs/setLastChanges',
                    all_dancer_statuses: 'prefs/setAllDancerStatuses',
                    all_dancer_validation: 'prefs/setAllDancerValidation'
                },
                data: {keep_drop: keep_drop},
                extraArgs: [{key: 'dancer_name', value: current_pref.name}]
            }, {root: true});

            // go to next dancer
            context.dispatch('changePref', {type: 'next'})
        },
        toggleShowDropped(context) {
            context.commit('setShowDropped', !context.getters.showDropped)
        },
        toggleView(context, payload) {
            if (payload.new_view) {
                context.commit('setView', payload.new_view)
            } else if (context.getters.view === 'list') {
                context.commit('setView', 'calendar')
            } else {
                context.commit('setView', 'list')
            }
        },
        toggleCastingMode(context, payload) {
            if (payload.new_mode) {
                context.commit('setCastingMode', payload.new_mode)
            } else if (context.getters.casting_mode === 'standard') {
                context.commit('setCastingMode', 'finalize')
            } else {
                context.commit('setCastingMode', 'standard')
            }

            context.dispatch('calculateData', {
                functionName: 'keep_drop',
                keyMutationPairs: {keep_drop: 'prefs/setKeepDrop'},
                extraArgs: [
                    {key: 'dancer_name', value: context.getters.currentPref.name},
                    {key: 'mode', value: context.getters.casting_mode}
                ]
            }, {root: true}).then(() => {
                context.dispatch('validateCasting', {
                    current_pref: context.getters.currentPref,
                    statuses: context.getters.currentDancerStatuses,
                    keepDrop: context.getters.keepDrop
                }).then((valid) => {
                    context.commit('setPrefsValid', valid);
                })
            });
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
        keepDrop(state) {
            return state.keepDrop;
        },
        allDancerValidation(state) {
            return state.allDancerValidation;
        },
        prefsValid(state) {
            return state.prefsValid;
        },
        lastChanges(state) {
            return state.lastChanges;
        },
        showDropped(state) {
            return state.showDropped;
        },
        view(state) {
            return state.view;
        },
        casting_mode(state) {
            return state.casting_mode;
        },
        piece_days(state) {
            let days = {};
            state.choreographerPrefsAll.forEach((pref) => {
                days[pref.name] = pref.time.day;
            });
            return days;
        },
        piece_times(state) {
            let times = {};
            state.choreographerPrefsAll.forEach((pref) => {
                times[pref.name] = pref.time.time;
            });
            return times;
        }
    }
}

// todo: add preview changes option



