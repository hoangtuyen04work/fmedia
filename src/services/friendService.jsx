import api from "../api/custom-axios";



const getMyFriend = (token) => {
    return  api.get(`/friendship/all/accepted`, {
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

const acceptFriendRequest = (token, friendId) => {
    return  api.put(`/friendship/accept`, friendId, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain' // Explicitly set content type
        },
    });
}

const cancelFriendRequest = (token, friendId) => {
    return  api.delete(`/friendship/delete`, friendId, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain' // Explicitly set content type
        },
    });
}

const sendFriendRequest = (token, friendId) => {
    return api.post(`/friendship/add`, friendId, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain' // Explicitly set content type
        },
    });
}

export { getMyFriend, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, unfriend};