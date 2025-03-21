import api from "../api/custom-axios";


const signup = (userCreationRequest) => {
    return api.post(`/signup`, {
        customId: userCreationRequest.customId,
        userName: userCreationRequest.userName,
        password: userCreationRequest.password
    }); // ✅ Gửi trực tiếp dữ liệu
};

const login = (userCreationRequest) => {
    return api.post(`/login`, userCreationRequest);
};

const logout = (token) => {
     return api.put('/logoutt', {
        token
      });
};

const authenticate = (token) => {
    return api.get(`/authentication/${token}`)
}

const refresh = (refreshToken) => {
    return api.put('/refresh',
        {
            refreshToken
        });
}


export { login, signup, logout, authenticate, refresh};