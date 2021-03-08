import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import loading from '@/utils/loading';

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
        path: 'reservedOrder',
        name: 'ReservedOrder',
        meta: {
            title: '未入住',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/ReservedOrder'
            ),
    },
    {
        path: 'occupieddOrder',
        name: 'OccupiedOrder',
        meta: {
            title: '已入住',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/OccupiedOrder'
            ),
    },
    {
        path: 'completedOrder',
        name: 'CompletedOrder',
        meta: {
            title: '已退房',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/CompletedOrder'
            ),
    },
    {
        path: 'modifyOrder',
        name: 'ModifyOrder',
        meta: {
            title: '修改订单',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/ModifyOrder'
            ),
    },
    {
        path: 'checkIn',
        name: 'CheckIn',
        meta: {
            title: '办理入住',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/CheckIn'
            ),
    },
    {
        path: 'checkOut',
        name: 'CheckOut',
        meta: {
            title: '办理退房',
            role: [0, 1, 2],
        },
        component: () =>
            import(
                /* webpackChunkName: "order" */ '../views/hall/order/CheckOut'
            ),
    },
    {
        path: 'roomList',
        name: 'RoomList',
        meta: {
            title: '房间列表',
            role: [0, 1, 2],
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
        path: 'modifyRoom',
        name: 'ModifyRoom',
        meta: {
            title: '更改房间',
            role: [0, 1],
        },
        component: () =>
            import(
                /* webpackChunkName: "room" */ '../views/hall/room/ModifyRoom'
            ),
    },
    {
        path: 'modifyPrice',
        name: 'ModifyPrice',
        meta: {
            title: '修改价格',
            role: [0, 1],
        },
        component: () =>
            import(
                /* webpackChunkName: "room" */ '../views/hall/room/ModifyPrice'
            ),
    },
    {
        path: 'hotelIntro',
        name: 'HotelIntro',
        meta: {
            title: '酒店简介',
            role: [0, 1],
        },
        component: () =>
            import(
                /* webpackChunkName: "intro" */ '../views/hall/intro/HotelIntro'
            ),
    },
    {
        path: 'roomIntro',
        name: 'RoomIntro',
        meta: {
            title: '房间描述',
            role: [0, 1],
        },
        component: () =>
            import(
                /* webpackChunkName: "intro" */ '../views/hall/intro/RoomIntro'
            ),
    },
    {
        path: 'adminList',
        name: 'AdminList',
        meta: {
            title: '用户列表',
            role: [0],
        },
        component: () =>
            import(
                /* webpackChunkName: "admin" */ '../views/hall/admin/AdminList'
            ),
    },
    {
        path: 'addAdmin',
        name: 'AddAdmin',
        meta: {
            title: '注册新用户',
            role: [0],
        },
        component: () =>
            import(
                /* webpackChunkName: "admin" */ '../views/hall/admin/AddAdmin'
            ),
    },
    { path: '/:pathMatch(.*)*', redirect: { name: '404' }, hidden: true },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

let hasPermission = false;
function verifyPermission(route, permission) {
    if (route.meta && route.meta.role) {
        return route.meta.role.some(role => permission <= role);
    }
    return true;
}

router.beforeEach(async (to, from, next) => {
    loading.close();

    const token = sessionStorage.getItem('token');

    if (to.name !== 'Login') {
        if (!token) {
            console.log('not logon');
            return next({ name: 'Login' });
        }

        let permission = await store.dispatch('getPermission');
        if (!hasPermission) {
            for (let route of asyncRoutes) {
                if (verifyPermission(route, permission)) {
                    router.addRoute('Hall', route);
                }
            }
            hasPermission = true;
            return next({ ...to, replace: true });
        }
    } else {
        if (to.name === 'Login' && token) {
            return next({ name: 'Home' });
        } else {
            hasPermission = false;
        }
    }
    next();
});

export default router;
