import {jwtDecode} from 'jwt-decode';

export const parseJwt = (token) => {
  try {
    console.error('Invalid token:', token);
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};