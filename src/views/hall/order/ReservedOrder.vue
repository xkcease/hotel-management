<template>
    <div class="reserved-order">
        <SearchFilter
            v-model="conditions"
            :searchOptions="searchOptions"
            type
            date
            search
        />
        <div class="reserved-order__table">
            <el-table :data="list" :default-sort="defaultSort" stripe border>
                <el-table-column
                    label="订单号"
                    width="200"
                    prop="oid"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="房间类型"
                    prop="typeText"
                    width="200"
                    align="center"
                    sortable
                    :sort-method="sortType"
                ></el-table-column>
                <el-table-column
                    label="预订时间"
                    width="210"
                    prop="reservationDate"
                    align="center"
                    sortable
                    :sort-method="sortReserved"
                ></el-table-column>
                <el-table-column
                    label="联系方式"
                    prop="contact"
                    align="center"
                ></el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template #default="scope">
                        <div class="l-flex l-flex__justify--around">
                            <el-button
                                size="mini"
                                type="primary"
                                @click="toCheckIn(scope.row)"
                            >
                                办理入住
                            </el-button>
                            <el-button
                                size="mini"
                                @click="toModifyOrder(scope.row)"
                            >
                                修改订单
                            </el-button>
                            <el-popconfirm
                                icon="el-icon-info"
                                iconColor="red"
                                confirmButtonText="是"
                                cancelButtonText="否"
                                title="确定要删除吗？"
                                @confirm="deleteOder(scope.row)"
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
import { reactive, toRefs, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import socketIOTool from '@/utils/socketIOTool';
import { getOrdersRequest, deleteOrderRequest } from '@/utils/orderRequest';
import {
    getFormatDate,
    getFormatNextDate,
    getFormatDateTime,
} from '@/utils/dateTool';
import SearchFilter from '@/components/SearchFilter';

export default {
    name: 'ReservedOrder',
    components: {
        SearchFilter,
    },
    setup() {
        const router = useRouter();
        const store = useStore();

        store.commit('clearNoticeOrderCount');

        const reload = inject('reload');

        const searchOptions = [
            {
                label: '订单编号',
                value: 'oid',
            },
            {
                label: '联系方式',
                value: 'contact',
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

                if (condition.key === 'date') {
                    list = list.filter((order) => {
                        return (
                            condition.value[0] <= order.reservation_time &&
                            order.reservation_time <= condition.value[1]
                        );
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
        });

        const defaultSort = { prop: 'reservationDate', order: 'ascending' };

        const sortType = (a, b) => {
            return a.type - b.type;
        };

        const sortReserved = (a, b) => {
            return a.reservation_time - b.reservation_time;
        };

        const typeTextArray = ['大床间', '单人间', '双人间'];

        socketIOTool.on('new-order', (socket) => {
            socket.orderArray.forEach((order) => {
                order.typeText = typeTextArray[order.type];
                let date = getFormatDate(order.reservation_time);
                let nextDate = getFormatNextDate(
                    order.reservation_time,
                    order.reservation_during
                );

                order.placeTime = getFormatDateTime(order.place_time);
                order.reservationDate = date + ' 至 ' + nextDate;
            });

            let newList = tableData.origin.concat(socket.orderArray);
            tableData.origin = newList;
            tableData.list = newList;
        });

        loading.start();

        // 获取用户
        getOrdersRequest(0)
            .then((res) => {
                for (let order of res) {
                    order.typeText = typeTextArray[order.type];

                    let date = getFormatDate(order.reservation_time);
                    let nextDate = getFormatNextDate(
                        order.reservation_time,
                        order.reservation_during
                    );

                    order.placeTime = getFormatDateTime(order.place_time);
                    order.reservationDate = date + ' 至 ' + nextDate;
                }
                tableData.origin = res;
                tableData.list = res;

                loading.close();
            })
            .catch((err) => {
                console.log(err);
                loading.close();
            });

        const toModifyOrder = (order) => {
            router.push({
                name: 'ModifyOrder',
                query: { oid: order.oid },
                params: { state: 0 },
            });
        };

        const toCheckIn = (order) => {
            router.push({
                name: 'CheckIn',
                query: { oid: order.oid },
                params: { uid: order.uid },
            });
        };

        const deleteOder = (order) => {
            loading.start();
            deleteOrderRequest(order.oid)
                .then((res) => {
                    if (res.state) {
                        let index = tableData.list.findIndex((value) => {
                            return order.oid === value.oid;
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
            searchOptions,
            ...toRefs(conditionsData),
            ...toRefs(tableData),
            defaultSort,
            sortType,
            sortReserved,
            toModifyOrder,
            toCheckIn,
            deleteOder,
        };
    },
};
</script>

<style lang="scss">
.reserved-order {
    margin: 30px 10px;
    padding: 0 20px;

    .reserved-order__table {
        border: 1px solid #ebeef5;
        margin-top: 10px;
    }
}
</style>
