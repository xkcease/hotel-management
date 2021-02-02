import { axiosPost } from './http';

function getOrdersRequest(state) {
    return axiosPost('/getOrders', { state });
}

function getOrderInfoByOidRequest(oid) {
    return axiosPost('/getOrderInfo', { oid });
}

function getOrderInfoByUidRequest(uid) {
    return axiosPost('/getOrderInfo', { uid });
}

function updateOrderRequest(form) {
    return axiosPost('/updateOrder', form);
}

function checkInRequest(obj, guests) {
    return axiosPost('/checkIn', { obj, guests });
}

function checkOutRequest(oid) {
    return axiosPost('/checkOut', { oid });
}

function deleteOrderRequest(oid) {
    return axiosPost('/deleteOrder', { oid });
}

export {
    getOrdersRequest,
    getOrderInfoByOidRequest,
    getOrderInfoByUidRequest,
    updateOrderRequest,
    checkInRequest,
    checkOutRequest,
    deleteOrderRequest,
};
