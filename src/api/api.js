import axios from 'axios';

// Axios 인스턴스를 생성합니다.
const api = axios.create({
  baseURL: 'http://localhost:9081/api/v1',
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

// POST 요청을 보낼 때 Content-Type을 동적으로 설정하는 예제입니다.
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
