export default {
    namespaced: true,
    state() {
        return {
            prefsAll: [],
            currentIndex: 0,
            currentPref: {}
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
    },
    actions: {
        changeDancerPref(context, payload) {
            console.log('changeDancerPref');
            console.log(payload);
            let new_index = -1;
            if (payload.type === 'next') {
                const current_index = +context.getters.currentIndex;
                console.log(current_index);
                console.log(context.getters.prefsAll.length-1);
                if (current_index < context.getters.prefsAll.length-1) {
                    new_index = current_index + 1;
                }
            } else if (payload.type === 'previous') {
                const current_index = +context.getters.currentIndex;
                if (current_index > 0) {
                    new_index = current_index - 1;
                }
            } else if (payload.type === 'jump') {
                new_index = context.getters.dancers.indexOf(payload.to);
            }

            console.log(new_index);

            if (new_index !== -1) {
                const new_pref = context.getters.prefsAll[new_index];
                context.commit('setCurrentIndex', new_index);
                context.commit('setCurrentPref', new_pref);
                // context.commit('setCurrentCast', context.rootGetters['cast_list/castList'].filter(piece => piece.name === new_pref.name)[0].cast);
            }
        },
    },
    getters: {
        dancers(state) {
            return state.prefsAll.map(pref => pref.name)
        },
        prefsAll(state) {
            return state.prefsAll;
        },
        currentPref(state) {
            return state.currentPref;
        },
        currentIndex(state) {
            return state.currentIndex;
        }
    }
}
