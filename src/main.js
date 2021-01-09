import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import SvgIcon from './components/SvgIcon';
import './icons';
import {
    ElButton,
    ElContainer,
    ElHeader,
    ElMain,
    ElAside,
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElMenu,
    ElMenuItem,
    ElSubmenu,
    ElScrollbar,
    ElDropdown,
    ElDropdownItem,
    ElBadge,
} from 'element-plus';

const app = createApp(App);

app.component('svg-icon', SvgIcon);

app.use(ElButton)
    .use(ElContainer)
    .use(ElHeader)
    .use(ElMain)
    .use(ElAside)
    .use(ElRow)
    .use(ElCol)
    .use(ElForm)
    .use(ElInput)
    .use(ElFormItem)
    .use(ElMenu)
    .use(ElMenuItem)
    .use(ElSubmenu)
    .use(ElScrollbar)
    .use(ElDropdown)
    .use(ElDropdownItem)
    .use(ElBadge);

app.use(store)
    .use(router)
    .mount('#app');
