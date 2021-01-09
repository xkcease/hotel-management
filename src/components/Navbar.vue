<template>
    <div class="navbar">
        <h2>hotel management</h2>
        <div>
            <el-badge class="navbar__bell" :is-dot="true">
                <i class="el-icon-bell"></i>
            </el-badge>
            <el-dropdown trigger="click">
                <span>
                    {{ 11 }}
                    <i class="el-icon-arrow-down"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>安全中心</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    setup() {},
};
</script>

<style lang="scss">
.navbar {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .navbar__bell {
        margin-right: 12px;
    }
}
</style>
