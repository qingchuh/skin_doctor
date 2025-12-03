import axios from 'axios';

// Use localhost:8000 as verified in logs
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const analyzeImage = async (imageFile: File, userId: number = 1) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('user_id', userId.toString());

    const response = await api.post('/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getHistory = async (userId: number = 1) => {
    const response = await api.get(`/history/${userId}`);
    return response.data;
};
