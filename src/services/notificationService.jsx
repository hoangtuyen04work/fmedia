import api from "../api/custom-axios";

const getNotification = (token, page, size) => {
    return  api.get(`/notification?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const readNotification = (token) => {
    return  api.post(`/notification/read`, null , {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export { getNotification , readNotification};
