<template>
    <div class="navbar">
        <div>
            <svg-icon icon-class="hotel" class="navbar__brand"></svg-icon>
            <h2 class="navbar__title">hotel management</h2>
        </div>
        <div>
            <el-badge class="navbar__bell" :is-dot="true">
                <i class="el-icon-bell"></i>
            </el-badge>
            <el-dropdown trigger="click">
                <span class="navbar__name">
                    {{ username }}
                    <i class="el-icon-arrow-down"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-item @click="toModifyPassword">
                        修改密码
                    </el-dropdown-item>
                    <el-dropdown-item @click="logout">退出</el-dropdown-item>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import SvgIcon from './SvgIcon.vue';

export default {
    components: { SvgIcon },
    name: 'Navbar',
    setup() {
        const username = sessionStorage.getItem('username');
        const router = useRouter();

        const toModifyPassword = () => {
            router.push({ name: 'ModifyPassword' });
        };

        const logout = () => {
            sessionStorage.clear();
            router.push({ name: 'Login' });
        };

        return {
            username,
            toModifyPassword,
            logout,
        };
    },
};
</script>

<style lang="scss">
.navbar {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar__brand {
        width: 30px;
        height: 30px;
    }

    .navbar__title {
        display: inline-block;
        font-size: 21px;
        color: $theme-color;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
            Microsoft YaHei, Arial, sans-serif;
        padding-left: 12px;
    }

    .navbar__bell {
        margin-right: 12px;
    }

    .navbar__name {
        cursor: pointer;
    }
}
</style>
