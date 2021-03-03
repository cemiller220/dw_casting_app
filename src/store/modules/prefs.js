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
            keepDrop: {},
            prefsValid: {},
            rehearsalSchedule: null,
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
        setKeepDrop(state, payload) {
            state.keepDrop = payload;
        },
        setPrefsValid(state, payload) {
            state.prefsValid = payload;
        },
        setRehearsalSchedule(state, payload) {
            state.rehearsalSchedule = payload || null;
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
            await context.dispatch('loadData', {node: 'rehearsal_schedule', mutation: 'prefs/setRehearsalSchedule'}, {root: true});
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
                context.dispatch('calculateStatuses', {currentPref: current_pref})
                    .then((statuses) => {
                        console.log(statuses);
                        context.commit('setCurrentStatuses', statuses);
                    });
            } else if (current_path === '/run_casting') {
                current_pref = context.getters.dancerPrefsAll[0];
                context.dispatch('calculateStatuses', {currentPref: current_pref})
                    .then((statuses) => {
                        console.log(statuses);
                        context.commit('setCurrentStatuses', statuses);
                        return statuses;
                    }).then((statuses) => {
                    context.dispatch('calculateKeepDrop', {current_pref, statuses}).then((keepDrop) => {
                        context.commit('setKeepDrop', keepDrop);
                        return {current_pref, statuses, keepDrop}
                    }).then((payload) => {
                        context.dispatch('validateCasting', payload).then((valid) => {
                            console.log(valid);
                            context.commit('setPrefsValid', valid);
                        })
                    });
                });
            }

            context.commit('setCurrentPref', current_pref);
            context.commit('setCurrentIndex', 0);
        },
        startCasting(context) {
            // set choreographer prefs as cast list
            let cast_list = [];
            const dancer_prefs = context.getters.dancerPrefsAll.reduce((obj, item) => {
                obj[item.name] = item.prefs;
                return obj
            }, {});
            context.getters.choreographerPrefsAll.forEach((pref) => {
                let cast = [];
                let extra_cast = 0;
                pref.prefs.favorites.forEach((dancer) => {
                    if (dancer_prefs[dancer].indexOf(pref.name) !== -1) {
                        cast.push({name: dancer, status: 'cast'})
                    } else {
                        extra_cast++;
                    }
                });
                pref.prefs.alternates.forEach((dancer) => {
                    if (dancer_prefs[dancer].indexOf(pref.name) !== -1) {
                        if (extra_cast > 0) {
                            cast.push({name: dancer, status: 'cast'});
                            extra_cast--;
                        } else {
                            cast.push({name: dancer, status: 'waitlist'})
                        }
                    }
                });
                cast_list.push({
                    name: pref.name,
                    choreographer: pref.choreographer,
                    time: pref.time,
                    cast: cast
                })
            });

            context.commit('cast_list/setCastList', cast_list, {root: true});
            context.dispatch('uploadData', {node: 'cast_list', data: cast_list}, {root: true}).then(() => {
                context.dispatch('inializeData');
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
                if (current_path === '/prefs/dancer') {
                    context.dispatch('calculateStatuses', {currentPref: new_pref}).then((statuses) => {
                        context.commit('setCurrentStatuses', statuses);
                    });
                } else if (current_path === '/run_casting') {
                    context.dispatch('calculateStatuses', {currentPref: new_pref}).then((statuses) => {
                        context.commit('setCurrentStatuses', statuses);
                        return statuses;
                    }).then((statuses) => {
                        context.dispatch('calculateKeepDrop', {current_pref: new_pref, statuses}).then((keepDrop) => {
                            context.commit('setKeepDrop', keepDrop);
                            return {current_pref: new_pref, statuses, keepDrop}
                        }).then((payload) => {
                            context.dispatch('validateCasting', payload).then((valid) => {
                                context.commit('setPrefsValid', valid);
                            })
                        })
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
            const choreographer_prefs = context.getters.choreographerPrefsAll;
            const cast_list = context.rootGetters['cast_list/castList'];

            let statuses = {};
            payload.currentPref.prefs.forEach((piece) => {
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
            let cast_reformat = {};
            cast.forEach((dancer) => {
                cast_reformat[dancer.name] = dancer.status;
            });

            return cast_reformat;
        },
        calculateKeepDrop(context, payload) {
            console.log(payload);
            let keep_drop = {};
            Object.keys(payload.statuses).forEach((piece) => {
                if (payload.statuses[piece].status === 'cast' || payload.statuses[piece].status === 'waitlist') {
                    keep_drop[piece] = 'keep';
                }
            });
            return keep_drop;
        },
        updateKeepDrop(context, payload) {
            let keep_drop = context.getters.keepDrop;
            keep_drop[payload.piece] = payload.value;
            context.commit('setKeepDrop', keep_drop);
            context.dispatch('validateCasting', {
                current_pref: context.getters.currentPref,
                statuses: context.getters.currentStatuses,
                keepDrop: keep_drop
            }).then((valid) => {
                context.commit('setPrefsValid', valid);
            })
        },
        validateCasting(context, payload) {
            console.log('validate');
            let days = {};
            let times = {};
            context.getters.choreographerPrefsAll.forEach((pref) => {
                days[pref.name] = pref.time.day;
                times[pref.name] = pref.time.time;
            });
            let all_cast_days = [];
            let day_times = [];
            let num_cast = 0;
            let same_time = false;
            console.log(payload.keepDrop);
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

            let max_days = 'less';
            let done = false;
            if (payload.current_pref.max_days < all_cast_days.length) {
                max_days = 'more'
            } else if (payload.current_pref.max_days === all_cast_days.length) {
                max_days = 'match';
            }

            let max_dances = 'less';
            if (payload.current_pref.max_dances < num_cast) {
                max_dances = 'more'
            } else if (payload.current_pref.max_dances === num_cast) {
                max_dances = 'match'
            }

            if (max_days !== 'more' && max_dances !== 'more' && Object.values(payload.statuses).map(piece => piece.status).indexOf('waitlist') === -1) {
                done = true;
            }

            return {max_days: max_days, max_dances: max_dances, same_time: same_time, done: done};
        },
        saveChanges(context) {
            const current_pref = context.getters.currentPref;
            const keep_drop = context.getters.keepDrop;
            const cast_list = context.rootGetters['cast_list/castList'];
            Object.keys(keep_drop).forEach((piece) => {
                if (keep_drop[piece] === 'drop') {
                    // remove this dancer
                    let piece_ind = cast_list.map(piece => piece.name).indexOf(piece);
                    let dancer_ind = cast_list[piece_ind].cast.map(dancer => dancer.name).indexOf(current_pref.name);
                    let dancer_status = cast_list[piece_ind].cast[dancer_ind].status;
                    cast_list[piece_ind].cast.splice(dancer_ind, 1);

                    // if dancer was cast, add next dancer from waitlist
                    if (dancer_status === 'cast') {
                        let waitlist_ind = cast_list[piece_ind].cast.map(dancer => dancer.status).indexOf('waitlist');
                        cast_list[piece_ind].cast[waitlist_ind].status = 'cast';
                    }
                }
            });

            // save new cast list
            context.dispatch('uploadData', {node: 'cast_list', data: cast_list}, {root: true});
            // go to next dancer
            context.dispatch('changePref', {type: 'next'})
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
        keepDrop(state) {
            return state.keepDrop;
        },
        prefsValid(state) {
            return state.prefsValid;
        },
        rehearsalSchedule(state) {
            return state.rehearsalSchedule;
        },
        showDropped(state) {
            return state.showDropped;
        },
        view(state) {
            return state.view;
        }
    }
}

// todo what if choreographer preffed the dancer, but the dancer didn't pref the piece??
// todo validate 2 pieces at same time
// add validation for matching vs lower than max
