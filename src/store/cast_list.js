export default {
    namespaced: true,
    state() {
        return {
            castList: [
                {
                    name: 'Domino',
                    choreographer: 'Claire Miller',
                    time: {day: 'Sunday', time: 6},
                    cast: [
                        {name: 'name1', status: 'cast'},
                        {name: 'name2', status: 'cast'},
                        {name: 'name3', status: 'waitlist'}]
                },
                {
                    name: 'As The Water',
                    choreographer: 'Steph Lacy',
                    time: {day: 'Tuesday', time: 9},
                    cast: [
                        {name: 'name4', status: 'cast'},
                        {name: 'name5', status: 'cast'},
                        {name: 'name3', status: 'cast'}]
                },
                {
                    name: 'The Chain',
                    choreographer: 'Alex Lorditch',
                    time: {day: 'Sunday', time: 7},
                    cast: [
                        {name: 'name12', status: 'cast'},
                        {name: 'name5', status: 'waitlist'},
                        {name: 'name31', status: 'waitlist'}]
                },
                {
                    name: 'Love So Soft',
                    choreographer: 'Lissy Rosner',
                    time: {day: 'Sunday', time: 8},
                    cast: [
                        {name: 'name31', status: 'cast'},
                        {name: 'name12', status: 'cast'},
                        {name: 'name4', status: 'cast'}]
                },
                {
                    name: 'Sing',
                    choreographer: 'Lisa Feit',
                    time: {day: 'Tuesday', time: 9},
                    cast: [
                        {name: 'name17', status: 'cast'},
                        {name: 'name20', status: 'cast'},
                        {name: 'name30', status: 'waitlist'}]
                },
                {
                    name: 'Bad Guy',
                    choreographer: 'Morgan Markowicz',
                    time: {day: 'Thursday', time: 8},
                    cast: [
                        {name: 'name40', status: 'cast'},
                        {name: 'name17', status: 'cast'},
                        {name: 'name30', status: 'waitlist'}]
                }
            ]
        }
    },
    mutations: {

    },
    actions: {

    },
    getters: {
        castList(state) {
            return state.castList;
        },
        dancers(state) {
            const dancer_list = [];
            for (let dance of state.castList) {
                for (let dancer of dance.cast) {
                    if (dancer_list.indexOf(dancer) === -1) {
                        dancer_list.push(dancer);
                    }
                }
            }
            return dancer_list;
        },
        pieces(state) {
            const piece_list = [];
            for (let piece of state.castList) {
                piece_list.push(piece.name);
            }
            return piece_list;
        }
    }
}
