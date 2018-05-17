import Vue from 'vue';
import Vuex from 'vuex';
import { modules } from './store';

Vue.use(Vuex);

export default function configureStore(history, initialState = {}) {
    const windowIfDefined = typeof window === 'undefined' ? null : window;

    const store = new Vuex.Store({
        state: initialState,
        modules
    });

    if (module.hot) {
        module.hot.accept(['./store'], () => {
            // Get the updated reducers
            const nextRootReducer = require('./store');
            const { mutations, actions } = buildRootStore(nextRootReducer);

            store.hotUpdate({
                mutations: mutations
            });
        })
    }

    return store;
}
