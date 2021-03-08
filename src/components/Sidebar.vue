<template>
    <el-scrollbar class="sidebar">
        <el-menu
            mode="vertical"
            background-color="#1f2d3d"
            text-color="#bfcbd9"
            default-active="1"
            :router="true"
            :unique-opened="true"
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
                <el-menu-item index="reservedOrder">未入住</el-menu-item>
                <el-menu-item index="occupieddOrder">已入住</el-menu-item>
                <el-menu-item index="completedOrder">已退房</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template #title
                    ><h2 class="sidebar__item">房间管理</h2></template
                >
                <el-menu-item index="roomList">查看房间</el-menu-item>
                <el-menu-item index="addRoom" v-if="permission <= 1">
                    添加新房间
                </el-menu-item>
                <el-menu-item index="modifyPrice" v-if="permission === 0">
                    修改价格
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-if="permission <= 1">
                <template #title>
                    <h2 class="sidebar__item">小程序</h2>
                </template>
                <el-menu-item index="hotelIntro">酒店简介</el-menu-item>
                <el-menu-item index="roomIntro"> 房间描述 </el-menu-item>
            </el-submenu>
            <el-submenu index="5" v-if="permission === 0">
                <template #title
                    ><h2 class="sidebar__item">账号管理</h2></template
                >
                <el-menu-item index="adminList">查看用户</el-menu-item>
                <el-menu-item index="addAdmin">注册新用户</el-menu-item>
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
