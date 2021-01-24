<template>
    <el-scrollbar class="sidebar">
        <el-menu
            mode="vertical"
            background-color="#1f2d3d"
            text-color="#bfcbd9"
            default-active="1"
            :router="true"
        >
            <el-menu-item index="home">
                <h2 class="sidebar__item">
                    <svg-icon icon-class="home"></svg-icon>
                    主页
                </h2>
            </el-menu-item>
            <el-submenu index="2">
                <template #title>
                    <h2 class="sidebar__item">订单管理</h2>
                </template>
                <el-menu-item index="2-1">未入住</el-menu-item>
                <el-menu-item index="2-2">已入住</el-menu-item>
                <el-menu-item index="2-3">已退房</el-menu-item>
                <el-menu-item index="2-4">全部</el-menu-item>
            </el-submenu>
            <el-submenu index="3" v-if="permission <= 1">
                <template #title
                    ><h2 class="sidebar__item">房间管理</h2></template
                >
                <el-menu-item index="roomList">查看房间</el-menu-item>
                <el-menu-item index="addRoom">添加新房间</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-if="permission === 0">
                <template #title
                    ><h2 class="sidebar__item">账号管理</h2></template
                >
                <el-menu-item index="userList">查看用户</el-menu-item>
                <el-menu-item index="addUser">注册新用户</el-menu-item>
            </el-submenu>
        </el-menu>
    </el-scrollbar>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import SvgIcon from './SvgIcon.vue';

export default {
    components: { SvgIcon },
    name: 'Sidebar',
    setup() {
        const store = useStore();

        const activeIndex = ref('home');

        const permission = store.state.permission;

        return {
            activeIndex,
            permission,
        };
    },
};
</script>

<style lang="scss">
.sidebar {
    .sidebar__item {
        font-size: 16px;
    }

    .el-menu {
        border-right: 0;
    }
}
</style>
