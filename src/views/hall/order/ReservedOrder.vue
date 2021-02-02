<template>
    <div class="reserved-order">
        <el-table :data="list" :default-sort="defaultSort">
            <el-table-column
                label="订单号"
                prop="oid"
                sortable
            ></el-table-column>
            <el-table-column
                label="房号"
                prop="number"
                sortable
            ></el-table-column>
            <el-table-column
                label="下单时间"
                prop="placeTime"
            ></el-table-column>
            <el-table-column
                label="预订时间"
                prop="reservationDate"
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
</template>

<script>
import { reactive, toRefs, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import { getOrdersRequest, deleteOrderRequest } from '@/utils/orderRequest';
import {
    getFormatDate,
    getFormatNextDate,
    getFormatDateTime,
} from '@/utils/dateTool';

export default {
    name: 'ReservedOrder',
    setup() {
        const router = useRouter();

        const reload = inject('reload');

        const tableData = reactive({
            origin: [],
            list: [],
        });
        const defaultSort = { prop: 'oid', order: 'ascending' };

        loading.start();

        // 获取用户
        getOrdersRequest(0)
            .then((res) => {
                for (let order of res) {
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
                query: { oid: order.oid, number: order.number },
                params: { state: 0 },
            });
        };

        const toCheckIn = (order) => {
            router.push({
                name: 'CheckIn',
                query: { number: order.number, uid: order.uid },
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

        // 搜索
        let keyword = ref('');
        const search = () => {
            const oidReg = /^\d+$/;
            const numberReg = /^[0-9a-zA-Z]+$/;
            const keywordReg = new RegExp(keyword.value);

            let searchArray = [];
            let searchKey = '';

            if (oidReg.test(keyword.value)) {
                searchKey = 'oid';
            }

            for (let order of tableData.origin) {
                if (keywordReg.test(order[searchKey])) {
                    searchArray.push(order);
                }
            }

            // 检索房号
            if (numberReg.test(keyword.value)) {
                for (let order of tableData.origin) {
                    if (keywordReg.test(order.number)) {
                        if (searchArray.indexOf(order) === -1) {
                            searchArray.push(order);
                        }
                    }
                }
            }

            tableData.list = searchArray;
        };

        return {
            ...toRefs(tableData),
            defaultSort,
            toModifyOrder,
            toCheckIn,
            deleteOder,
            keyword,
            search,
        };
    },
};
</script>

<style lang="scss">
.reserved-order {
    margin: 30px 10px;
    border: 1px solid #ebeef5;
    padding: 0 20px;
}
</style>
