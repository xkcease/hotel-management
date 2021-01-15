import { axiosPost } from './http';

function loginRequest(form) {
    return axiosPost('/login', form);
}

export { loginRequest };
