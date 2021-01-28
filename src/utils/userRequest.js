import { axiosPost } from './http';

function loginRequest(form) {
    return axiosPost('/login', form);
}

function registerRequest(form) {
    return axiosPost('/register', form);
}

function getUsersRequest(keywordObj = {}) {
    return axiosPost('/getUsers', keywordObj);
}

function getUserInfoRequest(username) {
    return axiosPost('/userInfo', { username });
}

function updatePasswordRequest(obj) {
    return axiosPost('/updatePassword', obj);
}

function updatePermissionRequest(username, permission) {
    return axiosPost('/updatePermission', { username, permission });
}

function deleteUserRequest(username) {
    return axiosPost('/deleteUser', { username });
}

export {
    loginRequest,
    registerRequest,
    getUsersRequest,
    getUserInfoRequest,
    updatePasswordRequest,
    updatePermissionRequest,
    deleteUserRequest,
};
