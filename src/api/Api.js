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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // JWT 토큰이 만료된 경우
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login'; // 로그인 페이지로 리디렉션
    }
    return Promise.reject(error);
  }
);

export const getData = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    console.error('API getData error:', error);
    throw error;
  }
};

export const postData = async (url, data, isFormData = false) => {
  try {
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await api.post(url, data, { headers });
    return response;
  } catch (error) {
    console.error('API postData error:', error);
    throw error;
  }
};

export { api };
