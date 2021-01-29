import { axiosPost } from './http';

function loginRequest(form) {
    return axiosPost('/login', form);
}

function registerRequest(form) {
    return axiosPost('/register', form);
}

function getAdminsRequest(keywordObj = {}) {
    return axiosPost('/getAdmins', keywordObj);
}

function getAdminInfoRequest(username) {
    return axiosPost('/adminInfo', { username });
}

function updatePasswordRequest(obj) {
    return axiosPost('/updatePassword', obj);
}

function updatePermissionRequest(username, permission) {
    return axiosPost('/updatePermission', { username, permission });
}

function deleteAdminRequest(username) {
    return axiosPost('/deleteAdmin', { username });
}

export {
    loginRequest,
    registerRequest,
    getAdminsRequest,
    getAdminInfoRequest,
    updatePasswordRequest,
    updatePermissionRequest,
    deleteAdminRequest,
};
