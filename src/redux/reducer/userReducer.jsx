import { SAVE_AUTH } from '../action/userAction'
import { LOGOUT } from '../action/userAction'

const INITIAL_STATE = {
    user: {
        userName: "",
        customId: '',
        roles: [],
        id: '',
        imageLink: '',
        refreshToken: '',
        phone: '',
        email: '',
    },
    isAuthenticated: false,
    token: '',
}


const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SAVE_AUTH:
            return {
                ...state,
                user: {
                    imageLink: action?.payload?.data?.user?.imageLink,
                    email: action?.payload?.data?.user?.email,
                    refreshToken: action?.payload?.data?.refreshToken,
                    id: action?.payload?.data?.user?.id,
                    phone: action?.payload?.user?.phone,
                   
                    userName: action?.payload?.data?.user?.userName,
                    customId: action?.payload?.data?.user?.customId ,
                    roles: action?.payload?.data?.user?.roles
                },
                isAuthenticated: true,
                token: action?.payload?.data?.token,
            }
        case LOGOUT:
            return {
                user: {
                    
                    userName: "",
                    customId: '',
                    roles: [],
                    id: '',
                    imageLink: '',
                    refreshToken: '',
                    phone: '',
                    email: '',
                },
                isAuthenticated: false,
                token: '',
            }

        default: return state;
    }
}

export default userReducer;