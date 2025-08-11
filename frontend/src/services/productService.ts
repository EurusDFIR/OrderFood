import { apiService } from './api.service';
import { API_ENDPOINTS } from '@/constants';
import type { Product, ProductsQuery, ProductFilters } from '@/types/product.types';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params?: ProductsQuery): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.BASE, params);
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<ApiResponse<Product>> => {
    return apiService.get<Product>(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  },

  // Search products
  searchProducts: async (query: string, filters?: ProductFilters): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return apiService.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.SEARCH, {
      q: query,
      ...filters,
    });
  },

  // Get product categories
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    return apiService.get<string[]>(API_ENDPOINTS.PRODUCTS.CATEGORIES);
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<ApiResponse<Product[]>> => {
    return apiService.get<Product[]>(`${API_ENDPOINTS.PRODUCTS.BASE}/featured`, { limit });
  },

  // Get products by category
  getProductsByCategory: async (category: string, params?: ProductsQuery): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    return apiService.get<PaginatedResponse<Product>>(`${API_ENDPOINTS.PRODUCTS.BASE}/category/${category}`, params);
  },
};
