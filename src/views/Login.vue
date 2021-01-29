<template>
    <div class="login">
        <div class="login__bg"></div>
        <div class="login__form-wrap">
            <svg-icon icon-class="hotel" class="login__logo"></svg-icon>
            <h2 class="login__title">hotel management</h2>
            <p class="form__msg">{{ errorMsg }}</p>
            <el-form :model="form" :rules="rules" ref="formElem">
                <el-form-item prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="请输入用户名"
                    >
                        <template #prefix>
                            <i class="el-icon-user form__icon"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="form.password"
                        placeholder="请输入密码"
                        show-password
                        @keyup.enter="login"
                    >
                        <template #prefix>
                            <i class="el-icon-lock form__icon"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="form__btn" type="primary" @click="login">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { loginRequest } from '../utils/adminRequest';

export default {
    name: 'Login',
    setup() {
        const router = useRouter();

        const form = reactive({
            username: '',
            password: '',
        });

        const rules = reactive({
            username: [
                { required: true, message: '用户名不能为空', trigger: 'blur' },
            ],
            password: [
                { required: true, message: '密码不能为空', trigger: 'blur' },
            ],
        });

        // 错误信息清空
        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        const formElem = ref(null);
        const login = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    loginRequest(form)
                        .then((res) => {
                            if (res.state) {
                                sessionStorage.setItem('token', res.token);
                                sessionStorage.setItem(
                                    'username',
                                    form.username
                                );

                                console.log('logout');
                                router.push({ name: 'Hall' });
                            } else {
                                console.log(res.msg);
                                errorMsg.value = res.msg;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log('fail');
                    return false;
                }
            });
        };

        return {
            form,
            rules,
            login,
            formElem,
            errorMsg,
        };
    },
};
</script>

<style lang="scss">
.login {
    position: relative;

    .login__bg {
        width: 100%;
        height: 270px;
        background-color: $theme-color;
        position: absolute;
        top: 60px;
        z-index: -1;
    }

    .login__form-wrap {
        width: 310px;
        height: 330px;
        margin: 130px auto;
        padding: 24px;
        background-color: #fff;
        border-top: 10px solid $theme-color;
        border-radius: 6px;
        text-align: center;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .login__logo {
        width: 56px;
        height: 56px;
    }

    .login__title {
        font-size: 24px;
        font-weight: bold;
        color: $theme-color;
        font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
            Microsoft YaHei, Arial, sans-serif;
        margin-top: 28px;
        margin-bottom: 16px;
    }
}
</style>
