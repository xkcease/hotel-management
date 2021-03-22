<template>
    <div class="hotel-intro">
        <div class="form__title">
            <h2>基本信息</h2>
        </div>
        <div class="hotel-intro__form">
            <el-form
                :model="form"
                :rules="rules"
                ref="formElem"
                label-position="right"
                label-width="80px"
            >
                <p class="form__msg">{{ errorMsg }}</p>
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name"> </el-input>
                </el-form-item>
                <el-form-item prop="address" label="地址">
                    <el-input v-model="form.address"> </el-input>
                </el-form-item>
                <el-form-item prop="contact" label="联系方式">
                    <el-input v-model="form.contact"> </el-input>
                </el-form-item>
                <div class="form__title form__title--form">
                    <h2>其他</h2>
                </div>
                <el-form-item prop="options" label="配套设施">
                    <el-input
                        v-model="form.options"
                        placeholder="用英文;分隔标签"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item prop="intro" label="简介">
                    <el-input
                        type="textarea"
                        v-model="form.intro"
                        placeholder="输入其他内容"
                        maxlength="254"
                        rows="5"
                        show-word-limit
                    >
                        <template #prefix>
                            <i class="el-icon-lock form__icon"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                        ref="uploadElem"
                        class="l-flex"
                        action="http://localhost:9092/uploadIntroImg"
                        :http-request="uploadImg"
                        list-type="picture-card"
                        :file-list="upload.list"
                        :auto-upload="false"
                        :limit="1"
                        :on-preview="imgPreview"
                        :on-change="verifyFileType"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <div style="text-align: center">
                            <img :src="upload.img" style="width: 100%" />
                        </div>
                    </el-dialog>
                    <p class="hotel-intro__tip">只能上传一张图片</p>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="form__btn"
                        type="primary"
                        @click="updateHotelIntro"
                        >保存</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import {
    updateHotelIntroRequest,
    uploadIntroImgRequest,
    getHotelIntroRequest,
} from '@/utils/introRequest';

export default {
    name: 'HotelIntro',
    setup() {
        const formElem = ref(null);
        const form = reactive({
            name: '',
            address: '',
            contact: '',
            options: '',
            intro: '',
        });

        const uploadElem = ref(null);
        const upload = reactive({
            oldImgName: '',
            img: '',
            list: [],
        });

        const rules = reactive({
            name: [
                { required: true, message: '名称不能为空', trigger: 'blur' },
            ],
            address: [
                { required: true, message: '地址不能为空', trigger: 'blur' },
            ],
            contact: [
                {
                    required: true,
                    message: '联系方式不能为空',
                    trigger: 'blur',
                },
            ],
        });

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

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        // 获取信息
        getHotelIntroRequest()
            .then((res) => {
                if (res.state) {
                    form.name = res.hotelIntro.name;
                    form.address = res.hotelIntro.address;
                    form.contact = res.hotelIntro.contact;
                    form.options = res.hotelIntro.options;
                    form.intro = res.hotelIntro.intro;
                    upload.img = res.hotelIntro.img;
                    let name =
                        'hotelIntro.' + res.hotelIntro.img.split('.').pop();
                    upload.oldImgName = name;
                    upload.list.push({ name, url: res.hotelIntro.img });
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        // 放大图片
        let dialogVisible = ref(false);
        const imgPreview = (file) => {
            form.img = file.url;
            dialogVisible.value = true;
        };

        const verifyFileType = (file, fileList) => {
            if (!file.raw.type.includes('image')) {
                fileList.splice(0, 1);
                ElMessage.warning('上传文件类型必须是图片!');
                return false;
            }
            upload.img = file.url;
        };

        const uploadImg = (obj) => {
            let formData = new FormData();
            formData.append('file', obj.file);
            formData.append('type', -1);
            formData.append('oldImgName', upload.oldImgName);

            uploadIntroImgRequest(formData).then((res) => {
                console.log(res.msg);
            });
        };

        const updateHotelIntro = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    updateHotelIntroRequest(form)
                        .then((res) => {
                            if (res.state) {
                                uploadElem.value.submit();
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
            upload,
            uploadElem,
            typeOptions,
            errorMsg,
            updateHotelIntro,
            dialogVisible,
            imgPreview,
            verifyFileType,
            uploadImg,
        };
    },
};
</script>

<style lang="scss">
.hotel-intro {
    padding: 20px;

    .hotel-intro__form {
        width: 50%;
        margin: 16px;
    }

    .hotel-intro__tip {
        font-size: 12px;
        color: $info-color;
    }
}
</style>
