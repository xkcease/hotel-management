<template>
    <div class="room-list">
        <el-table :data="list">
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
                label="房间号"
                prop="number"
                sortable
            ></el-table-column>
            <el-table-column
                label="房间类型"
                prop="typeText"
                :sort-method="sortType"
                sortable
            ></el-table-column>
            <el-table-column label="浴室" prop="showerText"></el-table-column>
            <el-table-column label="电视" prop="tvText"></el-table-column>
            <el-table-column label="其他" prop="extra"></el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
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
                            style="margin-right: 6px"
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
                                            @confirm="deleteRoom(scope.$index)"
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
import { reactive, toRefs, ref, watchEffect } from 'vue';
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

        const tableData = reactive({
            origin: [],
            list: [],
        });
        const typeText = ['大床间', '单人间', '双人间'];
        const optionsText = ['无', '有'];

        loading.start();

        // 获取用户
        getRoomsRequest()
            .then((res) => {
                for (let room of res) {
                    room.typeText = typeText[room.type];
                    room.showerText = optionsText[room.shower];
                    room.tvText = optionsText[room.tv];
                }
                tableData.origin = res;
                tableData.list = res;

                loading.close();
            })
            .catch((err) => {
                console.log(err);
                loading.close();
            });

        watchEffect(() => {
            if (route.params.img) {
                router.go(0);
            }
        });

        const sortType = (a, b) => {
            return a.type - b.type;
        };

        const toModifyRoom = (room) => {
            router.push({ name: 'ModifyRoom', query: { number: room.number } });
        };

        // 删除用户
        const deleteRoom = (index) => {
            loading.start();

            deleteRoomRequest(tableData.list[index].number)
                .then((res) => {
                    if (res.state) {
                        tableData.list.splice(index, 1);
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

        // 搜索
        let keyword = ref('');
        const search = () => {
            const numberReg = /^\d+$/;
            const keywordReg = new RegExp(keyword.value);

            const searchArray = [];
            let searchKey = '';

            if (numberReg.test(keyword.value)) {
                searchKey = 'number';
            }

            for (let room of tableData.origin) {
                if (keywordReg.test(room[searchKey])) {
                    searchArray.push(room);
                }
            }

            tableData.list = searchArray;
        };

        return {
            permission,
            ...toRefs(tableData),
            sortType,
            toModifyRoom,
            deleteRoom,
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
