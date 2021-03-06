import { createStore } from 'vuex';
import { getAdminInfoRequest } from '../utils/adminRequest';

const store = createStore({
    state: {
        permission: null,
        noticeTotal: 0,
        noticeOrderCount: 0,
    },
    mutations: {
        increaseNoticeOrderCount(state, payload) {
            state.noticeOrderCount += payload.count;
            state.noticeTotal += payload.count;
        },
        decreaseNoticeOrderCount(state, payload) {
            state.noticeOrderCount -= payload.count;
            state.noticeTotal -= payload.count;
        },
        clearNoticeOrderCount(state) {
            state.noticeTotal -= state.noticeOrderCount;
            state.noticeOrderCount = 0;
        },
    },
    actions: {
        getPermission(context) {
            return new Promise((resolve, reject) => {
                let username = sessionStorage.getItem('username');

                getAdminInfoRequest(username).then((res) => {
                    if (res.state) {
                        context.state.permission = res.permission;
                        resolve(res.permission);
                    } else {
                        console.log(res.msg);
                        reject(res.msg);
                    }
                });
            });
        },
    },
    modules: {},
});

export default store;
