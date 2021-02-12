export default {
    namespaced: true,
    state() {
        return {
            castList: [],
            changeLog: []
        }
    },
    mutations: {
        setCastList(state, payload) {
            state.castList = payload || [];
        },
        setChangeLog(state, payload) {
            state.changeLog = payload || [];
        },
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
        }
    },
    actions: {
        async loadData(context, payload) {
            // if (!payload.forceRefresh && !context.getters.shouldUpdate) {
            //     return
            // }
            const city = context.rootGetters.city;
            const season = context.rootGetters.season;

            const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/${city}/season${season}/${payload.node}.json`);
            const responseData = await response.json();

            console.log('load ' + payload.node + ' city ' + city + ' season ' + season);
            console.log(responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch!');
            }

            context.commit(payload.mutation, responseData);
        },
        async uploadData(context, payload) {
            const city = context.rootGetters.city;
            const season = context.rootGetters.season;

            const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/${city}/season${season}/${payload.node}.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters[payload.getter])
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send!');
            }
        },
        async changeDancerStatus(context, payload) {
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

            // upload here...
            await context.dispatch('uploadData', {node: 'cast_list', getter: 'castList'});

            // add change to change log
            const currentDate = new Date().toDateString();
            const dateIndex = context.getters.changeLog.map((changeDate) => {return changeDate.date}).indexOf(currentDate);
            const changeInfo = {name: payload.dancerName, type: payload.changeType, piece: payload.piece};
            context.commit('addToChangeLog', {
                changeInfo,
                dateIndex
            });

            await context.dispatch('uploadData', {node: 'change_log', getter: 'changeLog'});
        },
        async undoChange(context, payload) {
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

            await context.dispatch('uploadData', {node: 'cast_list', getter: 'castList'});

            const dateIndex = context.getters.changeLog
                .map((dateChanges) => {return dateChanges.date})
                .indexOf(payload.date);
            const changeIndex = context.getters.changeLog[dateIndex].changes
                .map((change) => {return change.piece + change.type + change.name})
                .indexOf(payload.piece + payload.type + payload.dancerName);
            context.commit('removeFromChangeLog', {dateIndex, changeIndex});

            await context.dispatch('uploadData', {node: 'change_log', getter: 'changeLog'});
        },
        async resetAll(context) {
            await context.dispatch('loadData', {node: 'original_cast_list', mutation: 'setCastList'});

            await context.dispatch('uploadData', {node: 'cast_list', getter: 'castList'});

            context.commit('setChangeLog', null);
            await context.dispatch('uploadData', {node: 'change_log', getter: 'changeLog'});
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
                    if (dancer_list.indexOf(dancer.name) === -1) {
                        dancer_list.push(dancer.name);
                    }
                }
            }
            return dancer_list.sort();
        },
        pieces(state) {
            const piece_list = [];
            for (let piece of state.castList) {
                piece_list.push(piece.name);
            }
            return piece_list.sort();
        },
        changeLog(state) {
            return state.changeLog;
        }
    }
}
