import api from "../api/custom-axios";


const getMyProfile = async (token) => {
    try {
        const response = await api.get(`/user/my_profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Trả về dữ liệu thực tế từ API
    } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};


const getUserProfileByCustomId = async (token, customId) => {
    try {
        const response = await api.get(`/user/profile?customId=${customId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response
    } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

const editUserInform = async (token, data) => {
    console.log(data)
    const formData = new FormData();
        if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }
    formData.append('customId', data.customId);
    formData.append('userName', data.userName);
    formData.append('bio', data.bio);
    formData.append('dob', data.dob);
    formData.append('address', data.address);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    try {
        const response = await api.put('/user/edit',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
        throw error;
    }
};

export { getMyProfile, getUserProfileByCustomId, editUserInform };