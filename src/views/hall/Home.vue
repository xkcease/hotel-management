<template>
    <div class="home">
        <p>this is home</p>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
// import loading from '../../utils/loading';

export default {
    name: 'Home',
    setup() {
        // loading.close();
        onMounted(() => {
            console.log('home');
        });

        console.log(useStore().state.permission);

        return {};
    },
};
</script>
