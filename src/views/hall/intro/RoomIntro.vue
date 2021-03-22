<template>
    <div class="room-intro">
        <div class="form__title">
            <h2>基本信息</h2>
        </div>
        <div class="room-intro__form">
            <el-form
                :model="form"
                ref="formElem"
                label-position="right"
                label-width="80px"
                :rules="rules"
            >
                <p class="form__msg">{{ errorMsg }}</p>
                <el-form-item label="类型">
                    <el-select
                        v-model="form.type"
                        class="room-intro__input"
                        @change="changeType"
                    >
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="text" label="名称">
                    <el-input v-model="form.text"> </el-input>
                </el-form-item>
                <el-form-item label="浴室">
                    <el-select v-model="form.shower" class="room-intro__input">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电视">
                    <el-select v-model="form.tv" class="room-intro__input">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="窗户">
                    <el-select v-model="form.window" class="room-intro__input">
                        <el-option
                            v-for="item in windowOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div class="form__title form__title--form">
                    <h2>其他</h2>
                </div>
                <el-form-item prop="options" label="服务设施">
                    <el-input v-model="form.options" placeholder="用英文;分隔">
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
                    <p class="room-intro__tip">只能上传一张图片</p>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="form__btn"
                        type="primary"
                        @click="updateRoomIntro"
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
    updateRoomIntroRequest,
    uploadIntroImgRequest,
    getRoomIntroRequest,
} from '@/utils/introRequest';

export default {
    name: 'updateRoomIntro',
    setup() {
        const formElem = ref(null);
        const form = reactive({
            type: 0,
            text: '',
            shower: 0,
            tv: 0,
            window: 0,
            options: '',
            intro: '',
        });

        const rules = reactive({
            text: [
                { required: true, message: '名称不能为空', trigger: 'blur' },
            ],
        });

        const uploadElem = ref(null);
        const upload = reactive({
            oldImgName: '',
            img: '',
            list: [],
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

        const options = [
            {
                label: '无',
                value: 0,
            },
            {
                label: '有',
                value: 1,
            },
        ];

        const windowOptions = [
            {
                label: '无窗',
                value: 0,
            },
            {
                label: '部分有窗',
                value: 1,
            },
            {
                label: '都有窗',
                value: 2,
            },
        ];

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        getRoomIntroRequest(form.type)
            .then((res) => {
                if (res.state) {
                    form.type = res.roomIntro.type;
                    form.text = res.roomIntro.text;
                    form.shower = res.roomIntro.shower;
                    form.tv = res.roomIntro.tv;
                    form.window = res.roomIntro.window;
                    form.options = res.roomIntro.options;
                    form.intro = res.roomIntro.intro;
                    upload.img = res.roomIntro.img;

                    let nameArray = ['king', 'single', 'double'];
                    let name =
                        nameArray[form.type] +
                        '.' +
                        res.roomIntro.img.split('.').pop();
                    upload.oldImgName = name;
                    upload.list.push({ name, url: res.roomIntro.img });
                } else {
                    ElMessage.warning(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        const changeType = (type) => {
            loading.start();
            upload.list.pop();

            getRoomIntroRequest(type)
                .then((res) => {
                    if (res.state) {
                        form.type = res.roomIntro.type;
                        form.text = res.roomIntro.text;
                        form.shower = res.roomIntro.shower;
                        form.tv = res.roomIntro.tv;
                        form.window = res.roomIntro.window;
                        form.options = res.roomIntro.options;
                        form.intro = res.roomIntro.intro;
                        upload.img = res.roomIntro.img;

                        let nameArray = [
                            'king_room',
                            'single_room',
                            'double_room',
                        ];
                        let name =
                            nameArray[form.type] +
                            '.' +
                            res.roomIntro.img.split('.').pop();
                        upload.oldImgName = name;
                        upload.list.push({ name, url: res.roomIntro.img });
                    } else {
                        ElMessage.warning(res.msg);
                        formElem.value.resetFields();
                    }

                    loading.close();
                })
                .catch((err) => {
                    loading.close();
                    console.log(err);
                });
        };

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
            formData.append('type', form.type);
            formData.append('oldImgName', upload.oldImgName);

            uploadIntroImgRequest(formData).then((res) => {
                console.log(res.msg);
            });
        };

        const updateRoomIntro = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    updateRoomIntroRequest(form)
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
            options,
            windowOptions,
            errorMsg,
            updateRoomIntro,
            dialogVisible,
            imgPreview,
            verifyFileType,
            uploadImg,
            changeType,
        };
    },
};
</script>

<style lang="scss">
.room-intro {
    padding: 20px;

    .room-intro__form {
        width: 50%;
        margin: 16px;
    }

    .room-intro__input {
        width: 50%;
    }

    .room-intro__tip {
        font-size: 12px;
        color: $info-color;
    }
}
</style>
