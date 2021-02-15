export default {
    namespaced: true,
    state() {
        return {
            showOrder: [],
            selectedPieceIndex: null,
            currentQuickChanges: {},
            dancerOverlap: {},
            allowedNext: {},
            currentShowOrder: [
                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INTERMISSION', '', '', '', '','', '', '', '', '', '', '', '', '', ''
            ],
            selectedSlot: 0,
            showOrderDone: false,
            pieces: [],
            availableOptions: [],
            takenOptions: [],
            smartOptions: []
        }
    },
    mutations: {
        setShowOrder(state, payload) {
            state.showOrder = payload;
        },
        setSelectedPieceIndex(state, payload) {
            state.selectedPieceIndex = payload;
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
        setCurrentShowOrder(state, payload) {
            state.currentShowOrder = payload;
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
        setAvailableOptions(state, payload) {
            state.availableOptions = payload;
        },
        setTakenOptions(state, payload) {
            state.takenOptions = payload;
        },
        setSmartOptions(state, payload) {
            state.smartOptions = payload;
        }
    },
    actions: {
        selectPiece(context, payload) {
            const currentIndex = parseInt(payload.index, 10);

            if (context.getters.selectedPieceIndex && payload.index === context.getters.selectedPieceIndex) {
                context.commit('setSelectedPieceIndex', null);
                context.commit('setCurrentQuickChanges', {});
            } else {
                context.commit('setSelectedPieceIndex',  payload.index);
                let quick_changes = {
                    'piece': payload.piece,
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
            // check if piece is already in the show order
            const currentPieceIndex = context.getters.currentShowOrder.indexOf(payload.piece);

            if (currentPieceIndex !== -1) {
                // if yes, then remove it
                await context.commit('addToShowOrder', {index: currentPieceIndex, piece: ''});
            }
            // add piece to selected slot
            await context.commit('addToShowOrder', {index, ...payload});

            // find next empty slot to fill
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

            // set the slot and find the options
            context.commit('setSlot', {new_slot: nextEmpty});
            context.dispatch('seeOptions', {index: nextEmpty, dry_run: false});

            // clear any smart suggestions
            context.commit('setSmartOptions', []);

        },
        seeOptions(context, payload) {
            if (!payload.dry_run) {
                context.commit('setSlot', {new_slot: payload.index});
            }
            if (payload.index !== null) {
                const show_order = context.getters.currentShowOrder;
                const allowed_next = context.getters.allowedNext;
                const piece_before = payload.index !== 0 ? show_order[payload.index-1] : '';
                const piece_after = payload.index !== show_order.length-1 ? show_order[payload.index+1] : '';

                let allowed_dances = [];
                if ((piece_before !== '' && piece_before !== 'INTERMISSION') && (piece_after !== '' && piece_after !== 'INTERMISSION')){
                    allowed_dances = allowed_next[piece_before].filter(piece => context.getters.allowedNext[piece_after].includes(piece));
                } else if (piece_before !== '' && piece_before !== 'INTERMISSION') {
                    allowed_dances = allowed_next[piece_before];
                } else if (piece_after !== '' && piece_after !== 'INTERMISSION') {
                    allowed_dances = allowed_next[piece_after];
                } else {
                    allowed_dances = context.getters.pieces;
                }

                if (!payload.dry_run) {
                    context.commit('setAvailableOptions',
                        allowed_dances
                            .filter(piece => show_order.indexOf(piece) === -1)
                            .sort((piece1, piece2) => {
                                return allowed_next[piece1].length - allowed_next[piece2].length;
                            })
                    );

                    context.commit('setTakenOptions',
                        allowed_dances
                            .filter(piece => show_order.indexOf(piece) !== -1)
                            .sort((piece1, piece2) => {
                                return allowed_next[piece1].length - allowed_next[piece2].length;
                            })
                    );
                } else {
                    return allowed_dances;
                }

            } else {
                if (!payload.dry_run) {
                    context.commit('setAvailableOptions', []);
                    context.commit('setTakenOptions', []);
                }
            }

        },
        smartSuggest(context) {
            const current_show_order = context.getters.currentShowOrder;

            const remaining_pieces = context.getters.pieces
                .filter(piece => !current_show_order.includes(piece));

            let swap_options = [];
            for (let ind = 0; ind < 30; ind++) {
                if ((current_show_order[ind] !== '') && (current_show_order[ind] !== 'INTERMISSION')) {
                    context.dispatch('seeOptions', {index: ind, dry_run: true})
                        .then((allowed_dances) => {
                            // if allowed dances contains any of the remaining pieces
                            console.log('allowed dances ' + allowed_dances);
                            console.log('remaining pieces ' + remaining_pieces);
                            if ((allowed_dances.filter(piece => remaining_pieces.includes(piece)).length > 0)) {
                                console.log('overlap');
                                swap_options.push(current_show_order[ind]);
                            }
                        });
                }

                if (ind === 29) {
                    // find all options for the current slot and see if there's any overlap with the swap options
                    context.dispatch('seeOptions', {index: context.getters.selectedSlot, dry_run: true})
                        .then((allowed_dances) => {
                            console.log('swap options: ' + swap_options);
                            console.log('allowed dances: ' + allowed_dances);
                            return swap_options.filter(piece => allowed_dances.includes(piece))
                        })
                        .then((suggestions) => {
                            console.log('suggestions: ' + suggestions);
                            context.commit('setSmartOptions', suggestions);
                        });
                }
            }
        },
        saveShowOrder(context) {
            context.commit('setShowOrder', context.getters.currentShowOrder);
            context.dispatch('uploadData', {node: 'show_order', data: context.getters.currentShowOrder}, {root: true});
        },
        newShowOrder(context) {
            context.commit('setShowOrder', []);
            context.commit('setCurrentShowOrder', [
                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INTERMISSION', '', '', '', '','', '', '', '', '', '', '', '', '', ''
            ]);
            context.commit('setSlot', {new_slot: 0});
            context.commit('setDone', false);
            context.dispatch('calculateQuickChanges', {force: false});
        },
        async resetAll(context) {
            await context.dispatch('loadData', {node: 'real_show_order', mutation: 'show_order/setShowOrder'}, {root: true});
            await context.dispatch('uploadData', {node: 'show_order', data: context.getters.showOrder}, {root: true});
            await context.dispatch('calculateQuickChanges', {force: false});
        }
    },
    getters: {
        showOrder(state) {
            return state.showOrder;
        },
        showOrderExists(state) {
            return state.showOrder && state.showOrder.length !== 0;
        },
        selectedPieceIndex(state) {
            return state.selectedPieceIndex;
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
        },
        availableOptions(state) {
            return state.availableOptions;
        },
        takenOptions(state) {
            return state.takenOptions;
        },
        smartOptions(state) {
            return state.smartOptions;
        }
    }
}


// TODO: implement edit button
// TODO: add in style info?
// TODO: make show order component reuseable?
// TODO: implement arrow keys
// TODO: ability for multiple show orders, calculate summary stats to compare (i.e. average quick changes)
