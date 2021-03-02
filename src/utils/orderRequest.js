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

function checkInRequest(obj, contact, guests) {
    return axiosPost('/checkIn', { obj, contact, guests });
}

function checkOutRequest(oid, rid) {
    return axiosPost('/checkOut', { oid, rid });
}

function deleteOrderRequest(oid, rid) {
    return axiosPost('/deleteOrder', { oid, rid });
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
