import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
    ElButton,
    ElContainer,
    ElHeader,
    ElMain,
    ElAside,
    ElRow,
    ElCol,
} from 'element-plus';

const app = createApp(App);

app.use(ElButton)
    .use(ElContainer)
    .use(ElHeader)
    .use(ElMain)
    .use(ElAside)
    .use(ElRow)
    .use(ElCol);

app.use(store)
    .use(router)
    .mount('#app');
