export default {
    namespaced: true,
    state() {
        return {
            view: 'options',
            showOrderOptions: [],
            showOrder: [],
            selectedIndex: null,
            selectedOptionIndex: null,
            currentQuickChanges: {},
            dancerOverlap: {},
            allowedNext: {},
            pieces: [],
            availableOptions: [],
            takenOptions: [],
            smartOptions: []
        }
    },
    mutations: {
        setView(state, payload) {
            state.view = payload;
        },
        setShowOrder(state, payload) {
            state.showOrder = payload;
        },
        setShowOrderOptions(state, payload) {
            state.showOrderOptions = payload;
        },
        setSelectedIndex(state, payload) {
            state.selectedIndex = payload;
        },
        setSelectedOptionIndex(state, payload) {
            state.selectedOptionIndex = payload;
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
            state.showOrder[payload.index] = payload.piece;
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
        getQuickChanges(context, payload) {
            let quick_changes = {
                'piece': payload.currentPiece,
                'into': {0: {piece: '', dancers: []}, 1: {piece: '', dancers: []}, 2: {piece: '', dancers: []}},
                'after': {0: {piece: '', dancers: []}, 1: {piece: '', dancers: []}, 2: {piece: '', dancers: []}}
            };
            for (let ind in [0,1,2]) {
                if (payload.currentIndex-1-ind >= 0) {
                    let adjacentPiece = payload.showOrder[payload.currentIndex-1-ind];
                    if (adjacentPiece === 'INTERMISSION') {
                        break;
                    }
                    quick_changes.into[ind].piece = adjacentPiece;
                    quick_changes.into[ind].dancers = context.getters.dancerOverlap[payload.currentPiece][adjacentPiece] || [];
                }
            }
            for (let ind in [0,1,2]) {
                if (payload.currentIndex+1+parseInt(ind, 10) < payload.showOrder.length) {
                    let adjacentPiece = payload.showOrder[payload.currentIndex+1+parseInt(ind, 10)];
                    if (adjacentPiece === 'INTERMISSION') {
                        break;
                    }
                    quick_changes.after[ind].piece = adjacentPiece;
                    quick_changes.after[ind].dancers = context.getters.dancerOverlap[payload.currentPiece][adjacentPiece] || [];
                }
            }

            return quick_changes;
        },
        seeQuickChanges(context, payload) {
            console.log('in quick change func');
            const currentIndex = parseInt(payload.index, 10);
            const currentPiece = context.getters.showOrder[currentIndex];

            if (currentPiece !== "INTERMISSION") {
                if (context.getters.selectedIndex && payload.index === context.getters.selectedIndex) {
                    // deselect index
                    context.commit('setSelectedIndex', null);
                    context.commit('setCurrentQuickChanges', {});
                } else {
                    // select index
                    context.commit('setSelectedIndex',  payload.index);
                    context.dispatch('getQuickChanges', {
                        currentPiece: currentPiece,
                        currentIndex: currentIndex,
                        showOrder: context.getters.showOrder
                    }).then((quick_changes) => {
                        context.commit('setCurrentQuickChanges', quick_changes);
                    });
                }
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
            const index = context.getters.selectedIndex;
            // check if piece is already in the show order
            const currentPieceIndex = context.getters.showOrder.indexOf(payload.piece);

            if (currentPieceIndex !== -1) {
                // if yes, then remove it
                await context.commit('addToShowOrder', {index: currentPieceIndex, piece: ''});
            }
            // add piece to selected slot
            await context.commit('addToShowOrder', {index, ...payload});

            // find next empty slot to fill
            let nextEmpty = context.getters.showOrder.indexOf('', index+1);
            if (nextEmpty === -1) {
                // none after current slot are empty, find any slot that's empty
                nextEmpty = context.getters.showOrder.indexOf('');
                if (nextEmpty === -1) {
                    // none are empty, set next to null
                    nextEmpty = null;
                }
            }

            // set the slot and find the options
            context.commit('setSelectedIndex', nextEmpty);
            context.dispatch('seeOptions', {index: nextEmpty, dry_run: false});

            // clear any smart suggestions
            context.commit('setSmartOptions', []);

        },
        seeOptions(context, payload) {
            if (!payload.dry_run) {
                context.commit('setSelectedIndex', payload.index);
            }
            if (payload.index !== null) {
                const show_order = context.getters.showOrder;
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
            const current_show_order = context.getters.showOrder;

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
                    context.dispatch('seeOptions', {index: context.getters.selectedIndex, dry_run: true})
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
            context.commit('setView', 'main');
            context.commit('setSelectedIndex', null);
            context.dispatch('calculateShowOrderStats', {show_order: context.getters.showOrder}).then((stats) => {
                let current_show_orders = context.getters.showOrderOptions;
                current_show_orders.push({
                    showOrder: context.getters.showOrder,
                    stats: stats
                });
                context.dispatch('uploadData',
                    {
                        node: 'show_order',
                        data: current_show_orders
                    },
                    {root: true});
                context.commit('setSelectedOptionIndex', current_show_orders.length-1);
            });

        },
        newShowOrder(context) {
            context.commit('setView', 'edit');
            context.commit('setShowOrder', [
                '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INTERMISSION', '', '', '', '','', '', '', '', '', '', '', '', '', ''
            ]);
            context.commit('setSelectedIndex', null);
            context.dispatch('calculateQuickChanges', {force: false});
        },
        async resetAll(context) {
            await context.dispatch('loadData', {node: 'real_show_order', mutation: 'show_order/setShowOrder'}, {root: true});
            await context.dispatch('uploadData', {node: 'show_order', data: context.getters.showOrder}, {root: true});
            await context.dispatch('calculateQuickChanges', {force: false});
        },
        editShowOrder(context) {
            // context.commit('setCurrentShowOrder', context.getters.showOrder);
            context.commit('setView', 'edit');
            context.commit('setSelectedIndex', null);
            context.dispatch('calculateQuickChanges', {force: false});
        },
        deleteShowOrder(context) {
            context.commit('setView', 'options');
            context.commit('setSelectedIndex', null);

            context.getters.showOrderOptions.splice(context.getters.selectedOptionIndex, 1);
            context.dispatch('uploadData',
                {
                    node: 'show_order',
                    data: context.getters.showOrderOptions
                },
                {root: true}
                );
            context.commit('setSelectedOptionIndex', null);
        },
        viewAllOptions(context) {
            context.commit('setView', 'options');
        },
        incrementIndex(context, payload) {
            const new_index = context.getters.selectedIndex + payload.value;
            if (context.getters.showOrder[new_index] === 'INTERMISSION') {
                context.dispatch('incrementIndex', {value: payload.value*2});
            } else if (new_index >= 0 && new_index < 30) {
                if (context.getters.view === 'main') {
                    console.log('see quick changes');
                    context.dispatch('seeQuickChanges', {index: new_index})
                } else if (context.getters.view === 'edit') {
                    context.dispatch('seeOptions', {index: new_index})
                }
            }
        },
        async calculateShowOrderStats(context, payload) {
            const show_order = payload.show_order;
            let quick_change_score = 0;
            let any_back_to_back = false;
            for (let currentIndex=0; currentIndex<show_order.length; currentIndex++) {
                if (show_order[currentIndex] !== 'INTERMISSION' && show_order[currentIndex] !== '') {
                    await context.dispatch('getQuickChanges', {
                        currentIndex: currentIndex,
                        currentPiece: show_order[currentIndex],
                        showOrder: show_order
                    }).then((quick_changes) => {
                        if (quick_changes['after'][0].length > 0) {
                            any_back_to_back = true;
                        }
                        quick_change_score += 3*quick_changes['after'][0].dancers.length + 2*quick_changes['after'][1].dancers.length + quick_changes['after'][2].dancers.length
                    })
                }
            }

            return {any_back_to_back, quick_change_score}
        },
        selectOption(context, payload) {
            context.commit('setShowOrder', context.getters.showOrderOptions[payload.index].showOrder);
            context.commit('setView', 'main');
            context.commit('setSelectedOptionIndex', payload.index);
        }
    },
    getters: {
        view(state) {
            return state.view;
        },
        showOrderOptions(state) {
            return state.showOrderOptions;
        },
        showOrder(state) {
            return state.showOrder;
        },
        selectedIndex(state) {
            return state.selectedIndex;
        },
        selectedOptionIndex(state) {
            return state.selectedOptionIndex;
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


// TODO: add in style info?
// TODO: ability for multiple show orders, calculate summary stats to compare (i.e. average quick changes)
