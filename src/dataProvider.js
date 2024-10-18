// src/dataProvider.js
import { fetchUtils } from 'react-admin';

const API_URL = 'https://mystar.monster/api';
const httpClient = (url, options = {}) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth && auth.token) {
        options.headers = new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: auth.token,
            ...options.headers,
        });
    }
    return fetchUtils.fetchJson(url, options);
};

export default httpClient;
