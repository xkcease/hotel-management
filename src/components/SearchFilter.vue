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
                label="输入搜索"
                class="search-filter__item"
                v-if="search"
            >
                <el-input
                    placeholder="请输入内容"
                    v-model="form.keyword"
                    size="small"
                    class="search-filter__input"
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
        date: {
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
            date: [],
            searchKey: '',
            keyword: '',
        });

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

        const disabledDate = (time) => {
            return time.getTime() < Date.now() - 8.64e7;
        };

        const reset = () => {
            form.type = '';
            form.date = [];
            form.searchKey = '';
            form.keyword = '';
            emit('update:modelValue', []);
        };

        const saveCondition = () => {
            const conditions = [];

            if (props.type && form.type !== '') {
                conditions.push({ key: 'type', value: form.type });
            }

            if (props.date && form.date.length) {
                form.date[0] = form.date[0].getTime();
                form.date[1] = form.date[1].getTime();

                conditions.push({ key: 'date', value: form.date });
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
            typeOptions,
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
        margin-right: 20px;
        margin-bottom: 0;
    }

    .search-filter__input {
        vertical-align: middle;
    }

    .search-filter__select {
        width: 100px;
    }
}

.input-with-select,
.el-input-group__prepend {
    background-color: #fff;
}
</style>
