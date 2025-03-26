import api from "../api/custom-axios";



const searchUser = (token, customId) => {
    return  api.get(`/search/user?customId=${customId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


const searchPost = (token, keyWord, currentPage, size) => {
    return  api.get(`/post/search?keyWord=${keyWord}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


export { searchUser, searchPost};