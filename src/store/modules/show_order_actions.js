export default {
    // get quick changes around a piece
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
        let nextEmpty = context.getters.showOrder.indexOf('');
        if (nextEmpty === -1) {
            // none are empty, set next to null
            nextEmpty = null;
        }

        // set the slot and find the options
        context.commit('setSelectedIndex', nextEmpty);
        context.dispatch('seeOptions', {index: nextEmpty});

        // clear any smart suggestions
        context.commit('setSmartOptions', []);

    },
    getOptions(context, payload) {
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
            allowed_dances = context.rootGetters.pieces;
        }

        return allowed_dances
    },
    seeOptions(context, payload) {
        const show_order = context.getters.showOrder;
        const allowed_next = context.getters.allowedNext;

        context.commit('setSelectedIndex', payload.index);

        if (payload.index !== null) {
            context.dispatch('getOptions', payload).then((allowed_dances) => {
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
            })
        } else {
            context.commit('setAvailableOptions', []);
            context.commit('setTakenOptions', []);
        }

    },
    async smartSuggest(context) {
        const current_show_order = context.getters.showOrder;
        const remaining_pieces = context.rootGetters.pieces.filter(piece => !current_show_order.includes(piece));

        let options = [];
        for (let ind = 0; ind < 30; ind++) {
            // loop through current show order
            if ((current_show_order[ind] !== '') && (current_show_order[ind] !== 'INTERMISSION')) {
                // if the current slot has been filled and is not intermission
                // get all the pieces that can go in this slot without any back-to-back quick changes ("allowed dances")
                await context.dispatch('getOptions', {index: ind})
                    .then((allowed_dances) => {
                        console.log('allowed dances ' + allowed_dances);
                        console.log('remaining pieces ' + remaining_pieces);
                        // if any of the remaining pieces not in the show order yet can go in this slot,
                        // save the name of the dance currently in this slot as a "option"
                        if ((allowed_dances.filter(piece => remaining_pieces.includes(piece)).length > 0)) {
                            console.log('overlap');
                            options.push(current_show_order[ind]);
                        }
                    });
            }
        }

        // find all options for the current slot and see if there's any overlap with the options
        context.dispatch('getOptions', {index: context.getters.selectedIndex})
            .then((allowed_dances) => {
                console.log('options: ' + options);
                console.log('allowed dances: ' + allowed_dances);
                context.commit('setSmartOptions', options.filter(piece => allowed_dances.includes(piece)));
            });
    },
    async swapSuggest(context) {
        const current_show_order = context.getters.showOrder;
        const current_piece = current_show_order[context.getters.selectedIndex];

        let options = {};
        for (let ind = 0; ind < 30; ind++) {
            // loop through current show order
            if ((current_show_order[ind] !== '') && (current_show_order[ind] !== 'INTERMISSION')) {
                // get all the options for each slot
                await context.dispatch('getOptions', {index: ind})
                    .then((allowed_dances) => {
                        options[current_show_order[ind]] = allowed_dances;
                    });
            }
        }

        // find all options for the current slot and see if there's any overlap with the options
        context.dispatch('getOptions', {index: context.getters.selectedIndex})
            .then((allowed_dances) => {
                console.log('options: ' + options);
                console.log('allowed dances: ' + allowed_dances);
                context.commit('setSmartOptions', allowed_dances.filter(piece => options[piece].includes(current_piece) && piece !== current_piece));
            });
    },
    newShowOrder(context) {
        context.commit('setView', 'edit');
        context.commit('setShowOrder', [
            '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'INTERMISSION', '', '', '', '','', '', '', '', '', '', '', '', '', ''
        ]);
        context.commit('setSelectedIndex', null);
    },
    editShowOrder(context) {
        context.commit('setView', 'edit');
        context.commit('setSelectedIndex', null);
    },
    saveShowOrder(context) {
        context.commit('setView', 'all');
        context.commit('setSelectedIndex', null);
        context.commit('setSelectedShowOrderIndex', null);
        context.dispatch('calculateData',
            {
                functionName: 'save_new_show_order',
                data: {show_order: context.getters.showOrder},
                keyMutationPairs: {'all_show_orders': 'show_order/setAllShowOrders'}
                },
            {root: true})
    },
    deleteShowOrder(context) {
        context.commit('setView', 'all');
        context.commit('setSelectedIndex', null);
        context.dispatch('calculateData',
            {
                functionName: 'delete_show_order',
                data: {show_order_index: context.getters.selectedShowOrderIndex},
                keyMutationPairs: {'all_show_orders': 'show_order/setAllShowOrders'}
            },
            {root: true});
        context.commit('setSelectedShowOrderIndex', null);
    },
    // todo: fix reset function
    // async resetAll(context) {
        // await context.dispatch('loadData', {node: 'real_show_order', mutation: 'show_order/setShowOrder'}, {root: true});
        // await context.dispatch('calculateData', {
        //     functionName: 'show_order',
        //     keyMutationPairs: {dancer_overlap: 'show_order/setDancerOverlap', allowed_next: 'show_order/setAllowedNext', all_show_orders: 'show_order/setAllShowOrders'},
        //     force: false
        // }, {root: true});
        // await context.dispatch('calculateShowOrderStats', {show_order: context.getters.showOrder}).then((stats) => {
        //     return [{showOrder: context.getters.showOrder, stats: stats}];
        // }).then((all_show_orders) => {
        //     context.dispatch('uploadData', {node: 'all_show_orders', data: all_show_orders}, {root: true});
        //     context.commit('setAllShowOrders', all_show_orders);
        // });
    // },
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
    selectOption(context, payload) {
        context.commit('setShowOrder', context.getters.allShowOrders[payload.index].show_order);
        context.commit('setView', 'main');
        context.commit('setSelectedShowOrderIndex', payload.index);
    },
    viewAllShowOrders(context) {
        context.commit('setView', 'all');
    },
}

// todo: add recalculation of show order stats after each quick change calculation update
//  (or add it into the quick_change function in backend and have it also return that?)
