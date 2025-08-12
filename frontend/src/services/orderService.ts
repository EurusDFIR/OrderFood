import type { ApiResponse } from '@/types/api.types';
import type { Order, CreateOrderRequest, OrderFilters } from '@/types/order.types';
import { apiService } from './api.service';

class OrderService {
  private readonly baseUrl = '/orders';

  // Create new order
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<Order>> {
    try {
      const response = await apiService.post<Order>(this.baseUrl, data);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to create order',
        data: undefined,
      };
    }
  }

  // Get user's orders
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<{ orders: Order[]; pagination: any }>> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      
      const url = params.toString() ? `${this.baseUrl}?${params.toString()}` : this.baseUrl;
      const response = await apiService.get<{ orders: Order[]; pagination: any }>(url);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to get orders',
        data: undefined,
      };
    }
  }

  // Get single order
  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiService.get<Order>(`${this.baseUrl}/${orderId}`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to get order',
        data: undefined,
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiService.put<Order>(`${this.baseUrl}/${orderId}/cancel`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to cancel order',
        data: undefined,
      };
    }
  }

  // Track order
  async trackOrder(orderId: string): Promise<ApiResponse<{ status: string; estimatedTime: string; history: any[] }>> {
    try {
      const response = await apiService.get<{ status: string; estimatedTime: string; history: any[] }>(`${this.baseUrl}/${orderId}/track`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to track order',
        data: undefined,
      };
    }
  }

  // Reorder (create new order from existing order)
  async reorder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      const response = await apiService.post<Order>(`${this.baseUrl}/${orderId}/reorder`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to reorder',
        data: undefined,
      };
    }
  }
}

export const orderService = new OrderService();
