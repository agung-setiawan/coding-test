import {fetchData} from "./api";

export const getUserFetch = async () => {
    try {
        return await fetchData('/sales-reps');
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getUserFetch;