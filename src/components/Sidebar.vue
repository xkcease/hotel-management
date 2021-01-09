<template>
    <el-scrollbar class="sidebar">
        <el-menu
            mode="vertical"
            background-color="#1f2d3d"
            text-color="#bfcbd9"
        >
            <el-menu-item index="1">
                <h2 class="sidebar__item">
                    <svg-icon icon-class="home"></svg-icon>
                    主页
                </h2>
            </el-menu-item>
            <el-submenu index="2">
                <template #title>喵</template>
                <el-menu-item index="2-1">1</el-menu-item>
                <el-menu-item index="2-2">2</el-menu-item>
                <el-menu-item index="2-3">3</el-menu-item>
                <el-menu-item index="2-4">4</el-menu-item>
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
        font-size: 18px;
    }

    .el-menu {
        border-right: 0;
    }
}
</style>
