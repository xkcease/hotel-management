import { axiosGet, axiosPost, axiosPostFile } from './http';

function uploadIntroImgRequest(file) {
    return axiosPostFile('/uploadIntroImg', file);
}

function getHotelIntroRequest() {
    return axiosGet('/getHotelIntro');
}

function getRoomIntroRequest(type) {
    return axiosGet('/getRoomIntro', { type });
}

function updateHotelIntroRequest(form) {
    return axiosPost('/updateHotelIntro', form);
}

function updateRoomIntroRequest(form) {
    return axiosPost('/updateRoomIntro', form);
}

export {
    uploadIntroImgRequest,
    getHotelIntroRequest,
    getRoomIntroRequest,
    updateHotelIntroRequest,
    updateRoomIntroRequest,
};
