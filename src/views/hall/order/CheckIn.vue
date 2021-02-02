<template>
    <div class="check-in">
        <div style="padding-left: 40px; margin-bottom: 30px">
            <div>
                <p>
                    房号
                    <span class="m-l-8">{{ roomInfo.number }}</span>
                </p>
            </div>
            <div>
                <p>
                    类型
                    <span class="m-l-8">{{ roomInfo.typeText }}</span>
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
        <el-form
            :model="form"
            ref="formElem"
            label-position="right"
            label-width="80px"
        >
            <div v-for="(item, index) in form" :key="index">
                <div class="check-in__block">
                    <el-form-item
                        :prop="index + '.name'"
                        :rules="rules.name"
                        label="姓名"
                        class="check-in__item"
                    >
                        <el-input v-model="item.name"></el-input>
                    </el-form-item>
                    <el-form-item
                        :prop="index + '.gid'"
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
                <el-divider v-if="index !== form.length - 1"></el-divider>
            </div>
            <el-form-item>
                <el-button
                    class="check-in__submit"
                    type="primary"
                    @click="submit"
                >
                    提交
                </el-button>
                <el-button class="check-in__increase" @click="increaseItem">
                    增加表项
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getRoomInfoRequest } from '@/utils/roomRequest';
import { checkInRequest, getOrderInfoByUidRequest } from '@/utils/orderRequest';
import { getDate, getNextDate } from '@/utils/dateTool';

export default {
    name: 'CheckIn',
    setup() {
        const router = useRouter();
        const route = useRoute();

        let uid = route.query.uid;

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
                    if (res.room.state && !uid) {
                        ElMessage.error('该房间已被预订');
                        router.push({
                            name: 'RoomList',
                            params: { changed: true },
                        });
                    }
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

        if (uid) {
            picker.isDisable = true;
            getOrderInfoByUidRequest(uid)
                .then((res) => {
                    if (res.state) {
                        let order = res.order;
                        let nextDate = getNextDate(
                            order.reservation_time,
                            order.reservation_during
                        );

                        picker.dateArray.push(getDate(order.reservation_time));
                        picker.dateArray.push(nextDate);
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
        const form = reactive([
            {
                name: '',
                gid: '',
            },
        ]);

        const rules = reactive({
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
            form.push({
                name: '',
                gid: '',
            });
        };

        const deleteItem = (index) => {
            form.splice(index, 1);
        };

        const submit = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    let obj = {};

                    if (uid) {
                        obj.uid = uid;
                    } else {
                        obj.number = roomInfo.number;
                        obj.place_time = Date.now();
                        obj.reservation_time = picker.dateArray[0].getTime();
                        obj.reservation_during =
                            (picker.dateArray[1] - picker.dateArray[0]) /
                            86400000;
                    }
                    obj.check_in_time = Date.now();

                    checkInRequest(obj, form)
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
                }
            });
        };

        return {
            form,
            formElem,
            rules,
            roomInfo,
            ...toRefs(picker),
            nights,
            computeNights,
            increaseItem,
            deleteItem,
            submit,
            disabledDate,
        };
    },
};
</script>

<style lang="scss">
.check-in {
    width: 30%;
    margin: 50px auto;
    font-size: 14px;
    color: #606266;
    line-height: 40px;

    .check-in__extra {
        width: 70%;
        color: $info-color;
        font-size: 12px;
        line-height: 24px;
        margin-top: 6px;
    }

    .check-in__picker {
        margin-bottom: 30px;
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
        width: 56%;
    }

    .check-in__increase {
        position: absolute;
        right: 0;
    }
}
</style>
