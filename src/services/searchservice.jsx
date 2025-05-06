import api from "../api/custom-axios";



const searchUser = (token, customId, pageNum, size) => {
    return  api.get(`/search/user?customId=${customId}&page=${pageNum}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


const searchPost = (token, keyWord, currentPage, size) => {
    return  api.get(`/search/post?keyWord=${keyWord}&page=${currentPage}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


export { searchUser, searchPost};