import type { ApiResponse } from '@/types/api.types';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart.types';
import { apiService } from './api.service';

class CartService {
  private readonly baseUrl = '/cart';

  // Get current user's cart
  async getCart(): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.get<Cart>(this.baseUrl);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to get cart',
        data: undefined,
      };
    }
  }

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.post<Cart>(`${this.baseUrl}/add`, data);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to add item to cart',
        data: undefined,
      };
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.put<Cart>(`${this.baseUrl}/items/${itemId}`, data);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to update cart item',
        data: undefined,
      };
    }
  }

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    try {
      const response = await apiService.delete<Cart>(`${this.baseUrl}/items/${itemId}`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to remove item from cart',
        data: undefined,
      };
    }
  }

  // Clear entire cart
  async clearCart(): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiService.delete<{ message: string }>(this.baseUrl);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to clear cart',
        data: undefined,
      };
    }
  }

  // Get cart item count
  async getCartCount(): Promise<ApiResponse<{ count: number }>> {
    try {
      const response = await apiService.get<{ count: number }>(`${this.baseUrl}/count`);
      return response;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message || 'Failed to get cart count',
        data: undefined,
      };
    }
  }
}

export const cartService = new CartService();
