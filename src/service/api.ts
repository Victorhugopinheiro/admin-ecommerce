import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,

    timeout: 10000,
});


if (import.meta.env.DEV) {
  console.log('[API] baseURL =', api.defaults.baseURL);
}

export default api;