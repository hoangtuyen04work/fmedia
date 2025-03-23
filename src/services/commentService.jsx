import api from "../api/custom-axios";

const getAllComment = (token, postId) => {
    return  api.get(`/post/all?id=${postId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
const sendComment = (token, request) => {
    const formData = new FormData();
        if (request.imageFile instanceof File) {
            formData.append('imageFile', request.imageFile);
        }
        if (request.content) {
            formData.append('content', request.content);
        }
        if (request.postId) {
            formData.append('postId', request.postId);
        }

        return  api.post(
            `/comment`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token for authentication
                    'Content-Type': 'multipart/form-data', // Required for FormData
                },
            }
        );
}

export {getAllComment, sendComment };