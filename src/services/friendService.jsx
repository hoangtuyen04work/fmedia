import api from "../api/custom-axios";



const getMyFriend = (token) => {
    return  api.get(`/friendship/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const unfriend = (token) => {
    return  api.get(`/friendship/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const acceptFriendRequest = (token) => {
    return  api.get(`/friendship/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const cancelFriendRequest = (token) => {
    return  api.get(`/friendship/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const sendFriendRequest = (token) => {
    return  api.get(`/friendship/all`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


export { getMyFriend, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, unfriend};