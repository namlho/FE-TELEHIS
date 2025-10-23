import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://192.168.0.252:3000/maintenance',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;