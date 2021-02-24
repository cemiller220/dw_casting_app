export default {
    namespaced: true,
    state() {
        return {
            prefsAll: [
                {
                    name: 'dance1',
                    choreographer: 'firstName lastName',
                    prefs: {
                        favorites: ['dancer1', 'dancer2'],
                        alternates: ['dancer3', 'dancer4']
                    }
                },
                {
                    name: 'dance2',
                    choreographer: 'firstName2 lastName2',
                    prefs: {
                        favorites: ['dancer13', 'dancer22'],
                        alternates: ['dancer36', 'dancer44']
                    }
                }
            ],
            currentIndex: 0
        }
    },
    mutations: {
        setCurrentIndex(state, payload) {
            state.currentIndex = payload;
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
        }
    }
}
