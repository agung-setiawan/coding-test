import {fetchData} from "./api";

export const getUserClients = async (userID) => {
    try {
        return await fetchData(`/sales-reps/${userID}/clients`);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default getUserClients;