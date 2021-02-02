import { axiosGet, axiosPost } from './http';

function getPriceRequest(type) {
    return axiosGet('/getPrice', { type });
}

function updatePriceRequest(form) {
    return axiosPost('/updatePrice', form);
}

export { getPriceRequest, updatePriceRequest };
