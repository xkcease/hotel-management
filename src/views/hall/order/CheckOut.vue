<template>
    <div class="check-out">
        <el-steps
            class="check-out__steps"
            :active="stepActive"
            finish-status="success"
        >
            <el-step title="未入住"></el-step>
            <el-step title="已入住"></el-step>
            <el-step title="退房"></el-step>
        </el-steps>
        <div class="check-out__content">
            <el-card class="check-out__card">
                <div>
                    <div class="check-out__label">房号</div>
                    <span class="m-l-12">{{ roomInfo.number }}</span>
                </div>
                <div>
                    <div class="check-out__label">类型</div>
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
                    <div class="check-out__label">订单号</div>
                    <span class="m-l-12">{{ orderInfo.oid }}</span>
                </div>
                <div>
                    <div class="check-out__label">入住时间</div>
                    <span class="m-l-12">{{ orderInfo.checkInTime }}</span>
                </div>
                <div>
                    <div class="check-out__label">住宿时间</div>
                    <span class="m-l-12">{{ orderInfo.reservationDate }}</span>
                </div>
                <div>
                    <div class="check-out__label">入住时长</div>
                    <span class="m-l-12">{{ orderInfo.during }} 晚</span>
                </div>
                <div>
                    <div class="check-out__label">单价</div>
                    <span class="m-l-12">￥ {{ price }} 元 / 晚</span>
                </div>
                <div>
                    <div class="check-out__label">合计</div>
                    <p class="m-l-12" style="display: inline-block">
                        ￥
                        <span class="check-out__total">{{
                            price * orderInfo.during
                        }}</span>
                        元
                    </p>
                </div>
            </el-card>
            <el-card>
                <div>
                    <div class="check-out__label">联系方式</div>
                    <span class="m-l-12">{{ orderInfo.contact }}</span>
                </div>
                <div v-for="(guest, index) in guests" :key="index">
                    <div>
                        <div class="check-out__label">身份证</div>
                        <span class="m-l-12">{{ guest.gid }}</span>
                    </div>
                    <div>
                        <div class="check-out__label">姓名</div>
                        <span class="m-l-12">{{ guest.name }}</span>
                    </div>
                </div>
            </el-card>
            <el-button
                v-if="!isDisabled"
                type="primary"
                class="check-out__btn"
                @click="submit"
                >办理退房</el-button
            >
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getGuestsRequest } from '@/utils/guestRequest';
import { getRoomInfoRequest } from '@/utils/roomRequest';
import {
    checkOutRequest,
    getOrderInfoByOidRequest,
} from '@/utils/orderRequest';
import { getPriceRequest } from '@/utils/priceRequest';
import {
    getFormatDate,
    getFormatNextDate,
    getFormatDateTime,
} from '@/utils/dateTool';

export default {
    name: 'CheckOut',
    setup() {
        const router = useRouter();
        const route = useRoute();

        const price = ref(0);
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

                    getPriceRequest(roomInfo.type).then((result) => {
                        price.value = result.price;
                    });
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        const orderInfo = reactive({
            oid: null,
            rid: null,
            reservationDate: '',
            during: 0,
            checkInTime: '',
            contact: '',
        });

        getOrderInfoByOidRequest(route.query.oid)
            .then((res) => {
                if (res.state) {
                    let date = getFormatDate(res.order.reservation_time);
                    let nextDate = getFormatNextDate(
                        res.order.reservation_time,
                        res.order.reservation_during
                    );

                    orderInfo.oid = res.order.oid;
                    orderInfo.rid = res.order.rid;
                    orderInfo.reservationDate = date + ' 至 ' + nextDate;
                    orderInfo.during = res.order.reservation_during;
                    orderInfo.checkInTime = getFormatDateTime(
                        res.order.check_in_time
                    );
                    orderInfo.contact = res.order.contact;
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        const guestRea = reactive({
            guests: [],
        });

        getGuestsRequest(route.query.oid)
            .then((res) => {
                console.log(res);
                guestRea.guests = res;
            })
            .catch((err) => {
                console.log(err);
            });

        const stepActive = ref(2);
        const isDisabled = ref(false);
        if (route.params.state && route.params.state !== '1') {
            stepActive.value = 3;
            isDisabled.value = true;
        }

        const submit = () => {
            checkOutRequest(orderInfo.oid, orderInfo.rid)
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
            ...toRefs(guestRea),
            price,
            stepActive,
            isDisabled,
            submit,
        };
    },
};
</script>

<style lang="scss">
.check-out {
    font-size: 16px;
    color: #606266;
    line-height: 42px;

    .check-out__steps {
        width: 70%;
        margin: 30px auto;
    }

    .check-out__content {
        width: 27%;
        margin: 30px auto;
    }

    .check-out__card {
        margin-bottom: 20px;
    }

    .check-out__label {
        display: inline-block;
        width: 80px;
        text-align: right;
    }

    .check-out__total {
        color: $danger-color;
    }

    .check-out__btn {
        width: 100%;
        margin-top: 40px;
    }
}
</style>
