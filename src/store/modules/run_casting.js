export default {
    namespaced: true,
    state() {
        return {
            currentPref: {},
            currentDancerStatuses: {},
            keepDrop: {},
            prefsValid: {},
            lastChanges: [],
            showDropped: true,
            view: 'calendar',
            casting_mode: 'standard'
        }
    },
    mutations: {
        setCurrentPref(state, payload) {
            state.currentPref = payload;
        },
        setCurrentDancerStatuses(state, payload) {
            state.currentDancerStatuses = payload;
        },
        setKeepDrop(state, payload) {
            state.keepDrop = payload;
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
        calculateThenInitialize(context, payload) {
            const keyMutationPairs = {
                // cast_list: 'cast_list/setCastList',
                // dancer_prefs: 'run_casting/setDancerPrefsAll',
                // choreographer_prefs: 'run_casting/setChoreographerPrefsAll',
                // all_dancer_statuses: 'run_casting/setAllDancerStatuses',
                // all_dancer_validation: 'run_casting/setAllDancerValidation',
                current_pref: 'run_casting/setCurrentPref',
                // current_index: 'run_casting/setCurrentIndex',
                current_statuses: 'run_casting/setCurrentDancerStatuses',
                keep_drop: 'run_casting/setKeepDrop',
                changes: 'run_casting/setLastChanges'
            };

            let extraArgs = [];
            if (payload.functionName === 'keep_drop') {
                extraArgs.push({key: 'mode', value: context.getters.casting_mode});
                extraArgs.push({key: 'change_direction', value: payload.change_direction});
            }

            context.dispatch('calculateData', {
                functionName: payload.functionName,
                keyMutationPairs: keyMutationPairs,
                extraArgs
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
        getCastingPref(context, payload) {
            let extraArgs = [
                {key: 'change_direction', value: payload.change_direction},
                {key: 'mode', value: context.getters.casting_mode}
            ];
            if (payload.change_direction === 'previous' || payload.change_direction === 'next') {
                extraArgs.push({key: 'current_name', value: context.getters.currentPref.name})
            } else if (payload.change_direction === 'jump') {
                extraArgs.push({key: 'dancer_name', value: payload.to})
            } else if (payload.change_direction === 'refresh') {
                extraArgs.push({key: 'dancer_name', value: context.getters.currentPref.name})
            }

            context.dispatch('calculateData', {
                functionName: 'keep_drop',
                keyMutationPairs: {
                    keep_drop: 'run_casting/setKeepDrop',
                    current_pref: 'run_casting/setCurrentPref',
                    current_statuses: 'run_casting/setCurrentDancerStatuses',
                    changes: 'run_casting/setLastChanges'
                },
                extraArgs,
            }, {root: true}).then(() => {
                context.dispatch('validateCasting', {
                    current_pref: context.getters.currentPref,
                    statuses: context.getters.currentDancerStatuses,
                    keepDrop: context.getters.keepDrop
                }).then((valid) => {
                    context.commit('setPrefsValid', valid);
                })
            });
        },
        validateCasting(context, payload) {
            console.log('validate');
            const days = context.rootGetters.piece_days;
            const times = context.rootGetters.piece_times;

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
        saveChanges(context) {
            const current_pref = context.getters.currentPref;
            const keep_drop = context.getters.keepDrop;

            context.dispatch('calculateData', {
                functionName: 'save_pref_changes',
                keyMutationPairs: {
                    keep_drop: 'run_casting/setKeepDrop',
                    current_pref: 'run_casting/setCurrentPref',
                    current_statuses: 'run_casting/setCurrentDancerStatuses',
                    changes: 'run_casting/setLastChanges'
                },
                data: {keep_drop: keep_drop},
                extraArgs: [
                    {key: 'dancer_name', value: current_pref.name},
                    {key: 'mode', value: context.getters.casting_mode}
                    ]
            }, {root: true}).then(() => {
                const current_pref = context.getters.currentPref;
                const statuses = context.getters.currentDancerStatuses;
                const keepDrop = context.getters.keepDrop;

                context.dispatch('validateCasting', {current_pref, statuses, keepDrop}).then((valid) => {
                    console.log(valid);
                    context.commit('setPrefsValid', valid);
                })
            });
            //     .then(() => {
            //     // go to next dancer
            //     // context.dispatch('changePref', {type: 'next'})
            //     context.dispatch('getCastingPref', {change_direction: 'next'})
            // });
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
        toggleCastingMode(context, payload) {
            if (payload.new_mode) {
                context.commit('setCastingMode', payload.new_mode)
            } else if (context.getters.casting_mode === 'standard') {
                context.commit('setCastingMode', 'finalize')
            } else {
                context.commit('setCastingMode', 'standard')
            }

            context.dispatch('getCastingPref', {change_direction: 'refresh'});
        }
    },
    getters: {
        currentPref(state) {
            return state.currentPref;
        },
        currentDancerStatuses(state) {
            return state.currentDancerStatuses;
        },
        keepDrop(state) {
            return state.keepDrop;
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
        }
    }
}


// TODO: save change list on refresh? Keep one giant change list?
// TODO: refactor code duplication --> use calculateThenInitialize function for getCastingPref and saveChanges functions
