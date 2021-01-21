import { createStore } from 'vuex';

const store = createStore({
    state: {
        permission: -1,
        loading: null,
    },
    mutations: {
        setPermission(state, payload) {
            state.permission = payload.permission;
        },
        setLoading(state, payload) {
            state.loading = payload.loading;
        }
    },
    actions: {},
    modules: {},
});

export default store;
