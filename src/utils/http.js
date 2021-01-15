import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9092',
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
