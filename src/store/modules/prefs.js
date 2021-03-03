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
            if (payload.current_pref.max_dances === 1) {
                // if dancer only wants 1 dance, find top dance they've been cast in and drop everything below it
                console.log('single dance');
                let max_cast_index = -1;
                for (let ind=0; ind<payload.current_pref.prefs.length; ind++) {
                    // find top ind
                    if (payload.statuses[payload.current_pref.prefs[ind]].status === 'cast') {
                        max_cast_index = ind;
                        break
                    }
                }
                console.log('max cast index: ' + max_cast_index);
                if (max_cast_index !== -1) {
                    // drop everything below
                    Object.keys(payload.statuses).forEach((piece) => {
                        if (payload.statuses[piece].status === 'cast' || payload.statuses[piece].status === 'waitlist') {
                            if (payload.current_pref.prefs.indexOf(piece) > max_cast_index) {
                                keep_drop[piece] = 'drop'
                            } else {
                                keep_drop[piece] = 'keep';
                            }
                        }
                    });
                } else {
                    // dancer hasn't been cast in anything yet, keep all
                    Object.keys(payload.statuses).forEach((piece) => {
                        if (payload.statuses[piece].status === 'cast' || payload.statuses[piece].status === 'waitlist') {
                            keep_drop[piece] = 'keep';
                        }
                    });
                }

            } else {
                // default
                ['first', 'second', 'third'].forEach((time_slot) => {
                    ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].forEach((day) => {
                        let pieces = context.getters.rehearsalSchedule[time_slot][day];
                        if (pieces.length !== 1) {
                            if (payload.statuses[pieces[0]] && payload.statuses[pieces[1]]) {
                                let status0 = payload.statuses[pieces[0]].status;
                                let status1 = payload.statuses[pieces[1]].status;
                                let rank0 = payload.current_pref.prefs.indexOf(pieces[0]);
                                let rank1 = payload.current_pref.prefs.indexOf(pieces[1]);
                                if (rank0 < rank1) {
                                    // if rank of pieces[0] is higher than rank of pieces[1]
                                    // drop pieces[1] if pieces[0] is cast
                                    if (status0 === 'cast' && ['cast', 'waitlist'].indexOf(status1) !== -1) {
                                        keep_drop[pieces[1]] = 'drop';
                                    }
                                } else {
                                    // if rank of pieces[1] is higher than rank of pieces[0]
                                    // drop pieces[0] if pieces[1] is cast
                                    if (status1 === 'cast' && ['cast', 'waitlist'].indexOf(status0) !== -1) {
                                        keep_drop[pieces[0]] = 'drop';
                                    }
                                }
                            }
                        }
                    })
                });
                Object.keys(payload.statuses).forEach((piece) => {
                    if (!keep_drop[piece] && (payload.statuses[piece].status === 'cast' || payload.statuses[piece].status === 'waitlist')) {
                        keep_drop[piece] = 'keep';
                    }
                });
            }

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
        dropOne(context, payload) {
            let cast_list = context.rootGetters['cast_list/castList'];
            // remove this dancer
            let piece_ind = cast_list.map(piece => piece.name).indexOf(payload.piece);
            let dancer_ind = cast_list[piece_ind].cast.map(dancer => dancer.name).indexOf(payload.dancerName);
            let dancer_status = cast_list[piece_ind].cast[dancer_ind].status;
            cast_list[piece_ind].cast.splice(dancer_ind, 1);

            // if dancer was cast, add next dancer from waitlist
            if (dancer_status === 'cast') {
                let waitlist_ind = cast_list[piece_ind].cast.map(dancer => dancer.status).indexOf('waitlist');
                cast_list[piece_ind].cast[waitlist_ind].status = 'cast';
            }

            context.commit('cast_list/setCastList', cast_list, {root: true});
        },
        saveChanges(context) {
            const current_pref = context.getters.currentPref;
            const keep_drop = context.getters.keepDrop;
            Object.keys(keep_drop).forEach((piece) => {
                if (keep_drop[piece] === 'drop') {
                    context.dispatch('dropOne', {dancerName: current_pref.name, piece: piece})
                }
            });

            // save new cast list
            const cast_list = context.rootGetters['cast_list/castList'];
            context.dispatch('uploadData', {node: 'cast_list', data: cast_list}, {root: true});
            // go to next dancer
            context.dispatch('changePref', {type: 'next'})
        },
        dropAllSameTime(context) {
            let cast_list = context.rootGetters['cast_list/castList'];
            let prefs_all = context.getters.dancerPrefsAll;
            ['first', 'second', 'third'].forEach((time_slot) => {
                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].forEach((day) => {
                    let pieces = context.getters.rehearsalSchedule[time_slot][day];
                    if (pieces.length !== 1) {
                        let casts = cast_list.filter(piece => pieces.indexOf(piece.name) !== -1);
                        casts[0].cast.filter(dancer1 => dancer1.status === 'cast').forEach((dancer) => {
                            if (casts[1].cast.filter(dancer2 => dancer2.status === 'cast').map(dancer2 => dancer2.name).indexOf(dancer.name) !== -1) {
                                // if dancer in both casts
                                console.log(dancer.name);
                                let dancer_pref = prefs_all[prefs_all.map(pref => pref.name).indexOf(dancer.name)].prefs;
                                if (dancer_pref.indexOf(pieces[0]) > dancer_pref.indexOf(pieces[1])) {
                                    // drop pieces[0]
                                    // console.log(`Drop ${dancer.name} from ${pieces[0]}`)
                                    context.dispatch('dropOne', {dancerName: dancer.name, piece: pieces[0]})
                                } else {
                                    // drop pieces[1]
                                    // console.log(`Drop ${dancer.name} from ${pieces[1]}`)
                                    context.dispatch('dropOne', {dancerName: dancer.name, piece: pieces[1]})
                                }
                            }
                        })
                    }
                })
            });

            context.dispatch('uploadData', {node: 'cast_list', data: context.rootGetters['cast_list/castList']}, {root: true});

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

// todo: check for 2 at same time when adding dancer off waitlist
// todo: display other background changes on screen (i.e. after dropping dancer, display who was added
// todo: add preview changes option



