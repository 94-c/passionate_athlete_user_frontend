import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9081/api/v1',
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const postData = async (url, data, isMultipart = false) => {
  try {
    console.log('Sending request to:', url);
    console.log('Data:', data);
    const headers = isMultipart
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };
    const response = await api.post(url, data, { headers });
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error occurred:', error);
    throw error;
  }
};

export { api, postData };
