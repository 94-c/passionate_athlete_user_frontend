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

export const getData = async (url, config = {}, setLoading = () => {}) => {
  try {
    setLoading(true); // 로딩 시작
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    console.error('API getData error:', error);
    throw error;
  } finally {
    setLoading(false); // 로딩 완료
  }
};

export const postData = async (url, data, isFormData = false, setLoading = () => {}) => {
  try {
    setLoading(true); // 로딩 시작

    // 동적으로 Content-Type 설정
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };

    // FormData가 아닌 경우 데이터를 JSON으로 직렬화
    const requestBody = isFormData ? data : JSON.stringify(data);

    const response = await api.post(url, requestBody, { headers });
    return response;
  } catch (error) {
    console.error('API postData error:', error);
    throw error;
  } finally {
    setLoading(false); // 로딩 완료
  }
};


export { api };
