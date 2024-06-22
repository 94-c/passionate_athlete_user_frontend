// src/utils/Jwt.js
import { jwtDecode } from 'jwt-decode'; // 수정된 부분

export const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};
