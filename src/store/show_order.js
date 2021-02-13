export default {
    namespaced: true,
    state() {
        return {
            showOrder: ['dance1', 'dance2', 'dance3'],
            selectedPiece: null,
            quickChanges: {
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
            currentQuickChanges: {}
        }
    },
    mutations: {
        selectPiece(state, payload) {
            if (state.selectedPiece && payload.piece === state.selectedPiece) {
                state.selectedPiece = null;
                state.currentQuickChanges = {};
            } else {
                state.selectedPiece = payload.piece;
                state.currentQuickChanges = state.quickChanges[payload.piece]
            }

        }
    },
    actions: {
        selectPiece(context, payload) {
            context.commit('selectPiece', payload)
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
        }
    }
}
