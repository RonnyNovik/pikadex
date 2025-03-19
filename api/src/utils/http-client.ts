import axios from 'axios';


const baseUrl = process.env.POKEAPI_BASE_URL;
export const httpClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
});

