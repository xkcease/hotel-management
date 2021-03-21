<template>
    <div class="occupied-order">
        <SearchFilter
            v-model="conditions"
            :searchOptions="searchOptions"
            type
            date
            checkIn
            search
        />
        <div class="occupied-order__table">
            <el-table :data="list" :default-sort="defaultSort" stripe border>
                <el-table-column
                    label="订单号"
                    width="200"
                    prop="oid"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="房号"
                    prop="number"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="房间类型"
                    prop="typeText"
                    align="center"
                    sortable
                    :sort-method="sortType"
                ></el-table-column>
                <el-table-column
                    label="预订时间"
                    width="210"
                    prop="reservationDate"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="入住时间"
                    width="210"
                    prop="checkInTime"
                    align="center"
                    sortable
                ></el-table-column>
                <el-table-column
                    label="联系方式"
                    prop="contact"
                    align="center"
                ></el-table-column>
                <el-table-column align="center" label="操作" width="200">
                    <template #default="scope">
                        <div class="l-flex l-flex__justify--around">
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
    </div>
</template>

<script>
import { reactive, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import loading from '@/utils/loading';
import { getOrdersRequest } from '@/utils/orderRequest';
import {
    getFormatDate,
    getFormatNextDate,
    getFormatDateTime,
} from '@/utils/dateTool';
import SearchFilter from '@/components/SearchFilter';

export default {
    name: 'OccupiedOrder',
    components: {
        SearchFilter,
    },
    setup() {
        const router = useRouter();

        const searchOptions = [
            {
                label: '订单编号',
                value: 'oid',
            },
            {
                label: '房号',
                value: 'number',
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

                if (condition.key === 'checkIn') {
                    list = list.filter((order) => {
                        return (
                            condition.value[0] <= order.check_in_time &&
                            order.check_in_time <= condition.value[1]
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
        const defaultSort = { prop: 'checkInTime', order: 'descending' };
        const typeTextArray = ['大床间', '单人间', '双人间'];

        const sortType = (a, b) => {
            return a.type - b.type;
        };

        loading.start();

        // 获取订单
        getOrdersRequest(1)
            .then((res) => {
                for (let order of res) {
                    order.typeText = typeTextArray[order.type];
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

        return {
            searchOptions,
            ...toRefs(conditionsData),
            ...toRefs(tableData),
            defaultSort,
            sortType,
            toModifyOrder,
            toCheckOut,
        };
    },
};
</script>

<style lang="scss">
.occupied-order {
    margin: 30px 10px;
    padding: 0 20px;

    .occupied-order__table {
        border: 1px solid #ebeef5;
        margin-top: 10px;
    }
}
</style>
