import axios from 'axios';
const Environment = import.meta.env;

const api = axios.create({
  baseURL: Environment.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
