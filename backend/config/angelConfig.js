import { SmartAPI } from 'smartapi-javascript';
import dotenv from 'dotenv';
dotenv.config();

const angelSetup = () => {
    return new SmartAPI({
        api_key: process.env.ANGEL_API_KEY,
        // Optional: access_token and refresh_token can be handled here if needed
    });
};

export const smartApi = angelSetup();
