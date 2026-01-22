import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables.js';

const { VITE_API_URL } = getEnvVariables();

const yourTablesApi = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true
});

// Todo: Add interceptors
yourTablesApi.interceptors.request.use( config => {

  config.headers = {
    ...config.headers,
    // 'x-token': localStorage.getItem('token')
  }

  return config
})

export default yourTablesApi;