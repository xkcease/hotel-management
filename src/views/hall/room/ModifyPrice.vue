<template>
    <div class="modify-price">
        <div class="form__title">
            <h2>修改价格</h2>
        </div>
        <div class="modify-price__form">
            <el-form
                :model="form"
                :rules="rules"
                ref="formElem"
                label-position="right"
                label-width="80px"
            >
                <p class="form__msg">{{ errorMsg }}</p>
                <el-form-item prop="kingRoomPrice" label="大床间">
                    <el-input
                        v-model="form.kingRoomPrice"
                        class="modify-price__input"
                    >
                    </el-input>
                    <span class="modify-price__unit">元 / 晚</span>
                </el-form-item>
                <el-form-item prop="singleRoomPrice" label="单人间">
                    <el-input
                        v-model="form.singleRoomPrice"
                        class="modify-price__input"
                    >
                    </el-input>
                    <span class="modify-price__unit">元 / 晚</span>
                </el-form-item>
                <el-form-item prop="doubleRoomPrice" label="双人间">
                    <el-input
                        v-model="form.doubleRoomPrice"
                        class="modify-price__input"
                    >
                    </el-input>
                    <span class="modify-price__unit">元 / 晚</span>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="modify-price__btn"
                        type="primary"
                        @click="dialogVisible = true"
                        >修改价格</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="警告" v-model="dialogVisible" width="30%">
            <span>确认要修改价格吗？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyPrice"
                        >确 定</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import { getPriceRequest, updatePriceRequest } from '@/utils/priceRequest';

export default {
    name: 'ModifyPrice',
    setup() {
        const formElem = ref(null);
        const form = reactive({
            kingRoomPrice: 1,
            singleRoomPrice: 1,
            doubleRoomPrice: 1,
        });

        const rules = reactive({
            kingRoomPrice: [
                { required: true, message: '不能为空', trigger: 'blur' },
                {
                    pattern: /^\d+$/,
                    message: '只能为数字',
                    trigger: 'blur',
                },
            ],
            singleRoomPrice: [
                { required: true, message: '不能为空', trigger: 'blur' },
                {
                    pattern: /^\d+$/,
                    message: '只能为数字',
                    trigger: 'blur',
                },
            ],
            doubleRoomPrice: [
                { required: true, message: '不能为空', trigger: 'blur' },
                {
                    pattern: /^\d+$/,
                    message: '只能为数字',
                    trigger: 'blur',
                },
            ],
        });

        loading.start();
        getPriceRequest()
            .then((res) => {
                loading.close();

                for (let obj of res) {
                    if (obj.type === 0) {
                        form.kingRoomPrice = obj.price;
                    } else if (obj.type === 1) {
                        form.singleRoomPrice = obj.price;
                    } else if (obj.type === 2) {
                        form.doubleRoomPrice = obj.price;
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                loading.close();
            });

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        const dialogVisible = ref(false);

        const modifyPrice = () => {
            dialogVisible.value = false;

            formElem.value.validate((valid) => {
                if (valid) {
                    loading.start();

                    updatePriceRequest(form)
                        .then((res) => {
                            if (res.state) {
                                ElMessage.success(res.msg);
                            } else {
                                errorMsg.value = res.msg;
                            }

                            loading.close();
                        })
                        .catch((err) => {
                            console.log(err);
                            loading.close();
                        });
                }
            });
        };

        return {
            form,
            formElem,
            rules,
            dialogVisible,
            errorMsg,
            modifyPrice,
        };
    },
};
</script>

<style lang="scss">
.modify-price {
    padding: 20px;

    .modify-price__form {
        width: 50%;
        margin: 16px;
    }

    .modify-price__input {
        width: 90%;
    }

    .modify-price__unit {
        margin-left: 12px;
        color: $info-color;
    }

    .modify-price__btn {
        display: block;
        width: 90%;
        margin-top: 12px;
    }
}
</style>
