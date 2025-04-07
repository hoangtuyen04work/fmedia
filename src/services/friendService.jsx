import api from "../api/custom-axios";



const getMyFriend = (token) => {
    return  api.get(`/friendship/all/messing`, {
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

const getFriendsList = (token, pageNum, size) => {
    return  api.get(`/friendship/all/accepted?page=${pageNum}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const getFriendsRequests = (token, pageNum, size) => {
    return  api.get(`/friendship/all/waiting?page=${pageNum}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const getSentRequests = (token, pageNum, size) => {
    return  api.get(`/friendship/all/pending?page=${pageNum}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export { getMyFriend, sendFriendRequest, cancelFriendRequest, acceptFriendRequest, getFriendsRequests, getSentRequests, getFriendsList};