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

function getRoomOptionsRequest(type) {
    return axiosGet('/getRoomOptions', { type });
}

function updateRoomRequest(form) {
    return axiosPost('/updateRoom', form);
}

function deleteRoomRequest(number, img) {
    return axiosPost('/deleteRoom', { number, img });
}

export {
    addRoomRequest,
    uploadImgRequest,
    getRoomsRequest,
    getRoomInfoRequest,
    getRoomOptionsRequest,
    updateRoomRequest,
    deleteRoomRequest,
};
