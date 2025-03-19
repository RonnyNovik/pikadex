import axios from 'axios';


const baseUrl = process.env.POKEAPI_BASE_URL;
export const httpClient = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 5000,
});

