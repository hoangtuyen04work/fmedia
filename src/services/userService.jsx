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
export { getMyProfile, getUserProfileByCustomId };