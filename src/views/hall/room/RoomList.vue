<template>
    <div class="room-list">
        <el-table :data="list" :default-sort="defaultSort">
            <el-table-column label="图片">
                <template #default="scope">
                    <el-image
                        class="room-list__img"
                        v-if="scope.row.img"
                        :src="scope.row.img"
                        :preview-src-list="[scope.row.img]"
                    ></el-image>
                    <span v-else>无图片</span>
                </template>
            </el-table-column>
            <el-table-column
                label="房号"
                prop="number"
                sortable
            ></el-table-column>
            <el-table-column
                label="类型"
                prop="typeText"
                :sort-method="sortType"
                sortable
            ></el-table-column>
            <el-table-column label="浴室" prop="showerText"></el-table-column>
            <el-table-column label="电视" prop="tvText"></el-table-column>
            <el-table-column label="其他" prop="extra"></el-table-column>
            <el-table-column>
                <template #header>
                    <el-checkbox v-model="stateChecked" @change="showAvailable">
                        状态
                    </el-checkbox>
                </template>
                <template #default="scope">
                    <el-tag
                        :type="scope.row.state ? 'danger' : 'success'"
                        effect="dark"
                    >
                        {{ scope.row.stateText }}
                    </el-tag>
                </template>
            </el-table-column>
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
</template>

<script>
import { reactive, toRefs, ref, watchEffect, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import { getRoomsRequest, deleteRoomRequest } from '@/utils/roomRequest';

export default {
    name: 'RoomList',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const permission = store.state.permission;

        const reload = inject('reload');

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

        const stateChecked = ref(false);
        const showAvailable = () => {
            if (stateChecked.value) {
                tableData.list = tableData.list.filter((room) => {
                    return room.state === 0;
                });
            } else {
                tableData.list = tableData.search;
            }
        };

        // 搜索
        let keyword = ref('');
        const search = () => {
            const numberReg = /^[0-9a-zA-Z]+$/;
            const typeTextReg = /^[\u4e00-\u9fa5]+$/;
            const keywordReg = new RegExp(keyword.value);

            let searchArray = [];
            let searchKey = '';

            if (numberReg.test(keyword.value)) {
                searchKey = 'number';
            } else if (typeTextReg.test(keyword.value)) {
                searchKey = 'typeText';
            }

            for (let room of tableData.origin) {
                if (keywordReg.test(room[searchKey])) {
                    searchArray.push(room);
                }
            }

            if (stateChecked.value) {
                searchArray = searchArray.filter((room) => {
                    return room.state === 0;
                });
            }

            tableData.list = searchArray;
            tableData.search = searchArray;
        };

        return {
            permission,
            ...toRefs(tableData),
            sortType,
            defaultSort,
            toModifyRoom,
            toCheckIn,
            deleteRoom,
            stateChecked,
            showAvailable,
            keyword,
            search,
        };
    },
};
</script>

<style lang="scss">
.room-list {
    margin: 30px 10px;
    border: 1px solid #ebeef5;
    padding: 0 20px;

    .room-list__img {
        width: 100px;
        height: 100px;
    }
}
</style>
