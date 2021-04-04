<template>
    <div class="modify-room">
        <div class="form__title">
            <h2>修改房间</h2>
        </div>
        <div class="modify-room__form">
            <el-form
                :model="form"
                :rules="rules"
                ref="formElem"
                label-position="right"
                label-width="80px"
            >
                <p class="form__msg">{{ errorMsg }}</p>
                <el-form-item prop="number" label="房号">
                    <el-input
                        v-model="form.number"
                        placeholder="长度3-8的数字/字母"
                        class="modify-room__input"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" class="modify-room__input">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="浴室">
                    <el-select v-model="form.shower" class="modify-room__input">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电视">
                    <el-select v-model="form.tv" class="modify-room__input">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="extra" label="额外内容">
                    <el-input
                        type="textarea"
                        v-model="form.extra"
                        placeholder="输入其他内容"
                        maxlength="254"
                        show-word-limit
                    >
                        <template #prefix>
                            <i class="el-icon-lock form__icon"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-upload
                        ref="uploadElem"
                        class="l-flex"
                        action="http://localhost:9092/uploadImg"
                        :http-request="uploadImg"
                        list-type="picture-card"
                        :file-list="upload.list"
                        :auto-upload="false"
                        :limit="1"
                        :on-preview="imgPreview"
                        :on-change="verifyFileType"
                        :on-success="onSuccessHandle"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <div style="text-align: center">
                            <img :src="upload.img" alt="" />
                        </div>
                    </el-dialog>
                    <p class="modify-room__tip">只能上传一张图片</p>
                </el-form-item> -->
                <el-form-item>
                    <el-button
                        class="form__btn"
                        type="primary"
                        @click="ModifyRoom"
                        >更改房间</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import loading from '@/utils/loading';
import {
    getRoomInfoRequest,
    updateRoomRequest,
    uploadImgRequest,
} from '@/utils/roomRequest';

export default {
    name: 'ModifyRoom',
    setup() {
        const router = useRouter();
        const route = useRoute();

        const formElem = ref(null);
        const form = reactive({
            oldNumber: '',
            number: '',
            type: 0,
            shower: 0,
            tv: 0,
            extra: '',
        });

        const uploadElem = ref(null);
        const upload = reactive({
            oldImgName: '',
            img: '',
            list: [],
        });

        const rules = reactive({
            number: [
                { required: true, message: '房间号不能为空', trigger: 'blur' },
                {
                    pattern: /^[0-9A-Za-z]{3,8}$/,
                    message: '长度3-8的数字或字母',
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

        let errorMsg = ref('');
        watch(form, () => {
            if (errorMsg.value) {
                errorMsg.value = '';
            }
        });

        // 获取房间信息
        getRoomInfoRequest(route.query.number)
            .then((res) => {
                if (res.state) {
                    form.oldNumber = res.room.number;
                    form.number = res.room.number;
                    form.type = res.room.type;
                    form.shower = res.room.shower;
                    form.tv = res.room.tv;
                    form.extra = res.room.extra;
                    upload.img = res.room.img;
                    let name =
                        res.room.number + '.' + res.room.img.split('.').pop();
                    upload.oldImgName = name;
                    upload.list.push({ name, url: res.room.img });
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

        const onSuccessHandle = (response, file, fileList) => {
            fileList.splice(0, 1);
        };

        const uploadImg = (obj) => {
            let formData = new FormData();
            formData.append('file', obj.file);
            formData.append('number', form.number);
            formData.append('oldImgName', upload.oldImgName);

            uploadImgRequest(formData).then((res) => {
                loading.close();
                obj.onSuccess();
                console.log(res.msg);
                router.push({ name: 'RoomList', params: { changed: true } });
            });
        };

        const ModifyRoom = () => {
            formElem.value.validate((valid) => {
                if (valid) {
                    updateRoomRequest(form)
                        .then((res) => {
                            if (res.state) {
                                // uploadElem.value.submit();
                                ElMessage.success(res.msg);
                                router.push({ name: 'RoomList' });
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
            errorMsg,
            ModifyRoom,
            dialogVisible,
            imgPreview,
            verifyFileType,
            onSuccessHandle,
            uploadImg,
        };
    },
};
</script>

<style lang="scss">
.modify-room {
    padding: 20px;

    .modify-room__form {
        width: 50%;
        margin: 16px;
    }

    .modify-room__input {
        width: 50%;
    }

    .modify-room__tip {
        font-size: 12px;
        color: $info-color;
    }
}
</style>
