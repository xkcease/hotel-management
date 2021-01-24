import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "login" */ '../views/Login'),
    },
    {
        path: '/',
        redirect: '/home',
        name: 'Hall',
        meta: {
            title: '首页',
        },
        component: () => import(/* webpackChunkName: "hall" */ '../views/Hall'),
        children: [
            {
                path: 'home',
                name: 'Home',
                meta: {
                    title: '首页',
                },
                component: () =>
                    import(/* webpackChunkName: "hall" */ '../views/hall/Home'),
            },
            {
                path: 'modifyPassword',
                name: 'ModifyPassword',
                meta: {
                    title: '修改密码',
                },
                component: () =>
                    import(
                        /* webpackChunkName: "navbar" */ '../views/hall/ModifyPassword'
                    ),
            },
        ],
    },
    {
        path: '/404',
        name: '404',
        hidden: true,
        component: () => import(/* webpackChunkName: "404" */ '../views/404'),
    },
];

const asyncRoutes = [
    {
        path: 'roomList',
        name: 'RoomList',
        meta: {
            title: '房间列表',
            role: [0, 1],
        },
        component: () =>
            import(
                /* webpackChunkName: "room" */ '../views/hall/room/RoomList'
            ),
    },
    {
        path: 'addRoom',
        name: 'AddRoom',
        meta: {
            title: '添加新房间',
            role: [0, 1],
        },
        component: () =>
            import(/* webpackChunkName: "room" */ '../views/hall/room/AddRoom'),
    },
    {
        path: 'userList',
        name: 'UserList',
        meta: {
            title: '用户列表',
            role: [0],
        },
        component: () =>
            import(
                /* webpackChunkName: "user" */ '../views/hall/user/UserList'
            ),
    },
    {
        path: 'addUser',
        name: 'AddUser',
        meta: {
            title: '注册新用户',
            role: [0],
        },
        component: () =>
            import(/* webpackChunkName: "user" */ '../views/hall/user/AddUser'),
    },
    { path: '/:pathMatch(.*)*', redirect: { name: '404' }, hidden: true },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

let hasPermission = false;

router.beforeEach(async (to, from, next) => {
    const token = sessionStorage.getItem('token');

    if (to.name !== 'Login') {
        if (!token) {
            console.log('not logon');
            return next({ name: 'Login' });
        }

        let permission = await store.dispatch('getPermission');
        if (!permission && !hasPermission) {
            for (let route of asyncRoutes) {
                router.addRoute('Hall', route);
            }
            hasPermission = true;
            return next({ ...to, replace: true });
        }
    } else {
        if (to.name === 'Login' && token) {
            return next({ name: 'Home' });
        }
    }
    console.log(routes);
    next();
});

export default router;
