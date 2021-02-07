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
            state.castList = payload;
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

            const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/${payload.node}.json`);
            const responseData = await response.json();

            console.log(responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to fetch!');
            }

            context.commit(payload.mutation, responseData);
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

            const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/cast_list.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters.castList)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send!');
            }

            // add change to change log
            const currentDate = new Date().toDateString();
            const dateIndex = context.getters.changeLog.map((changeDate) => {return changeDate.date}).indexOf(currentDate);
            const changeInfo = {name: payload.dancerName, type: payload.changeType, piece: payload.piece};
            context.commit('addToChangeLog', {
                changeInfo,
                dateIndex
            });

            const response2 = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/change_log.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters.changeLog)
            });

            const responseData2 = await response2.json();

            if (!response2.ok) {
                throw new Error(responseData2.message || 'Failed to send!');
            }
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

            const response = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/cast_list.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters.castList)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to send!');
            }

            const dateIndex = context.getters.changeLog
                .map((dateChanges) => {return dateChanges.date})
                .indexOf(payload.date);
            const changeIndex = context.getters.changeLog[dateIndex].changes
                .map((change) => {return change.piece + change.type + change.name})
                .indexOf(payload.piece + payload.type + payload.dancerName);
            context.commit('removeFromChangeLog', {dateIndex, changeIndex})

            const response2 = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/change_log.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters.changeLog)
            });

            const responseData2 = await response2.json();

            if (!response2.ok) {
                throw new Error(responseData2.message || 'Failed to send!');
            }
        },
        async resetAll(context) {
            await context.dispatch('loadData', {node: 'original_cast_list', mutation: 'setCastList'});

            const response2 = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/cast_list.json`, {
                method: 'PUT',
                body: JSON.stringify(context.getters.castList)
            });

            const responseData2 = await response2.json();

            if (!response2.ok) {
                throw new Error(responseData2.message || 'Failed to send!');
            }

            context.commit('setChangeLog', null);
            const response3 = await fetch(`https://dw-casting-default-rtdb.firebaseio.com/nyc/season16/change_log.json`, {
                method: 'PUT',
                body: JSON.stringify([])
            });

            const responseData3 = await response3.json();

            if (!response3.ok) {
                throw new Error(responseData3.message || 'Failed to send!');
            }
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
        }
    }
}

// TODO: refactor to fix code duplication
