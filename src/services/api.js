import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://v5-api-production.up.railway.app'
    //baseURL: 'http://localhost:4000'
})