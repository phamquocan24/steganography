import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

export const getModels = async () => {
    const response = await api.get('/models');
    return response.data;
};

export const predictImage = async (file, modelName) => {
    const formData = new FormData();
    formData.append('file', file);
    if (modelName) formData.append('model_name', modelName);

    const response = await api.post('/predict', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
