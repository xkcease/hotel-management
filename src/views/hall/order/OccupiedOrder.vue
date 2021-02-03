<template>
    <div class="occupied-order">
        <el-table :data="list" :default-sort="defaultSort" stripe>
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
                label="预订时间"
                prop="reservationDate"
            ></el-table-column>
            <el-table-column
                label="入住时间"
                prop="checkInTime"
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
                        <el-button
                            type="primary"
                            size="mini"
                            @click="toCheckOut(scope.row)"
                        >
                            办理退房
                        </el-button>
                        <el-button
                            size="mini"
                            @click="toModifyOrder(scope.row)"
                        >
                            修改订单
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { reactive, toRefs, ref } from 'vue';
import { useRouter } from 'vue-router';
import loading from '@/utils/loading';
import { getOrdersRequest } from '@/utils/orderRequest';
import {
    getFormatDate,
    getFormatNextDate,
    getFormatDateTime,
} from '@/utils/dateTool';

export default {
    name: 'OccupiedOrder',
    setup() {
        const router = useRouter();

        const tableData = reactive({
            origin: [],
            list: [],
        });
        const defaultSort = { prop: 'checkInTime', order: 'descending' };

        loading.start();

        // 获取用户
        getOrdersRequest(1)
            .then((res) => {
                for (let order of res) {
                    let date = getFormatDate(order.reservation_time);
                    let nextDate = getFormatNextDate(
                        order.reservation_time,
                        order.reservation_during
                    );

                    order.reservationDate = date + ' 至 ' + nextDate;
                    order.checkInTime = getFormatDateTime(order.check_in_time);
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
                params: { state: 1 },
            });
        };

        const toCheckOut = (order) => {
            router.push({
                name: 'CheckOut',
                query: { number: order.number, oid: order.oid },
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
            toCheckOut,
            keyword,
            search,
        };
    },
};
</script>

<style lang="scss">
.occupied-order {
    margin: 30px 10px;
    border: 1px solid #ebeef5;
    padding: 0 20px;
}
</style>
