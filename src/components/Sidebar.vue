<template>
    <el-scrollbar class="sidebar">
        <el-menu
            mode="vertical"
            background-color="#1f2d3d"
            text-color="#bfcbd9"
            default-active="1"
        >
            <el-menu-item index="1">
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
            <el-submenu index="3">
                <template #title
                    ><h2 class="sidebar__item">房间管理</h2></template
                >
                <el-menu-item index="3-1">查看房间</el-menu-item>
                <el-menu-item index="3-2">添加新房间</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template #title
                    ><h2 class="sidebar__item">账号管理</h2></template
                >
                <el-menu-item index="4-1">查看账号</el-menu-item>
                <el-menu-item index="4-2">注册新账号</el-menu-item>
            </el-submenu>
        </el-menu>
    </el-scrollbar>
</template>

<script>
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';

export default {
    components: { SvgIcon },
    name: 'Sidebar',
    setup() {
        const activeIndex = ref('2-1');

        return {
            activeIndex,
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
