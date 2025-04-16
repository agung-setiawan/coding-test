import {postData} from "./api";

export const askAI = async (body) => {
    try {
        return await postData('/ai/ask-me', body);
    } catch (error) {
        console.error('API Proxy Error:', error.message);
        let res;
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default askAI;