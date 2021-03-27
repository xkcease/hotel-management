<template>
    <div class="modify-order">
        <el-steps
            class="modify-order__steps"
            :active="stepActive"
            finish-status="success"
        >
            <el-step title="未入住"></el-step>
            <el-step title="已入住"></el-step>
            <el-step title="退房"></el-step>
        </el-steps>
        <div class="modify-order__content">
            <el-card class="modify-order__card">
                <div v-if="state === 1">
                    <div class="modify-order__label">房号</div>
                    <span class="m-l-12">{{ roomInfo.number }}</span>
                </div>
                <div v-if="state === 0">
                    <div class="modify-order__label">类型</div>
                    <el-select
                        v-model="type"
                        class="modify-order__input m-l-12"
                    >
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
                <div v-else>
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
                    <span class="m-l-12">{{ order.oid }}</span>
                </div>
                <div v-if="state === 0">
                    <div class="modify-order__label">下单时间</div>
                    <span class="m-l-12">{{ order.placeTime }}</span>
                </div>
                <div v-else>
                    <div class="modify-order__label">入住时间</div>
                    <span class="m-l-12">{{ order.checkInTime }}</span>
                </div>
                <div>
                    <div class="modify-order__label">联系方式</div>
                    <span class="m-l-12">{{ order.contact }}</span>
                </div>
                <div>
                    <p class="modify-order__extra">{{ roomInfo.extra }}</p>
                </div>
                <el-date-picker
                    v-if="state === 0"
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
                <div style="display: inline" v-if="state === 1">
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
            </el-card>
            <el-button
                class="modify-order__submit"
                type="primary"
                @click="submit"
            >
                修改
            </el-button>
        </div>
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

        const state = parseInt(route.params.state);
        const stepActive = ref(0);

        const typeOptions = [
            {
                label: '大床间',
                value: 0,
            },
            {
                label: '单人间',
                value: 1,
            },
            {
                label: '双人间',
                value: 2,
            },
        ];

        const type = ref(0);

        const roomInfo = reactive({
            number: '',
            type: 0,
            typeText: '',
            shower: 0,
            tv: 0,
            extra: '',
        });

        // 获取房间信息
        if (state === 1) {
            stepActive.value = 1;

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
        }

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
            order: {},
        });

        getOrderInfoByOidRequest(route.query.oid)
            .then((res) => {
                if (res.state) {
                    nights.value = res.order.reservation_during + '晚';

                    res.order.checkInTime = getFormatDateTime(
                        res.order.check_in_time
                    );
                    res.order.placeTime = getFormatDateTime(
                        res.order.place_time
                    );

                    orderInfo.order = res.order;

                    if (state === 0) {
                        let order = res.order;

                        roomInfo.typeText = typeOptions[order.type].label;
                        type.value = typeOptions[order.type].label;

                        let nextDate = getNextDate(
                            order.reservation_time,
                            order.reservation_during
                        );

                        picker.dateArray.push(getDate(order.reservation_time));
                        picker.dateArray.push(nextDate);
                    } else if (state === 1) {
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
            return time.getTime() < orderInfo.order.reservation_time + 8.64e7;
        };

        const piComputeNights = (date) => {
            console.log(orderInfo.order);
            let during =
                (date.getTime() - orderInfo.order.reservation_time) / 86400000;
            nights.value = during + '晚';
        };

        const submit = () => {
            let obj = {};

            obj.oid = orderInfo.order.oid;
            if (state === 0) {
                obj.type = type.value;
                obj.reservation_time = picker.dateArray[0].getTime();
                obj.reservation_during =
                    (picker.dateArray[1] - picker.dateArray[0]) / 86400000;
            } else if (state === 1) {
                obj.reservation_time = orderInfo.order.reservation_time;
                obj.reservation_during =
                    (pi.nextDate.getTime() - orderInfo.order.reservation_time) /
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
            stepActive,
            type,
            typeOptions,
            roomInfo,
            ...toRefs(orderInfo),
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
    font-size: 14px;
    color: #606266;
    line-height: 50px;

    .modify-order__content {
        width: 33%;
        margin: 30px auto;
    }

    .modify-order__steps {
        width: 70%;
        margin: 30px auto;
    }

    .modify-order__card {
        margin-bottom: 20px;
    }

    .modify-order__input {
        width: 30%;
    }

    .modify-order__extra {
        width: 70%;
        color: $info-color;
        font-size: 12px;
        line-height: 24px;
        margin-top: 6px;
    }

    .modify-order__picker {
        margin-bottom: 10px;
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
        width: 100%;
        margin-top: 40px;
    }
}
</style>
