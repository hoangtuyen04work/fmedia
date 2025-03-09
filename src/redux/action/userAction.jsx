export const SIGNUP = 'SIGNUP';
export const SAVE_AUTH = "SAVE_AUTH";
export const LOGOUT = "LOGOUT";




export const doSignup = (data) => {
    return {
        type: SIGNUP,
        payload: data
    };
};


export const saveAuth = (data) => {
    return {
        type: SAVE_AUTH,
        payload: data
    }
}

export const doLogout = () => {
    return {
        type: LOGOUT,
    }
}