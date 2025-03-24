import api from "../api/custom-axios";

const newPost = async (token, newPostData) => {
    try {
        const formData = new FormData();
        if (newPostData.imageFile instanceof File) {
            formData.append('imageFile', newPostData.imageFile);
        }
        if (newPostData.content) {
            formData.append('content', newPostData.content);
        }

        return await api.post(
            `/post/new`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token for authentication
                    'Content-Type': 'multipart/form-data', // Required for FormData
                },
            }
        );
    } catch (error) {
        console.error("Error creating book:", error);
        throw error; // Re-throw the error for further handling
    }
};

const getMyPost = (token, page, size) => {
    return  api.get(`/post/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const getUserPosts = (token, customId, page, size) => {
    return  api.get(`/post/${customId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const like = (token, request) => {
    return  api.post(`/reaction`, request,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const unLike = (token, request) => {
    return  api.put(`/reaction`, request,  {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export { newPost, getMyPost, like, unLike, getUserPosts};