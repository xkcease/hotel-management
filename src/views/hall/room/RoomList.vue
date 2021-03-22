<template>
    <div class="room-list">
        <SearchFilter
            v-model="conditions"
            :searchOptions="searchOptions"
            type
            state
            shower
            tv
            search
        />
        <div class="room-list__table">
            <el-table :data="list" :default-sort="defaultSort" stripe border>
                <el-table-column
                    label="房号"
                    prop="number"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="类型"
                    prop="typeText"
                    align="center"
                    :sort-method="sortType"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="浴室"
                    prop="showerText"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="电视"
                    prop="tvText"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="其他"
                    prop="extra"
                    align="center"
                ></el-table-column>
                <el-table-column label="房间状态" align="center">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.state ? 'danger' : 'success'"
                            effect="dark"
                        >
                            {{ scope.row.stateText }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template #default="scope">
                        <div class="l-flex l-flex__justify--between">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="toCheckIn(scope.row)"
                                :disabled="Boolean(scope.row.state)"
                            >
                                办理入住
                            </el-button>
                            <el-dropdown
                                v-if="permission <= 1"
                                size="small"
                                trigger="click"
                            >
                                <el-button size="mini">
                                    <i class="el-icon-arrow-down"></i>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>
                                            <el-button
                                                size="mini"
                                                style="margin-bottom: 6px"
                                                @click="toModifyRoom(scope.row)"
                                            >
                                                更改
                                            </el-button>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <el-popconfirm
                                                icon="el-icon-info"
                                                iconColor="red"
                                                confirmButtonText="是"
                                                cancelButtonText="否"
                                                title="确定要删除吗？"
                                                @confirm="deleteRoom(scope.row)"
                                            >
                                                <template #reference>
                                                    <el-button
                                                        size="mini"
                                                        type="danger"
                                                    >
                                                        删除
                                                    </el-button>
                                                </template>
                                            </el-popconfirm>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs, watchEffect, watch, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import { getRoomsRequest, deleteRoomRequest } from '@/utils/roomRequest';
import SearchFilter from '@/components/SearchFilter';

export default {
    name: 'RoomList',
    components: {
        SearchFilter,
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const permission = store.state.permission;

        const reload = inject('reload');

        const searchOptions = [
            {
                label: '房号',
                value: 'number',
            },
        ];

        const conditionsData = reactive({
            conditions: [],
        });

        // 查询
        const search = () => {
            let list = tableData.origin;

            for (let condition of conditionsData.conditions) {
                if (condition.key === 'type') {
                    list = list.filter((order) => {
                        return order.type === condition.value;
                    });
                }

                if (condition.key === 'state') {
                    list = list.filter((order) => {
                        return order.state === condition.value;
                    });
                }

                if (condition.key === 'shower') {
                    list = list.filter((order) => {
                        return order.shower === condition.value;
                    });
                }

                if (condition.key === 'tv') {
                    list = list.filter((order) => {
                        return order.tv === condition.value;
                    });
                }

                if (condition.key === 'search') {
                    const keywordReg = new RegExp(condition.value);

                    list = list.filter((order) => {
                        return keywordReg.test(order[condition.searchKey]);
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
            search: [],
        });
        const typeText = ['大床间', '单人间', '双人间'];
        const optionsText = ['无', '有'];
        const stateText = ['可使用', '已预订'];
        const defaultSort = { prop: 'number', order: 'ascending' };

        loading.start();

        // 获取用户
        getRoomsRequest()
            .then((res) => {
                for (let room of res) {
                    room.typeText = typeText[room.type];
                    room.showerText = optionsText[room.shower];
                    room.tvText = optionsText[room.tv];
                    room.stateText = stateText[room.state];
                }
                tableData.origin = res;
                tableData.list = res;
                tableData.search = res;

                loading.close();
            })
            .catch((err) => {
                console.log(err);
                loading.close();
            });

        watchEffect(() => {
            if (route.params.changed) {
                router.go(0);
            }
        });

        const sortType = (a, b) => {
            return a.type - b.type;
        };

        const toModifyRoom = (room) => {
            router.push({ name: 'ModifyRoom', query: { number: room.number } });
        };

        const toCheckIn = (room) => {
            router.push({ name: 'CheckIn', query: { number: room.number } });
        };

        // 删除房间
        const deleteRoom = (room) => {
            loading.start();
            deleteRoomRequest(room.number, room.img)
                .then((res) => {
                    if (res.state) {
                        let index = tableData.list.findIndex((value) => {
                            return room.number === value.number;
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
            permission,
            searchOptions,
            ...toRefs(conditionsData),
            ...toRefs(tableData),
            sortType,
            defaultSort,
            toModifyRoom,
            toCheckIn,
            deleteRoom,
        };
    },
};
</script>

<style lang="scss">
.room-list {
    margin: 30px 10px;
    padding: 0 20px;

    .room-list__table {
        border: 1px solid #ebeef5;
        margin-top: 10px;
    }
}
</style>
