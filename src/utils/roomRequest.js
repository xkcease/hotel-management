import { axiosGet, axiosPost, axiosPostFile } from './http';

function addRoomRequest(form) {
    return axiosPost('/addRoom', form);
}

function uploadImgRequest(file) {
    return axiosPostFile('/uploadImg', file);
}

function getRoomsRequest() {
    return axiosGet('/getRooms');
}

function getRoomInfoRequest(number) {
    return axiosGet('/getRoomInfo', { number });
}

function updateRoomRequest(form) {
    return axiosPost('/updateRoom', form);
}

function deleteRoomRequest(number) {
    return axiosPost('/deleteRoom', { number });
}

export {
    addRoomRequest,
    uploadImgRequest,
    getRoomsRequest,
    getRoomInfoRequest,
    updateRoomRequest,
    deleteRoomRequest,
};
