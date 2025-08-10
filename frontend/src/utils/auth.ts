import { STORAGE_KEYS } from '@/constants';

// Token Management
export const tokenUtils = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  removeTokens: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};

// User Data Management
export const userUtils = {
  getUserData: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  setUserData: (userData: any): void => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },

  removeUserData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },
};

// Authentication Check
export const isAuthenticated = (): boolean => {
  const token = tokenUtils.getAccessToken();
  return token !== null && !tokenUtils.isTokenExpired(token);
};

// Logout Utility
export const logout = (): void => {
  tokenUtils.removeTokens();
  userUtils.removeUserData();
  localStorage.removeItem(STORAGE_KEYS.CART_DATA);
  window.location.href = '/login';
};
