import { axiosPost } from './http';

function loginRequest(form) {
    return axiosPost('/login', form);
}

function getUserInfoRequest(username) {
    return axiosPost('/userInfo', { username });
}

function updatePasswordRequest(obj) {
    return axiosPost('/updatePassword', obj);
}

export { loginRequest, getUserInfoRequest, updatePasswordRequest };
