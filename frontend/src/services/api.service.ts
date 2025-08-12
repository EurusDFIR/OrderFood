import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '@/constants';
import { tokenUtils, logout } from '@/utils/auth';
import type { ApiResponse } from '@/types/api.types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/users/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          tokenUtils.setAccessToken(accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        logout();
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden');
    } else if (error.response && error.response.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    } else if (!error.response) {
      // Network error
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Generic API request wrapper
const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  params?: any
): Promise<ApiResponse<T>> => {
  try {
    const response = await api.request({
      method,
      url,
      data,
      params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Return structured error response
      const errorResponse: ApiResponse<T> = {
        status: 'error',
        message: error.response?.data?.message || error.message,
        error: error.response?.data?.message || error.message,
      };
      return errorResponse;
    }

    // Handle non-axios errors
    const errorResponse: ApiResponse<T> = {
      status: 'error',
      message: 'An unexpected error occurred',
      error: 'Internal error',
    };
    return errorResponse;
  }
};

// Export API methods
export const apiService = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> => 
    apiRequest<T>('GET', url, undefined, params),
  
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> => 
    apiRequest<T>('POST', url, data),
  
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> => 
    apiRequest<T>('PUT', url, data),
  
  delete: <T>(url: string): Promise<ApiResponse<T>> => 
    apiRequest<T>('DELETE', url),
};

export default api;
