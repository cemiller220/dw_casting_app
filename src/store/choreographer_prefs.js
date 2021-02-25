export default {
    namespaced: true,
    state() {
        return {
            prefsAll: [],
            currentPref: {},
            currentIndex: 0,
            // currentCast: [],
            showDropped: true
        }
    },
    mutations: {
        setPrefsAll(state, payload) {
            state.prefsAll = payload || [];
            if (payload) {
                state.currentPref = payload[state.currentIndex];
            }
        },
        setCurrentIndex(state, payload) {
            state.currentIndex = payload;
        },
        setCurrentPref(state, payload) {
            state.currentPref = payload;
        },
        // setCurrentCast(state, payload) {
        //     state.currentCast = payload;
        // },
        setShowDropped(state, payload) {
            state.showDropped = payload;
        }
    },
    actions: {
        changePref(context, payload) {
            let new_index = -1;
            if (payload.type === 'next') {
                const current_index = +context.getters.currentIndex;
                if (current_index < context.getters.prefsAll.length-1) {
                    new_index = current_index + 1;
                }
            } else if (payload.type === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    new_index = current_index - 1;
                }
            } else if (payload.type === 'jump') {
                new_index = context.getters.pieces.indexOf(payload.piece);
            }

            if (new_index !== -1) {
                const new_pref = context.getters.prefsAll[new_index];
                context.commit('setCurrentIndex', new_index);
                context.commit('setCurrentPref', new_pref);
                // context.commit('setCurrentCast', context.rootGetters['cast_list/castList'].filter(piece => piece.name === new_pref.name)[0].cast);
            }
        },
        toggleShowDropped(context) {
            context.commit('setShowDropped', !context.getters.showDropped)
        }
    },
    getters: {
        prefsAll(state) {
            return state.prefsAll;
        },
        pieces(state) {
            return state.prefsAll.map(pref => pref.name)
        },
        currentIndex(state) {
            return state.currentIndex;
        },
        currentPref(state) {
            return state.currentPref
        },
        // currentCast(state) {
        //     return state.currentCast
        // },
        showDropped(state) {
            return state.showDropped;
        },
        currentPiece(state) {
            return state.currentPref.name;
        }
    }
}
