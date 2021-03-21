<template>
    <div class="admin-list">
        <SearchFilter
            v-model="conditions"
            :searchOptions="searchOptions"
            permission
            search
        />
        <div class="admin-list__table">
            <el-table :data="list" stripe border>
                <el-table-column
                    label="Id"
                    prop="aid"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="用户名"
                    prop="username"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="权限"
                    prop="text"
                    align="center"
                    :sort-method="sortPermission"
                    sortable
                ></el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template #default="scope">
                        <div class="l-flex l-flex__justify--around">
                            <el-dropdown size="small" trigger="click">
                                <el-button size="mini"> 修改权限 </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                            @click="
                                                modifyPermission(scope.row, 2)
                                            "
                                        >
                                            普通管理员
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            @click="
                                                modifyPermission(scope.row, 1)
                                            "
                                        >
                                            高级管理员
                                        </el-dropdown-item>
                                        <el-dropdown-item
                                            @click="
                                                modifyPermission(scope.row, 0)
                                            "
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
    </div>
</template>

<script>
import { reactive, toRefs, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import {
    getAdminsRequest,
    updatePermissionRequest,
    deleteAdminRequest,
} from '@/utils/adminRequest';
import loading from '@/utils/loading';
import SearchFilter from '@/components/SearchFilter';

export default {
    name: 'AdminList',
    components: {
        SearchFilter,
    },
    setup() {
        const reload = inject('reload');

        const searchOptions = [
            {
                label: '管理员编号',
                value: 'aid',
            },
            {
                label: '用户名',
                value: 'username',
            },
        ];

        const conditionsData = reactive({
            conditions: [],
        });

        // 查询
        const search = () => {
            let list = tableData.origin;

            for (let condition of conditionsData.conditions) {
                if (condition.key === 'permission') {
                    list = list.filter((admin) => {
                        return admin.permission === condition.value;
                    });
                }

                if (condition.key === 'search') {
                    const keywordReg = new RegExp(condition.value);

                    list = list.filter((admin) => {
                        return keywordReg.test(admin[condition.searchKey]);
                    });
                }
            }
            tableData.list = list;
        };

        watch(
            () => conditionsData.conditions,
            () => {
                search();
            }
        );

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

        return {
            ...toRefs(conditionsData),
            searchOptions,
            search,
            ...toRefs(tableData),
            sortPermission,
            modifyPermission,
            deleteAdmin,
        };
    },
};
</script>

<style lang="scss">
.admin-list {
    margin: 30px 50px;
    padding: 0 20px;

    .admin-list__table {
        border: 1px solid #ebeef5;
        margin-top: 10px;
    }
}
</style>
