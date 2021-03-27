<template>
    <div class="check-in">
        <el-steps class="check-in__steps" :active="0" finish-status="success">
            <el-step title="未入住"></el-step>
            <el-step title="已入住"></el-step>
            <el-step title="退房"></el-step>
        </el-steps>
        <div class="check-in__content">
            <el-card class="check-in__card">
                <div style="padding-left: 40px; margin-bottom: 30px">
                    <div>
                        <p>
                            房号
                            <el-cascader
                                v-if="uid"
                                :options="roomOptions.options"
                                v-model="roomOptions.value"
                                :props="roomOptions.props"
                                :show-all-levels="false"
                                class="m-l-8"
                            ></el-cascader>
                            <span v-else class="m-l-8">{{
                                roomInfo.number
                            }}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            类型
                            <span class="m-l-8">{{ roomInfo.typeText }}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            订单
                            <span class="m-l-8">{{ oid }}</span>
                        </p>
                    </div>
                    <div>
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
                            class="m-l-8"
                            size="small"
                            type="info"
                            effect="plain"
                        >
                            电视
                        </el-tag>
                    </div>
                    <div>
                        <p class="check-in__extra">{{ roomInfo.extra }}</p>
                    </div>
                </div>
                <el-date-picker
                    class="check-in__picker"
                    v-model="dateArray"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabledDate="disabledDate"
                    :disabled="isDisable"
                    @change="computeNights"
                >
                </el-date-picker>
                <span class="m-l-8">{{ nights }}</span>
            </el-card>
            <el-card class="check-in__card">
                <el-form
                    :model="form"
                    ref="formElem"
                    label-position="right"
                    label-width="80px"
                >
                    <el-form-item
                        prop="contact"
                        :rules="rules.contact"
                        label="联系方式"
                        class="check-in__item"
                    >
                        <el-input v-model="form.contact"></el-input>
                    </el-form-item>
                    <div v-for="(item, index) in form.guests" :key="index">
                        <div class="check-in__block">
                            <el-form-item
                                :prop="'guests.' + index + '.name'"
                                :rules="rules.name"
                                label="姓名"
                                class="check-in__item"
                            >
                                <el-input v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item
                                :prop="'guests.' + index + '.gid'"
                                :rules="rules.gid"
                                label="身份证"
                                class="check-in__item"
                            >
                                <el-input v-model="item.gid"></el-input>
                            </el-form-item>
                            <el-button
                                class="check-in__delete"
                                v-if="index !== 0"
                                @click="deleteItem"
                            >
                                删除
                            </el-button>
                        </div>
                        <el-divider
                            v-if="index !== form.guests.length - 1"
                        ></el-divider>
                    </div>
                    <el-form-item style="margin-bottom: 50px">
                        <el-button
                            class="check-in__increase"
                            @click="increaseItem"
                        >
                            增加表项
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-button class="check-in__submit" type="primary" @click="submit">
                提交
            </el-button>
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getRoomInfoRequest, getRoomOptionsRequest } from '@/utils/roomRequest';
import { checkInRequest, getOrderInfoByOidRequest } from '@/utils/orderRequest';
import { getDate, getNextDate } from '@/utils/dateTool';

export default {
    name: 'CheckIn',
    setup() {
        const router = useRouter();
        const route = useRoute();

        let uid = route.params.uid;

        const roomInfo = reactive({
            number: '',
            type: 0,
            typeText: '',
            shower: 0,
            tv: 0,
            extra: '',
        });

        const typeText = ['大床间', '单人间', '双人间'];

        // 获取房间信息
        if (!uid) {
            getRoomInfoRequest(route.query.number)
                .then((res) => {
                    if (res.state) {
                        if (res.room.state && !uid) {
                            ElMessage.error('该房间已被预订');
                            router.push({
                                name: 'RoomList',
                                params: { changed: true },
                            });
                        }

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

        const roomOptions = reactive({
            options: [],
            value: [],
            props: {
                expandTrigger: 'hover',
            },
        });

        const oid = ref('');

        if (uid) {
            picker.isDisable = true;
            getOrderInfoByOidRequest(route.query.oid)
                .then((res) => {
                    if (res.state) {
                        let order = res.order;

                        roomInfo.type = order.type;
                        roomInfo.typeText = typeText[order.type];

                        oid.value = order.oid;
                        form.contact = order.contact;

                        let nextDate = getNextDate(
                            order.reservation_time,
                            order.reservation_during
                        );

                        picker.dateArray.push(getDate(order.reservation_time));
                        picker.dateArray.push(nextDate);

                        getRoomOptionsRequest(order.type).then((result) => {
                            if (result.state) {
                                roomOptions.options = result.options;
                            } else {
                                ElMessage.warning(result.msg);
                            }
                        });
                    } else {
                        ElMessage.warning(res.msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        const disabledDate = (time) => {
            return time.getTime() < Date.now() - 8.64e7;
        };

        const nights = ref('');
        const computeNights = (dates) => {
            let during = (dates[1] - dates[0]) / 86400000;
            nights.value = during + '晚';
        };

        const formElem = ref(null);
        const form = reactive({
            contact: '',
            guests: [
                {
                    name: '',
                    gid: '',
                },
            ],
        });

        const rules = reactive({
            contact: [
                {
                    required: true,
                    message: '联系方式不能为空',
                    trigger: 'blur',
                },
                {
                    pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
                    message: '联系方式格式不对',
                    trigger: 'blur',
                },
            ],
            gid: [
                {
                    required: true,
                    message: '身份证号不能为空',
                    trigger: 'blur',
                },
                {
                    pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                    message: '身份证号格式不对',
                    trigger: 'blur',
                },
            ],
            name: [
                { required: true, message: '姓名不能为空', trigger: 'blur' },
            ],
        });

        const increaseItem = () => {
            form.guests.push({
                name: '',
                gid: '',
            });
        };

        const deleteItem = (index) => {
            form.guests.splice(index, 1);
        };

        const submit = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    if (roomOptions.value.length) {
                        let obj = {};

                        if (uid) {
                            obj.uid = uid;
                            obj.oid = oid.value;
                            obj.number =
                                roomOptions.value[roomOptions.value.length - 1];
                        } else {
                            obj.type = roomInfo.type;
                            obj.number = roomInfo.number;
                            obj.place_time = Date.now();
                            obj.reservation_time = picker.dateArray[0].getTime();
                            obj.reservation_during =
                                (picker.dateArray[1] - picker.dateArray[0]) /
                                86400000;
                        }

                        obj.check_in_time = Date.now();

                        checkInRequest(obj, form.contact, form.guests)
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
                    } else {
                        ElMessage.warning('房号不能为空');
                    }
                }
            });
        };

        return {
            form,
            formElem,
            rules,
            roomInfo,
            roomOptions,
            ...toRefs(picker),
            nights,
            computeNights,
            increaseItem,
            deleteItem,
            submit,
            disabledDate,
            uid,
            oid,
        };
    },
};
</script>

<style lang="scss">
.check-in {
    font-size: 14px;
    color: #606266;
    line-height: 40px;

    .check-in__steps {
        width: 70%;
        margin: 30px auto;
    }

    .check-in__content {
        width: 33%;
        margin: 30px auto;
    }

    .check-in__card {
        margin-bottom: 20px;
    }

    .check-in__extra {
        width: 70%;
        color: $info-color;
        font-size: 12px;
        line-height: 24px;
        margin-top: 6px;
    }

    .check-in__picker {
        margin-bottom: 10px;
    }

    .check-in__block {
        position: relative;
    }

    .check-in__item {
        width: 65%;
    }

    .check-in__delete {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .check-in__submit {
        width: 100%;
        margin-top: 10px;
    }

    .check-in__increase {
        position: absolute;
        right: 0;
    }
}
</style>
