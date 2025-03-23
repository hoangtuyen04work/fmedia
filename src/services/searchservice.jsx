import api from "../api/custom-axios";



const searchUser = (token, customId) => {
    return  api.get(`/search/user?customId=${customId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}



export { searchUser};