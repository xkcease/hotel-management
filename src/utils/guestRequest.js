import { axiosGet } from './http';

function getGuestsRequest(oid) {
    return axiosGet('/getGuests', { oid });
}

export { getGuestsRequest };
