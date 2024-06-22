import axios from 'axios';

// Axios 인스턴스를 생성합니다.
const api = axios.create({
  baseURL: 'http://localhost:9081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터를 추가하여 JWT 토큰을 포함시킵니다.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token'); // 토큰을 localStorage 또는 sessionStorage에서 가져옵니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
