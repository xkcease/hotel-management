<template>
    <div class="hall">
        <el-container>
            <el-header class="hall__header" height="50px">
                <Navbar />
            </el-header>
            <el-container>
                <el-aside class="hall__aside" width="200px">
                    <Sidebar />
                </el-aside>
                <el-main class="hall__main">
                    <el-breadcrumb
                        class="hall__breadcrumb"
                        separator-class="el-icon-arrow-right"
                    >
                        <el-breadcrumb-item
                            v-for="item in list"
                            :key="item.title"
                            :to="item.path"
                        >
                            {{ item.title }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                    <router-view v-if="isRouterAlive" />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import {
    reactive,
    toRefs,
    ref,
    watch,
    onMounted,
    nextTick,
    provide,
} from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default {
    name: 'Hall',
    components: {
        Navbar,
        Sidebar,
    },
    setup() {
        const route = useRoute();

        const breadcrumb = reactive({
            list: [],
        });

        onMounted(() => {
            route.matched.forEach((v) => {
                breadcrumb.list.push({
                    path: v.path,
                    title: v.meta.title,
                });
            });

            if (breadcrumb.list[1] && breadcrumb.list[1].name === 'Home') {
                breadcrumb.list.splice(1, 1);
            }
        });

        watch(
            () => route.matched,
            (value) => {
                breadcrumb.list = [];

                value.forEach((v) => {
                    breadcrumb.list.push({
                        path: v.path,
                        title: v.meta.title,
                    });
                });

                if (breadcrumb.list[1] && breadcrumb.list[1].name === 'Home') {
                    breadcrumb.list.splice(1, 1);
                }
            }
        );

        const isRouterAlive = ref(true);
        const reload = () => {
            isRouterAlive.value = false;
            nextTick(() => {
                isRouterAlive.value = true;
            });
        };

        provide('reload', reload);

        return {
            ...toRefs(breadcrumb),
            isRouterAlive,
        };
    },
};
</script>

<style lang="scss">
.hall {
    .hall__header {
        width: 100%;
        position: fixed;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
        z-index: 233;
    }

    .hall__aside {
        height: 100%;
        position: fixed;
        top: 50px;
        background-color: $menu-bg;
        overflow: hidden;
    }

    .hall__main {
        margin-left: 200px;
        margin-top: 50px;
    }

    .hall__breadcrumb {
        font-size: 14px;
        background-color: #fff;
    }
}
</style>
