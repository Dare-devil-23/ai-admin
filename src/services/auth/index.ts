import { fetch } from '../axios';
import { Auth, cookieUtils } from '../utils';

interface LoginParams {
  email: string;
  password: string;
}

export const login = async (params: LoginParams) => {
  try {
    const response = await fetch.post('/auth/password/login', params);
    if (response.data?.token) {
      // Set the auth token cookie
      cookieUtils.create(
        Auth.TOKEN,
        response.data.token,
        Auth.EXPIRING_IN_DAYS,
        window.location.hostname
      );
      return response.data;
    }
    throw new Error('No token received');
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  cookieUtils.delete(Auth.TOKEN);
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!cookieUtils.get(Auth.TOKEN);
};

export const checkAuthAndRedirect = () => {
  if (isAuthenticated()) {
    if (window.location.pathname === '/login') {
      window.location.href = '/';
    }
  } else {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};
