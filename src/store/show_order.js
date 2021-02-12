export default {
    namespaced: true,
    state() {
        return {
            show_order: ['dance1', 'dance2', 'dance3'],
            selected_piece: null,
            quick_changes: {
                'dance1':
                    {
                        into: { 0: ['a', 'b'], 1: [], 2: ['a', 'b', 'c'] },
                        after: { 0: ['a'], 1: ['b', 'c'], 2: ['c'] }
                    },
                'dance2':
                    {
                        into: { 0: ['d'], 1: ['e', 'f', 'g', 'h'], 2: ['b', 'c'] },
                        after: { 0: ['a', 'd'], 1: ['c', 'h'], 2: [] }
                    },
                'dance3':
                    {
                        into: { 0: [], 1: ['x', 'y'], 2: ['a', 'b', 'c', 'x', 'y'] },
                        after: { 0: [], 1: ['b', 'c'], 2: ['c', 'e'] }
                    }
            },
            current_quick_changes: {}
        }
    },
    mutations: {
        selectPiece(state, payload) {
            if (state.selected_piece && payload.piece === state.selected_piece) {
                state.selected_piece = null;
                state.current_quick_changes = {};
            } else {
                state.selected_piece = payload.piece;
                state.current_quick_changes = state.quick_changes[payload.piece]
            }

        }
    },
    actions: {
        selectPiece(context, payload) {
            context.commit('selectPiece', payload)
        }
    },
    getters: {
        show_order(state) {
            return state.show_order;
        },
        show_order_exists(state) {
            return state.show_order && state.show_order.length !== 0;
        },
        selected_piece(state) {
            return state.selected_piece;
        },
        current_quick_changes(state) {
            return state.current_quick_changes;
        }
    }
}
