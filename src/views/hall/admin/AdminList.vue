<template>
    <div class="admin-list">
        <el-table :data="list">
            <el-table-column label="Id" prop="aid" sortable></el-table-column>
            <el-table-column
                label="用户名"
                prop="username"
                sortable
            ></el-table-column>
            <el-table-column
                label="权限"
                prop="text"
                :sort-method="sortPermission"
                sortable
            ></el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input
                        size="small"
                        placeholder="输入关键字搜索"
                        v-model="keyword"
                        @input="search"
                    />
                </template>
                <template #default="scope">
                    <div class="l-flex l-flex__justify--between">
                        <el-dropdown size="small" trigger="click">
                            <el-button size="mini"> 修改权限 </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        @click="modifyPermission(scope.row, 2)"
                                    >
                                        普通管理员
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        @click="modifyPermission(scope.row, 1)"
                                    >
                                        高级管理员
                                    </el-dropdown-item>
                                    <el-dropdown-item
                                        @click="modifyPermission(scope.row, 0)"
                                    >
                                        超级管理员
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <el-popconfirm
                            icon="el-icon-info"
                            iconColor="red"
                            confirmButtonText="是"
                            cancelButtonText="否"
                            title="确定要删除吗？"
                            @confirm="deleteAdmin(scope.row)"
                        >
                            <template #reference>
                                <el-button size="mini" type="danger">
                                    删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { reactive, toRefs, ref, inject } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getAdminsRequest,
    updatePermissionRequest,
    deleteAdminRequest,
} from '@/utils/adminRequest';
import loading from '@/utils/loading';

export default {
    name: 'AdminList',
    setup() {
        const reload = inject('reload');

        const tableData = reactive({
            origin: [],
            list: [],
        });
        const text = ['超级管理员', '高级管理员', '普通管理员'];

        loading.start();

        // 获取用户
        getAdminsRequest()
            .then((res) => {
                for (let admin of res) {
                    admin.text = text[admin.permission];
                }
                tableData.origin = res;
                tableData.list = res;

                loading.close();
            })
            .catch((err) => {
                console.log(err);
                loading.close();
            });

        const sortPermission = (a, b) => {
            return a.permission - b.permission;
        };

        // 修改权限
        const modifyPermission = (admin, permission) => {
            loading.start();

            updatePermissionRequest(admin.username, permission)
                .then((res) => {
                    if (res.state) {
                        admin.permission = permission;
                        admin.text = text[permission];
                        tableData.origin = tableData.list;
                        ElMessage.success(res.msg);
                    } else {
                        ElMessage.error(res.msg);
                    }

                    loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    ElMessage.error('fail');
                    loading.close();
                });
        };

        // 删除用户
        const deleteAdmin = (admin) => {
            loading.start();

            deleteAdminRequest(admin.username)
                .then((res) => {
                    if (res.state) {
                        let index = tableData.list.findIndex((value) => {
                            return admin.username === value.username;
                        });
                        tableData.list.splice(index, 1);
                        tableData.origin = tableData.list;
                        ElMessage.success(res.msg);
                        reload();
                    } else {
                        ElMessage.error(res.msg);
                    }

                    loading.close();
                })

                .catch((err) => {
                    console.log(err);
                    ElMessage.error('fail');
                    loading.close();
                });
        };

        // 搜索
        let keyword = ref('');
        const search = () => {
            const aidReg = /^\d+$/;
            const usernameReg = /^[0-9a-zA-z]+$/;
            const textReg = /^[\u4e00-\u9fa5]+$/;
            const keywordReg = new RegExp(keyword.value);

            const searchArray = [];
            let searchKey = '';

            if (aidReg.test(keyword.value)) {
                searchKey = 'aid';
            } else if (usernameReg.test(keyword.value)) {
                searchKey = 'username';
            } else if (textReg.test(keyword.value)) {
                searchKey = 'text';
            }

            for (let admin of tableData.origin) {
                if (keywordReg.test(admin[searchKey])) {
                    searchArray.push(admin);
                }
            }

            tableData.list = searchArray;
        };

        return {
            ...toRefs(tableData),
            sortPermission,
            modifyPermission,
            deleteAdmin,
            keyword,
            search,
        };
    },
};
</script>

<style lang="scss">
.admin-list {
    margin: 30px 50px;
    border: 1px solid #ebeef5;
    padding: 0 20px;
}
</style>
