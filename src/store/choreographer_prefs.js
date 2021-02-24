export default {
    namespaced: true,
    state() {
        return {
            prefsAll: [],
            currentIndex: 0,
            showDropped: false,
        }
    },
    mutations: {
        setCurrentIndex(state, payload) {
            state.currentIndex = payload;
        },
        setPrefsAll(state, payload) {
            state.prefsAll = payload || [];
        },
        setShowDropped(state, payload) {
            state.showDropped = payload;
        }
    },
    actions: {
        changePref(context, payload) {
            if (payload.type === 'next') {
                const current_index = +context.getters.currentIndex;
                if (current_index < context.getters.prefsAll.length-1) {
                    context.commit('setCurrentIndex', current_index+1)
                }
            } else if (payload.type === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    context.commit('setCurrentIndex', current_index-1)
                }
            } else if (payload.type === 'jump') {
                const new_index = context.getters.pieces.indexOf(payload.piece);
                if (new_index !== -1) {
                    context.commit('setCurrentIndex', new_index);
                }
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
        showDropped(state) {
            return state.showDropped;
        }
    }
}
