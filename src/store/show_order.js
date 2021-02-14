export default {
    namespaced: true,
    state() {
        return {
            showOrder: [],
            selectedPiece: null,
            currentQuickChanges: {},
            dancerOverlap: {},
            allowedNext: {},
            currentShowOrder: [
                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INTERMISSION', '', '', '', '','', '', '', '', '', '', '', '', '', ''
            ],
            selectedSlot: 0,
            showOrderDone: false,
            pieces: []
        }
    },
    mutations: {
        setSelectedPiece(state, payload) {
            state.selectedPiece = payload;
        },
        setCurrentQuickChanges(state, payload) {
            state.currentQuickChanges = payload;
        },
        setDancerOverlap(state, payload) {
            state.dancerOverlap = payload || {};
        },
        setAllowedNext(state, payload) {
            state.allowedNext = payload || {};
        },
        addToShowOrder(state, payload) {
            state.currentShowOrder[payload.index] = payload.piece;
        },
        setSlot(state, payload) {
            state.selectedSlot = payload.new_slot;
        },
        setDone(state, payload) {
            state.showOrderDone = payload.done;
        },
        setPieces(state, payload) {
            state.pieces = payload
        },
        setShowOrder(state, payload) {
            state.showOrder = payload;
        }
    },
    actions: {
        selectPiece(context, payload) {
            const currentIndex = parseInt(payload.index, 10);

            if (context.getters.selectedPiece && payload.piece === context.getters.selectedPiece) {
                context.commit('setSelectedPiece', null);
                context.commit('setCurrentQuickChanges', {});
            } else {
                context.commit('setSelectedPiece',  payload.piece);
                let quick_changes = {
                    'into': {0: {piece: '', dancers: []}, 1: {piece: '', dancers: []}, 2: {piece: '', dancers: []}},
                    'after': {0: {piece: '', dancers: []}, 1: {piece: '', dancers: []}, 2: {piece: '', dancers: []}}
                };
                for (let ind in [0,1,2]) {
                    if (currentIndex-1-ind >= 0) {
                        let adjacentPiece = context.getters.showOrder[currentIndex-1-ind];
                        if (adjacentPiece === 'INTERMISSION') {
                            break;
                        }
                        quick_changes.into[ind].piece = adjacentPiece;
                        quick_changes.into[ind].dancers = context.getters.dancerOverlap[payload.piece][adjacentPiece] || [];
                    }
                }
                for (let ind in [0,1,2]) {
                    if (currentIndex+1+parseInt(ind, 10) < context.getters.showOrder.length) {
                        let adjacentPiece = context.getters.showOrder[currentIndex+1+parseInt(ind, 10)];
                        if (adjacentPiece === 'INTERMISSION') {
                            break;
                        }
                        quick_changes.after[ind].piece = adjacentPiece;
                        quick_changes.after[ind].dancers = context.getters.dancerOverlap[payload.piece][adjacentPiece] || [];
                    }
                }
                context.commit('setCurrentQuickChanges', quick_changes);
            }

        },
        async calculateQuickChanges(context, payload) {
            // check if quick changes exist and if they need to be updated
            const loadSuccessful = await context.dispatch('loadData', {node: 'update_times', mutation: 'setUpdateTimes'}, {root: true});
            if (loadSuccessful) {
                const update_times = context.rootGetters.updateTimes;

                if ((payload.force) || (!update_times) || !('quick_change_calc' in update_times) || !('cast_list' in update_times) || (update_times.quick_change_calc < update_times.cast_list)) {
                    // cast has changed, recalculate
                    let castExists = null;
                    if (context.rootGetters['cast_list/castList'].length === 0) {
                        castExists = await context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'}, {root: true});
                    } else {
                        castExists = true;
                    }

                    if (castExists) {
                        const cast_list = context.rootGetters['cast_list/castList'];
                        const dancer_overlap = {};
                        const allowed_next = {};
                        for (let piece1 of cast_list) {
                            let dance1 = piece1.name;
                            allowed_next[dance1] = [];
                            dancer_overlap[dance1] = {};
                            for (let piece2 of cast_list) {
                                let dance2 = piece2.name;
                                if (piece1.name !== piece2.name) {
                                    let cast1 = piece1.cast.filter((dancer) => dancer.status === 'cast').map((dancer) => {
                                        return dancer.name
                                    });
                                    let cast2 = piece2.cast.filter((dancer) => dancer.status === 'cast').map((dancer) => {
                                        return dancer.name
                                    });
                                    const overlap = cast1.filter(value => cast2.includes(value));
                                    dancer_overlap[dance1][dance2] = overlap;
                                    if (overlap.length === 0) {
                                        allowed_next[dance1].push(dance2);
                                    }
                                }
                            }
                        }

                        await context.dispatch('uploadData', {node: 'dancer_overlap', data: dancer_overlap}, {root: true});
                        await context.dispatch('uploadData', {node: 'allowed_next', data: allowed_next}, {root: true});

                        await context.dispatch('uploadData', {node: 'update_times/quick_change_calc', data: Date.now()}, {root: true});

                        context.commit('setDancerOverlap', dancer_overlap);
                        context.commit('setAllowedNext', allowed_next);
                    }
                } else {
                    // no new updates, so just load
                    await context.dispatch('loadData', {node: 'dancer_overlap', mutation: 'show_order/setDancerOverlap'}, {root: true});
                    await context.dispatch('loadData', {node: 'allowed_next', mutation: 'show_order/setAllowedNext'}, {root: true});
                }
            }
        },
        async addToShowOrder(context, payload) {
            const index = context.getters.selectedSlot;
            await context.commit('addToShowOrder', {index, ...payload});

            let nextEmpty = context.getters.currentShowOrder.indexOf('', index+1);
            if (nextEmpty === -1) {
                // none after current slot are empty, find any slot that's empty
                nextEmpty = context.getters.currentShowOrder.indexOf('');
                if (nextEmpty === -1) {
                    // none are empty, show order is done
                    context.commit('setDone', {done: true});
                    nextEmpty = null;
                }
            }

            context.commit('setSlot', {new_slot: nextEmpty});

        },
        seeOptions(context, payload) {
            if (context.getters.selectedSlot && context.getters.selectedSlot === payload.index) {
                // deselect slot
            }
        },
        saveShowOrder(context) {
            context.commit('setShowOrder', context.getters.currentShowOrder);
            context.dispatch('uploadData', {node: 'show_order', data: context.getters.currentShowOrder}, {root: true});
        },
        newShowOrder(context) {
            context.commit('setShowOrder', []);
            context.commit('setSlot', 0);
            context.commit('setDone', false);
        }
    },
    getters: {
        showOrder(state) {
            return state.showOrder;
        },
        showOrderExists(state) {
            return state.showOrder && state.showOrder.length !== 0;
        },
        selectedPiece(state) {
            return state.selectedPiece;
        },
        currentQuickChanges(state) {
            return state.currentQuickChanges;
        },
        dancerOverlap(state) {
            return state.dancerOverlap;
        },
        allowedNext(state) {
            return state.allowedNext;
        },
        currentShowOrder(state) {
            return state.currentShowOrder;
        },
        selectedSlot(state) {
            return state.selectedSlot;
        },
        showOrderDone(state) {
            return state.showOrderDone;
        },
        pieces(state) {
            return state.pieces;
        }
    }
}


// TODO: when starting new show order, not starting at correct slot
// TODO: refresh data when changing seasons
// TODO: only suggest dances with no dancer overlap
// TODO: fix problems with order of loading data
