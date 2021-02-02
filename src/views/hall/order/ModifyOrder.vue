<template>
    <div class="modify-order">
        <div>
            <div class="modify-order__label">房号</div>
            <span class="m-l-12">{{ roomInfo.number }}</span>
        </div>
        <div>
            <div class="modify-order__label">类型</div>
            <span class="m-l-12" style="margin-right: 20px">{{
                roomInfo.typeText
            }}</span>
            <el-tag
                v-if="roomInfo.shower"
                size="small"
                type="info"
                effect="plain"
            >
                浴室
            </el-tag>
            <el-tag
                v-if="roomInfo.tv"
                class="m-l-12"
                size="small"
                type="info"
                effect="plain"
            >
                电视
            </el-tag>
        </div>
        <div>
            <div class="modify-order__label">订单号</div>
            <span class="m-l-12">{{ orderInfo.oid }}</span>
        </div>
        <div>
            <div class="modify-order__label">入住时间</div>
            <span class="m-l-12">{{ orderInfo.checkInTime }}</span>
        </div>
        <div>
            <p class="modify-order__extra">{{ roomInfo.extra }}</p>
        </div>
        <el-date-picker
            v-if="state === '0'"
            class="modify-order__picker"
            v-model="dateArray"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :disabledDate="disabledDate"
            :disabled="isDisable"
            @change="computeNights"
        >
        </el-date-picker>
        <div style="display: inline" v-if="state === '1'">
            <el-date-picker
                v-model="pi.date"
                type="date"
                placeholder="选择日期"
                class="modify-order__pi"
                disabled
            >
            </el-date-picker>
            至
            <el-date-picker
                v-model="pi.nextDate"
                type="date"
                placeholder="选择日期"
                class="modify-order__pi"
                :disabledDate="piDisabledDate"
                @change="piComputeNights"
            >
            </el-date-picker>
        </div>
        <span class="m-l-8">{{ nights }}</span>

        <el-button class="modify-order__submit" type="primary" @click="submit">
            修改
        </el-button>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getRoomInfoRequest } from '@/utils/roomRequest';
import { updateOrderRequest } from '@/utils/orderRequest';
import { getFormatDateTime, getNextDate, getDate } from '@/utils/dateTool';
import { getOrderInfoByOidRequest } from '@/utils/orderRequest';

export default {
    name: 'ModifyOrder',
    setup() {
        const router = useRouter();
        const route = useRoute();

        const state = route.params.state;

        const roomInfo = reactive({
            number: '',
            type: 0,
            typeText: '',
            shower: 0,
            tv: 0,
            extra: '',
        });

        // 获取房间信息
        getRoomInfoRequest(route.query.number)
            .then((res) => {
                if (res.state) {
                    const typeText = ['大床间', '单人间', '双人间'];

                    roomInfo.number = res.room.number;
                    roomInfo.type = res.room.type;
                    roomInfo.typeText = typeText[res.room.type];
                    roomInfo.shower = res.room.shower;
                    roomInfo.tv = res.room.tv;
                    roomInfo.extra = res.room.extra;
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        const picker = reactive({
            dateArray: [],
            isDisable: false,
        });

        const disabledDate = (time) => {
            return time.getTime() < Date.now() - 8.64e7;
        };

        const nights = ref('');
        const computeNights = (dates) => {
            let during = (dates[1] - dates[0]) / 86400000;
            nights.value = during + '晚';
        };

        const pi = reactive({
            date: '',
            nextDate: '',
        });

        const orderInfo = reactive({
            oid: null,
            reservationTime: '',
            during: 0,
            checkInTime: '',
        });

        getOrderInfoByOidRequest(route.query.oid)
            .then((res) => {
                if (res.state) {
                    orderInfo.oid = res.order.oid;
                    orderInfo.reservationTime = res.order.reservation_time;
                    orderInfo.during = res.order.reservation_during;
                    nights.value = res.order.reservation_during + '晚';
                    orderInfo.checkInTime = getFormatDateTime(
                        res.order.check_in_time
                    );

                    if (state === '0') {
                        let order = res.order;
                        let nextDate = getNextDate(
                            order.reservation_time,
                            order.reservation_during
                        );

                        picker.dateArray.push(getDate(order.reservation_time));
                        picker.dateArray.push(nextDate);
                    } else if (state === '1') {
                        let nextDate = getNextDate(
                            res.order.reservation_time,
                            res.order.reservation_during
                        );

                        pi.date = getDate(res.order.reservation_time);
                        pi.nextDate = nextDate;
                    }
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        const piDisabledDate = (time) => {
            return time.getTime() < orderInfo.reservationTime + 8.64e7;
        };

        const piComputeNights = (date) => {
            let during =
                (date.getTime() - orderInfo.reservationTime) / 86400000;
            nights.value = during + '晚';
        };

        const submit = () => {
            let obj = {};

            obj.oid = orderInfo.oid;
            if (state === '0') {
                obj.reservation_time = picker.dateArray[0].getTime();
                obj.reservation_during =
                    (picker.dateArray[1] - picker.dateArray[0]) / 86400000;
            } else if (state === '1') {
                obj.reservation_time = orderInfo.reservationTime;
                obj.reservation_during =
                    (pi.nextDate.getTime() - orderInfo.reservationTime) /
                    86400000;
            }

            updateOrderRequest(obj)
                .then((res) => {
                    if (res.state) {
                        ElMessage.success(res.msg);
                        router.back();
                    } else {
                        ElMessage.warning(res.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        return {
            roomInfo,
            orderInfo,
            ...toRefs(picker),
            nights,
            computeNights,
            submit,
            disabledDate,
            pi,
            piDisabledDate,
            piComputeNights,
            state,
        };
    },
};
</script>

<style lang="scss">
.modify-order {
    width: 30%;
    margin: 50px auto;
    font-size: 14px;
    color: #606266;
    line-height: 50px;

    .modify-order__extra {
        width: 70%;
        color: $info-color;
        font-size: 12px;
        line-height: 24px;
        margin-top: 6px;
    }

    .modify-order__picker {
        margin-bottom: 30px;
    }

    .modify-order__pi {
        width: 40%;
    }

    .modify-order__label {
        display: inline-block;
        width: 80px;
        text-align: right;
    }

    .modify-order__submit {
        display: block;
        width: 90%;
        margin-top: 40px;
    }
}
</style>
