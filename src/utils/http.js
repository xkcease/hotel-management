import axios from 'axios';
import { useRouter } from 'vue-router';

const instance = axios.create({
    baseURL: 'http://localhost:9092',
    timeout: 5000,
});

instance.interceptors.request.use(config => {
    if (config.url === '/login') {
        return config;
    }

    let token = sessionStorage.getItem('token') ?? '';
    config.headers['Authorization'] = token;

    return config;
});

instance.interceptors.response.use(response => {
    if (response.config.url !== '/login') {
        if (response.data.tokenState) {
            console.log(response.data.msg);
            useRouter().push({ name: 'Login' });
            return response;
        }
    }

    return response;
});

function axiosGet(url, params) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'get',
            params: { ...params },
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function axiosPost(url, data) {
    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: 'post',
            data: { ...data },
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export { axiosGet, axiosPost };
