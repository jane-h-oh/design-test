import axios from 'axios';

// MCP 연동을 위한 API 클라이언트
// 실제 구현 시 MCP 핸들러로 교체 가능하도록 추상화

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 등 추가 가능
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리 로직
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;