// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    REFRESH: '/users/refresh',
    LOGOUT: '/users/logout',
    PROFILE: '/users/me',
  },
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
  },
  CART: {
    BASE: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    BASE: '/orders',
    CREATE: '/orders/create',
    HISTORY: '/orders/history',
  },
  PAYMENTS: {
    BASE: '/payments',
    PROCESS: '/payments/process',
    STATUS: '/payments/status',
    CALLBACK: '/payments/callback',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'OrderFood',
  VERSION: '1.0.0',
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 10,
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  MOMO: 'momo',
  BANKING: 'banking',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Bạn không có quyền truy cập. Vui lòng đăng nhập lại.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  PAYMENT_ERROR: 'Lỗi thanh toán. Vui lòng thử lại.',
  OUT_OF_STOCK: 'Sản phẩm đã hết hàng.',
  CART_EMPTY: 'Giỏ hàng trống.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  ADD_TO_CART: 'Đã thêm sản phẩm vào giỏ hàng!',
  UPDATE_CART: 'Cập nhật giỏ hàng thành công!',
  REMOVE_FROM_CART: 'Đã xóa sản phẩm khỏi giỏ hàng!',
  ORDER_SUCCESS: 'Đặt hàng thành công!',
  PAYMENT_SUCCESS: 'Thanh toán thành công!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công!',
} as const;
