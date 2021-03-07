export default {
    // calculate and set dancer overlap and allowed next
    async calculateQuickChanges(context, payload) {
        // check if quick changes exist and if they need to be updated
        // context.dispatch('loadData', {node: 'update_times', mutation: 'setUpdateTimes'}, {root: true})
        //     .then(() => {
        //         const update_times = context.rootGetters.updateTimes;

                // if ((payload.force) || (!update_times) || (Object.keys(update_times).indexOf('quick_change_calc') === -1) || (Object.keys(update_times).indexOf('cast_list') === -1) || (update_times.quick_change_calc < update_times.cast_list)) {

                    // cast has changed, recalculate
        console.log(payload);
        context.dispatch('loadData', {node: 'cast_list', mutation: 'cast_list/setCastList'}, {root: true}).then(() => {
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

            return {dancer_overlap: dancer_overlap, allowed_next: allowed_next}
        }).then((data) => {
            context.dispatch('uploadData', {node: 'dancer_overlap', data: data.dancer_overlap}, {root: true});
            context.dispatch('uploadData', {node: 'allowed_next', data: data.allowed_next}, {root: true});

            // context.dispatch('uploadData', {node: 'update_times/quick_change_calc', data: Date.now()}, {root: true});

            context.commit('setDancerOverlap', data.dancer_overlap);
            context.commit('setAllowedNext', data.allowed_next);
        }).then(() => {
            context.dispatch('loadData', {node: 'show_order', mutation: 'show_order/setAllShowOrders'}, {root: true}).then(() => {
                const all_show_orders = context.getters.allShowOrders;
                for (let ind=0; ind<all_show_orders.length; ind++) {
                    context.dispatch('calculateShowOrderStats', {show_order: all_show_orders[ind].showOrder}).then((stats) => {
                        all_show_orders[ind].stats = stats;
                    });
                }
                return all_show_orders;
            }).then((all_show_orders) => {
                context.dispatch('uploadData', {node: 'show_order', data: all_show_orders}, {root: true});
                context.commit('setAllShowOrders', all_show_orders);
            })
        })
                // } else {
                //     // no new updates, so just load
                //     context.dispatch('loadData', {node: 'dancer_overlap', mutation: 'show_order/setDancerOverlap'}, {root: true});
                //     context.dispatch('loadData', {node: 'allowed_next', mutation: 'show_order/setAllowedNext'}, {root: true});
                // }
            // })
    },
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
            allowed_dances = context.getters.pieces;
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
        const remaining_pieces = context.getters.pieces.filter(piece => !current_show_order.includes(piece));

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
        context.dispatch('calculateQuickChanges', {force: false});
    },
    editShowOrder(context) {
        // context.commit('setCurrentShowOrder', context.getters.showOrder);
        context.commit('setView', 'edit');
        context.commit('setSelectedIndex', null);
        context.dispatch('calculateQuickChanges', {force: false});
    },
    saveShowOrder(context) {
        context.commit('setView', 'main');
        context.commit('setSelectedIndex', null);
        context.dispatch('calculateShowOrderStats', {show_order: context.getters.showOrder}).then((stats) => {
            let current_show_orders = context.getters.allShowOrders;
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
            context.commit('setSelectedShowOrderIndex', current_show_orders.length-1);
        });

    },
    deleteShowOrder(context) {
        context.commit('setView', 'all');
        context.commit('setSelectedIndex', null);

        context.getters.allShowOrders.splice(context.getters.selectedShowOrderIndex, 1);
        context.dispatch('uploadData',
            {
                node: 'show_order',
                data: context.getters.allShowOrders
            },
            {root: true}
        );
        context.commit('setSelectedShowOrderIndex', null);
    },
    async resetAll(context) {
        await context.dispatch('loadData', {node: 'real_show_order', mutation: 'show_order/setShowOrder'}, {root: true});
        await context.dispatch('calculateQuickChanges', {force: false});
        await context.dispatch('calculateShowOrderStats', {show_order: context.getters.showOrder}).then((stats) => {
            return [{showOrder: context.getters.showOrder, stats: stats}];
        }).then((all_show_orders) => {
            context.dispatch('uploadData', {node: 'show_order', data: all_show_orders}, {root: true});
            context.commit('setAllShowOrders', all_show_orders);
        });
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
        let num_back_to_back = 0;
        let num_one_between = 0;
        let num_two_between = 0;
        for (let currentIndex=0; currentIndex<show_order.length; currentIndex++) {
            if (show_order[currentIndex] !== 'INTERMISSION' && show_order[currentIndex] !== '') {
                await context.dispatch('getQuickChanges', {
                    currentIndex: currentIndex,
                    currentPiece: show_order[currentIndex],
                    showOrder: show_order
                }).then((quick_changes) => {
                    num_back_to_back += quick_changes['after'][0].dancers.length;
                    num_one_between += quick_changes['after'][1].dancers.length;
                    num_two_between += quick_changes['after'][2].dancers.length;
                })
            }
        }

        return {num_back_to_back, num_one_between, num_two_between}
    },
    selectOption(context, payload) {
        context.commit('setShowOrder', context.getters.allShowOrders[payload.index].showOrder);
        context.commit('setView', 'main');
        context.commit('setSelectedShowOrderIndex', payload.index);
    },
    viewAllShowOrders(context) {
        context.commit('setView', 'all');
    },
}

