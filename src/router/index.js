import { createRouter, createWebHistory } from 'vue-router';

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
        component: () => import(/* webpackChunkName: "hall" */ '../views/Hall'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () =>
                    import(
                        /* webpackChunkName: "navbar" */ '../views/hall/Home'
                    ),
            },
            {
                path: 'modifyPassword',
                name: 'ModifyPassword',
                component: () =>
                    import(
                        /* webpackChunkName: "navbar" */ '../views/hall/ModifyPassword'
                    ),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login') {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.log('not logon');
            router.push('Login');
        }
    }

    next();
});

export default router;
