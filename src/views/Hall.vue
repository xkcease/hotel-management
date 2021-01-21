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
import { onBeforeUpdate } from 'vue';
import { useStore } from 'vuex';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUserInfoRequest } from '../utils/request';
import { ElLoading } from 'element-plus';

export default {
    name: 'Hall',
    components: {
        Navbar,
        Sidebar,
    },
    setup() {
        const store = useStore();

        // 加载中
        onBeforeUpdate(() => {
            let loading = ElLoading.service({ target: '.hall__main' });
            store.commit('setLoading', { loading });
        });

        let username = sessionStorage.getItem('username');

        getUserInfoRequest(username).then((res) => {
            if (res.state) {
                store.commit('setPermission', { permission: res.permission });
                store.state.loading.close();
            } else {
                console.log(res.msg);
            }
        });
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
