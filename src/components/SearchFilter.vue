<template>
    <div class="search-filter">
        <el-form :model="form" :inline="true" class="search-filter__form">
            <el-form-item
                label="房间类型"
                class="search-filter__item"
                v-if="type"
            >
                <el-select
                    size="small"
                    v-model="form.type"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="房间状态"
                class="search-filter__item"
                v-if="state"
            >
                <el-select
                    size="small"
                    v-model="form.state"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in stateOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="浴室"
                class="search-filter__item"
                v-if="shower"
            >
                <el-select
                    size="small"
                    v-model="form.shower"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="电视" class="search-filter__item" v-if="tv">
                <el-select size="small" v-model="form.tv" placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="权限"
                class="search-filter__item"
                v-if="permission"
            >
                <el-select
                    size="small"
                    v-model="form.permission"
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in permissionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="预订时间"
                class="search-filter__item"
                v-if="date"
            >
                <el-date-picker
                    v-model="form.date"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabledDate="disabledDate"
                    size="small"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                label="入住时间"
                class="search-filter__item"
                v-if="checkIn"
            >
                <el-date-picker
                    v-model="form.checkIn"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabledDate="disabledDate"
                    size="small"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                label="退房时间"
                class="search-filter__item"
                v-if="checkOut"
            >
                <el-date-picker
                    v-model="form.checkOut"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabledDate="disabledDate"
                    size="small"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item
                label="输入搜索"
                class="search-filter__item"
                v-if="search"
            >
                <el-input
                    placeholder="请输入内容"
                    v-model="form.keyword"
                    size="small"
                    class="search-filter__input"
                    @keyup.enter="saveCondition"
                >
                    <template #prepend>
                        <el-select
                            v-model="form.searchKey"
                            placeholder="请选择"
                            class="search-filter__select"
                        >
                            <el-option
                                v-for="option in searchOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="saveCondition"
                    >查询</el-button
                >
                <el-button size="small" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive } from 'vue';

export default {
    name: 'search-filter',
    props: {
        type: {
            type: Boolean,
            default: false,
        },
        state: {
            type: Boolean,
            default: false,
        },
        shower: {
            type: Boolean,
            default: false,
        },
        tv: {
            type: Boolean,
            default: false,
        },
        permission: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Boolean,
            default: false,
        },
        checkIn: {
            type: Boolean,
            default: false,
        },
        checkOut: {
            type: Boolean,
            default: false,
        },
        search: {
            type: Boolean,
            default: false,
        },
        searchOptions: Array,
        modelValue: Array,
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const form = reactive({
            type: '',
            state: '',
            shower: '',
            tv: '',
            permission: '',
            date: [],
            checkIn: [],
            checkOut: [],
            searchKey: '',
            keyword: '',
        });

        const options = [
            {
                value: 0,
                label: '无',
            },
            {
                value: 1,
                label: '有',
            },
        ];

        const typeOptions = [
            {
                value: 0,
                label: '大床间',
            },
            {
                value: 1,
                label: '单人间',
            },
            {
                value: 2,
                label: '双人间',
            },
        ];

        const stateOptions = [
            {
                value: 0,
                label: '可使用',
            },
            {
                value: 1,
                label: '已预订',
            },
        ];

        const permissionOptions = [
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

        const disabledDate = (time) => {
            return time.getTime() < Date.now() - 8.64e7;
        };

        const reset = () => {
            form.type = '';
            form.state = '';
            form.shower = '';
            form.tv = '';
            form.permission = '';
            form.date = [];
            form.checkIn = [];
            form.checkOut = [];
            form.searchKey = '';
            form.keyword = '';
            emit('update:modelValue', []);
        };

        const saveCondition = () => {
            const conditions = [];

            if (props.type && form.type !== '') {
                conditions.push({ key: 'type', value: form.type });
            }

            if (props.state && form.state !== '') {
                conditions.push({ key: 'state', value: form.state });
            }

            if (props.shower && form.shower !== '') {
                conditions.push({ key: 'shower', value: form.shower });
            }
            if (props.tv && form.tv !== '') {
                conditions.push({ key: 'tv', value: form.tv });
            }

            if (props.permission && form.permission !== '') {
                conditions.push({ key: 'permission', value: form.permission });
            }

            if (props.date && form.date.length) {
                form.date[0] = form.date[0].getTime();
                form.date[1] = form.date[1].getTime();

                conditions.push({ key: 'date', value: form.date });
            }

            if (props.checkIn && form.checkIn.length) {
                form.checkIn[0] = form.checkIn[0].getTime();
                form.checkIn[1] = form.checkIn[1].getTime();

                conditions.push({ key: 'checkIn', value: form.checkIn });
            }

            if (props.checkOut && form.checkOut.length) {
                form.checkOut[0] = form.checkOut[0].getTime();
                form.checkOut[1] = form.checkOut[1].getTime();

                conditions.push({ key: 'checkOut', value: form.checkOut });
            }

            if (props.search && form.searchKey && form.keyword) {
                conditions.push({
                    key: 'search',
                    searchKey: form.searchKey,
                    value: form.keyword,
                });
            }

            emit('update:modelValue', conditions);
        };

        return {
            form,
            options,
            typeOptions,
            stateOptions,
            permissionOptions,
            disabledDate,
            reset,
            saveCondition,
        };
    },
};
</script>

<style lang="scss">
.search-filter {
    .search-filter__form {
        background-color: #f2f6fc;
        padding-top: 20px;
        padding-left: 15px;
        border-radius: 8px;
    }

    .search-filter__item {
        margin-right: 18px;
        margin-bottom: 15px;
    }

    .search-filter__input {
        vertical-align: middle;
    }

    .search-filter__select {
        width: 110px;
    }
}

.input-with-select,
.el-input-group__prepend {
    background-color: #fff;
}
</style>
