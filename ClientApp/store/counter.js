
const MAIN_SET_COUNTER = 'MAIN_SET_COUNTER';

const state = {
    counter: 0,
    global: 0
};

export const actions = ({
    setCounter({ dispatch, commit, getters, rootGetters }, obj) {
        // commit locally if namespaced = true
        commit(MAIN_SET_COUNTER, obj);

        // commit to the root
        //commit(MAIN_SET_COUNTER, obj, { root: true });
    },
    setGlobal: {
        root: true,
        handler ({ dispatch, commit, getters, rootGetters }, obj) {

        }
    }
});

export const mutations = ({
    [MAIN_SET_COUNTER](localState, obj) {
        state.counter = obj.counter;
    }
});

export const getters = ({
    counter(localState, getters, rootState, rootGetters) {
        return localState.counter;
    }
});

export default {
    state,
    actions,
    mutations,
    getters
};
