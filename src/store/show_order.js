import ShowOrderActions from './show_order_actions'

export default {
    namespaced: true,
    state() {
        return {
            view: 'all',
            allShowOrders: [],
            dancerOverlap: {},
            allowedNext: {},
            showOrder: [],
            selectedIndex: null,
            selectedShowOrderIndex: null,
            currentQuickChanges: {},
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
        setAllShowOrders(state, payload) {
            state.allShowOrders = payload || [];
        },
        setSelectedIndex(state, payload) {
            state.selectedIndex = payload;
        },
        setSelectedShowOrderIndex(state, payload) {
            state.selectedShowOrderIndex = payload;
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
    actions: ShowOrderActions,
    getters: {
        view(state) {
            return state.view;
        },
        allShowOrders(state) {
            return state.allShowOrders;
        },
        showOrder(state) {
            return state.showOrder;
        },
        selectedIndex(state) {
            return state.selectedIndex;
        },
        selectedShowOrderIndex(state) {
            return state.selectedShowOrderIndex;
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

