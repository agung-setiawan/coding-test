import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // This now points to your Next.js backend route
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

export const postData = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error.response?.data || error.message);
        throw error;
    }
};

export default api;