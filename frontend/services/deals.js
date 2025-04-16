import {fetchData} from "./api";

export const getUserDeals = async (userID) => {
    try {
        return await fetchData(`/sales-reps/${userID}/deals`);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getUserTotalDeals = async () => {
    try {
        return await fetchData(`/sales-reps/total-deals`);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getUserTotalDealsByStatus = async () => {
    try {
        return await fetchData(`/sales-reps/deals-by-status`);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getTotalDealsByStatus = async () => {
    try {
        return await fetchData(`/sales-reps/total/by-status`);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default { getUserDeals, getUserTotalDeals, getUserTotalDealsByStatus, getTotalDealsByStatus };