<template>
    <div class="navbar">
        <div>
            <svg-icon icon-class="hotel" class="navbar__brand"></svg-icon>
            <h2 class="navbar__title">hotel management</h2>
        </div>
        <div class="navbar__block--right">
            <el-dropdown>
                <el-badge
                    class="navbar__bell"
                    :hidden="noticeOrderCount <= 0"
                    :value="noticeTotal"
                    :is-dot="true"
                >
                    <i class="el-icon-bell"></i>
                </el-badge>
                <template #dropdown>
                    <el-dropdown-menu v-show="noticeTotal > 0">
                        <el-dropdown-item v-show="noticeOrderCount > 0">
                            <div
                                class="navbar__item"
                                @mouseleave="readOrderNotice"
                            >
                                <span>新订单</span>
                                <el-badge
                                    :hidden="noticeOrderCount <= 0"
                                    :value="noticeOrderCount"
                                ></el-badge>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                    <el-dropdown-menu v-show="noticeTotal <= 0">
                        <el-dropdown-item> 无新消息 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-dropdown trigger="click">
                <span class="navbar__name">
                    {{ username }}
                    <i class="el-icon-arrow-down"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="toModifyPassword">
                            修改密码
                        </el-dropdown-item>
                        <el-dropdown-item @click="logout"
                            >退出</el-dropdown-item
                        >
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SvgIcon from './SvgIcon.vue';
import socketIOTool from '@/utils/socketIOTool';

export default {
    components: { SvgIcon },
    name: 'Navbar',
    setup() {
        const router = useRouter();
        const store = useStore();

        const username = sessionStorage.getItem('username');

        const noticeTotal = computed(() => store.state.noticeTotal);
        const noticeOrderCount = computed(() => store.state.noticeOrderCount);

        socketIOTool.on('new-order', (socket) => {
            store.commit('increaseNoticeOrderCount', {
                count: socket.orderArray.length,
            });
        });

        const readOrderNotice = () => {
            store.commit('clearNoticeOrderCount');
        };

        const toModifyPassword = () => {
            router.push({ name: 'ModifyPassword' });
        };

        const logout = () => {
            sessionStorage.clear();
            router.push({ name: 'Login' });
        };

        return {
            username,
            noticeTotal,
            noticeOrderCount,
            readOrderNotice,
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

    .navbar__block--right {
        margin-right: 10px;
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
        margin-right: 10px;
    }

    .navbar__name {
        cursor: pointer;
    }
}

.navbar__item {
    width: 70px;
    display: flex;
    justify-content: space-between;
}
</style>
