import { ElLoading } from 'element-plus';

let loading = null;

function start(target = '.hall__main') {
    loading = ElLoading.service({ target });
}

function close() {
    if (loading) {
        loading.close();
    }
}

export default {
    start,
    close,
};
