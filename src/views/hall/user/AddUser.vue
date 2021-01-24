<template>
    <div class="add-user">
        <el-form :model="form" :rules="rules" ref="formElem">
            <p class="form__msg">{{ errorMsg }}</p>
            <el-form-item prop="username">
                <el-input
                    v-model="form.username"
                    placeholder="请输入用户名(长度2-20的数字或字母)"
                >
                    <template #prefix>
                        <i class="el-icon-user form__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="idkey">
                <el-input
                    v-model="form.idkey"
                    placeholder="请输入密保(长度4-20的数字或字母)"
                >
                    <template #prefix>
                        <i class="el-icon-key form__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="form.password"
                    placeholder="请输入密码(长度4-20的数字或字母或下划线)"
                    show-password
                >
                    <template #prefix>
                        <i class="el-icon-lock form__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="againPassword">
                <el-input
                    v-model="form.againPassword"
                    placeholder="请再次输入密码"
                    show-password
                >
                    <template #prefix>
                        <i class="el-icon-lock form__icon"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.permission" style="width: 35%">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <span class="add-user__detail">{{ detail }}</span>
            </el-form-item>
            <el-form-item>
                <el-button class="form__btn" type="primary" @click="register"
                    >注册</el-button
                >
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive, ref, watch, computed } from 'vue';
import loading from '@/utils/loading';
import { registerRequest } from '@/utils/userRequest';
import { ElMessage } from 'element-plus';

export default {
    name: 'AddUser',
    setup() {
        const formElem = ref(null);
        const form = reactive({
            username: '',
            password: '',
            permission: 2,
            idkey: '',
            againPassword: '',
        });

        const rules = reactive({
            username: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
                {
                    pattern: /^[0-9A-Za-z]{2,20}$/,
                    message: '长度4-20的数字或字母',
                    trigger: 'blur',
                },
            ],
            idkey: [
                { required: true, message: '密保不能为空', trigger: 'blur' },
                {
                    pattern: /^[0-9A-Za-z]{4,20}$/,
                    message: '长度4-20的数字或字母',
                    trigger: 'blur',
                },
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                {
                    pattern: /^\w{4,20}$/,
                    message: '长度4-20的数字或字母或下划线',
                    trigger: 'blur',
                },
            ],
            againPassword: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
                {
                    validator: (rule, value, callback) => {
                        if (value !== form.password) {
                            callback(new Error('两次密码输入不一致'));
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur',
                },
            ],
        });

        const options = [
            {
                label: '普通管理员',
                value: 2,
            },
            {
                label: '高级管理员',
                value: 1,
            },
            {
                label: '超级管理员',
                value: 0,
            },
        ];
        let detail = computed(() => {
            const text = [
                '可使用订单管理、房间管理、账号管理功能',
                '可使用订单管理、房间管理功能',
                '可使用订单管理功能',
            ];
            return text[form.permission];
        });

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        const register = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    loading.start();
                    registerRequest(form)
                        .then((res) => {
                            if (res.state) {
                                ElMessage.success(res.msg);
                                formElem.value.resetFields();
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
            options,
            detail,
            errorMsg,
            register,
        };
    },
};
</script>

<style lang="scss">
.add-user {
    width: 30%;
    margin: 50px auto;

    .add-user__detail {
        font-size: 12px;
        color: $info-color;
        margin-left: 12px;
    }
}
</style>
