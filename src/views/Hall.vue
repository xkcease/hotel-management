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
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default {
    name: 'Hall',
    components: {
        Navbar,
        Sidebar,
    },
};
</script>

<style lang="scss">
.hall {
    .hall__header {
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    }

    .hall__aside {
        height: 100%;
        position: fixed;
        background-color: $menu-bg;
        overflow: hidden;
    }

    .hall__main {
        margin-left: 200px;
    }
}
</style>
