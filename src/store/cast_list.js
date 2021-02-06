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
            ],
            changeLog: [],
            currentView: 'cast-list'
        }
    },
    mutations: {
        changeStatus(state, payload) {
            if (payload.dancerIndex >= 0) {
                state.castList[payload.pieceIndex].cast[payload.dancerIndex].status = payload.newStatus;
            } else {
                state.castList[payload.pieceIndex].cast.push({name: payload.dancerName, status: payload.newStatus})
            }
        },
        dropFromPiece(state, payload) {
            state.castList[payload.pieceIndex].cast.splice(payload.dancerIndex, 1)
        },
        addToChangeLog(state, payload) {
            if (payload.dateIndex >= 0) {
                state.changeLog[payload.dateIndex].changes.unshift(payload.changeInfo)
            } else {
                state.changeLog.unshift({date: new Date().toDateString(), changes: [payload.changeInfo]})
            }
        },
        removeFromChangeLog(state, payload) {
            state.changeLog[payload.dateIndex].changes.splice(payload.changeIndex, 1);
            if (state.changeLog[payload.dateIndex].changes.length === 0) {
                state.changeLog.splice(payload.dateIndex, 1);
            }
        },
        changeView(state) {
            if (state.currentView === 'change-log') {
                state.currentView = 'cast-list';
            } else if (state.currentView === 'cast-list') {
                state.currentView = 'change-log';
            }
        }
    },
    actions: {
        changeDancerStatus(context, payload) {
            // change status in castList
            const pieceIndex = context.getters.castList.map((piece) => {return piece.name}).indexOf(payload.piece);
            const dancerIndex = context.getters.castList[pieceIndex].cast
                .map((dancer) => {return dancer.name})
                .indexOf(payload.dancerName);

            if (payload.changeType === 'add') {
                context.commit('changeStatus', {
                    pieceIndex,
                    dancerIndex,
                    newStatus: 'cast'
                })
            } else if (payload.changeType === 'drop') {
                context.commit('dropFromPiece', {
                    pieceIndex,
                    dancerIndex
                })
            }

            // add change to change log
            const currentDate = new Date().toDateString();
            const dateIndex = context.getters.changeLog.map((changeDate) => {return changeDate.date}).indexOf(currentDate);
            const changeInfo = {name: payload.dancerName, type: payload.changeType, piece: payload.piece};
            context.commit('addToChangeLog', {
                changeInfo,
                dateIndex
            })
        },
        undoChange(context, payload) {
            const pieceIndex = context.getters.castList
                .map((piece) => {return piece.name})
                .indexOf(payload.piece);

            if (payload.type === 'add') {
                // undo adding from waitlist = put back on waitlist
                const dancerIndex = context.getters.castList[pieceIndex].cast
                    .map((dancer) => {return dancer.name})
                    .indexOf(payload.dancerName);

                context.commit('changeStatus', {
                    pieceIndex,
                    dancerIndex,
                    newStatus: 'waitlist'
                });
            } else {
                // undo dropping from piece = put back in piece (but they're not there anymore)
                context.commit('changeStatus', {
                    pieceIndex,
                    dancerIndex: -1,
                    newStatus: 'cast',
                    dancerName: payload.dancerName,

                });
            }

            const dateIndex = context.getters.changeLog
                .map((dateChanges) => {return dateChanges.date})
                .indexOf(payload.date);
            const changeIndex = context.getters.changeLog[dateIndex].changes
                .map((change) => {return change.piece + change.type + change.name})
                .indexOf(payload.piece + payload.type + payload.dancerName);
            context.commit('removeFromChangeLog', {dateIndex, changeIndex})
        },
        changeView(context) {
            context.commit('changeView');
        }
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
        },
        changeLog(state) {
            return state.changeLog;
        },
        currentView(state) {
            return state.currentView;
        }
    }
}
