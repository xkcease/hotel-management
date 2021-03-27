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
    ElDropdownMenu,
    ElDropdownItem,
    ElBadge,
    ElLoading,
    ElSelect,
    ElOption,
    ElMessage,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElTable,
    ElTableColumn,
    ElPopconfirm,
    ElImage,
    ElUpload,
    ElDialog,
    ElTag,
    ElCheckbox,
    ElDivider,
    ElDatePicker,
    ElCalendar,
    ElCascader,
    ElSteps,
    ElStep,
    ElCard,
} from 'element-plus';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale';

locale.use(lang);

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
    .use(ElDropdownMenu)
    .use(ElDropdownItem)
    .use(ElBadge)
    .use(ElLoading)
    .use(ElSelect)
    .use(ElOption)
    .use(ElMessage)
    .use(ElBreadcrumb)
    .use(ElBreadcrumbItem)
    .use(ElTable)
    .use(ElTableColumn)
    .use(ElPopconfirm)
    .use(ElImage)
    .use(ElUpload)
    .use(ElDialog)
    .use(ElTag)
    .use(ElCheckbox)
    .use(ElDivider)
    .use(ElDatePicker)
    .use(ElCalendar)
    .use(ElCascader)
    .use(ElSteps)
    .use(ElStep)
    .use(ElCard);

app.use(store)
    .use(router)
    .mount('#app');
