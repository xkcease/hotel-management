import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        alias: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "login" */ '../views/Login'),
    },
    {
        path: '/hall',
        name: 'Hall',
        component: () => import(/* webpackChunkName: "hall" */ '../views/Hall'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () =>
                    import(/* webpackChunkName: "hall" */ '../views/hall/Home'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
