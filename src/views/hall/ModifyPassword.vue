<template>
    <div class="modify-password">
        <el-form :model="form" :rules="rules" ref="formElem">
            <p class="form__msg">{{ errorMsg }}</p>
            <el-form-item prop="idkey">
                <el-input v-model="form.idkey" placeholder="请输入密保">
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
                <el-button class="form__btn" type="primary" @click="modify">
                    修改密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import loading from '../../utils/loading';
import { updatePasswordRequest } from '../../utils/userRequest';

export default {
    name: 'ModifyPassword',
    setup() {
        const router = useRouter();

        const formElem = ref(null);
        const form = reactive({
            idkey: '',
            password: '',
            againPassword: '',
        });

        const rules = reactive({
            idkey: [
                { required: true, message: '密保不能为空', trigger: 'blur' },
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

        const username = sessionStorage.getItem('username');
        if (!username) {
            sessionStorage.clear();
            router.push({ name: 'Login' });
        }

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        const modify = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    loading.start();

                    updatePasswordRequest({
                        username,
                        idkey: form.idkey,
                        password: form.password,
                    })
                        .then((res) => {
                            if (res.state) {
                                console.log(res.msg);
                                router.push({ name: 'Login' });
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
            modify,
            errorMsg,
        };
    },
};
</script>

<style lang="scss">
.modify-password {
    width: 30%;
    margin: 50px auto;
}
</style>
