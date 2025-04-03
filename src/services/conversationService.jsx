import api from "../api/custom-axios";

const getConversation = (token, conversationId, page, size) => {
    return  api.get(`/conversation?id=${conversationId}&page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const editMessage = (token, messageId, content) => {
    return  api.put(`/conversation/${messageId}`, content, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain' // Explicitly set content type
        },
    });
}

const deleteMessage = (token, messageId) => {
    return  api.put(`/conversation`, messageId, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain' // Explicitly set content type
        },
    });
}

export {getConversation, editMessage, deleteMessage };