import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/constants';
import type { LoginCredentials, RegisterData, User, AuthResponse } from '@/types/auth.types';
import type { ApiResponse } from '@/types/api.types';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  // Register user
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    return apiService.post<{ accessToken: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
  },

  // Logout user
  logout: async (): Promise<ApiResponse<{}>> => {
    return apiService.post<{}>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
