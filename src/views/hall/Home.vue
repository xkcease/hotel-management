<template>
    <div class="home">
        <el-calendar v-model="date.value"> </el-calendar>
    </div>
</template>

<script>
import { reactive } from 'vue';

export default {
    name: 'Home',
    setup() {
        const date = reactive({
            value: new Date(),
        });

        return {
            date,
        };
    },
};
</script>
<style lang="scss">
.home {
    margin: 10px auto;
}
</style>
