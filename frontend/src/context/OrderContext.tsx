import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type {
  Order,
  CreateOrderRequest,
  OrderFilters,
} from "@/types/order.types";
import { orderService } from "@/services/orderService";
import { useAuth } from "@/context/AuthContext";

// Order State
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Order Actions
type OrderAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ORDERS"; payload: { orders: Order[]; pagination: any } }
  | { type: "SET_CURRENT_ORDER"; payload: Order | null }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "CLEAR_ORDERS" };

// Initial State
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Order Reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "SET_ORDERS":
      return {
        ...state,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case "SET_CURRENT_ORDER":
      return {
        ...state,
        currentOrder: action.payload,
        isLoading: false,
        error: null,
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        isLoading: false,
        error: null,
      };

    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
        currentOrder:
          state.currentOrder?._id === action.payload._id
            ? action.payload
            : state.currentOrder,
        isLoading: false,
        error: null,
      };

    case "CLEAR_ORDERS":
      return initialState;

    default:
      return state;
  }
};

// Order Context Type
interface OrderContextType {
  state: OrderState;
  createOrder: (data: CreateOrderRequest) => Promise<Order | null>;
  loadOrders: (filters?: OrderFilters) => Promise<void>;
  loadOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  trackOrder: (orderId: string) => Promise<any>;
  reorder: (orderId: string) => Promise<Order | null>;
  clearOrders: () => void;
}

// Create Context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Order Provider Props
interface OrderProviderProps {
  children: ReactNode;
}

// Order Provider Component
export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Create new order
  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order | null> => {
      if (!isAuthenticated) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please login to create order",
        });
        return null;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await orderService.createOrder(data);

        console.log("📦 OrderContext - createOrder response:", response);

        if (response.status === "success" && response.data) {
          // Backend returns {status: 'success', data: {order: ...}}
          const order = (response.data as any).order || response.data;
          console.log("📦 OrderContext - extracted order:", order);

          dispatch({ type: "ADD_ORDER", payload: order });
          return order;
        } else {
          console.error("📦 OrderContext - createOrder failed:", response);
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to create order",
          });
          return null;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to create order",
        });
        return null;
      }
    },
    [isAuthenticated]
  );

  // Load orders
  const loadOrders = useCallback(
    async (filters?: OrderFilters) => {
      if (!isAuthenticated) {
        dispatch({ type: "CLEAR_ORDERS" });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await orderService.getOrders(filters);

        if (response.status === "success" && response.data) {
          dispatch({ type: "SET_ORDERS", payload: response.data });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to load orders",
          });
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to load orders",
        });
      }
    },
    [isAuthenticated]
  );

  // Load single order
  const loadOrder = useCallback(async (orderId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await orderService.getOrder(orderId);

      console.log("📦 OrderContext - loadOrder response:", response);

      if (response.status === "success" && response.data) {
        // Backend returns {status: 'success', data: {order: ...}}
        const order = (response.data as any).order || response.data;
        console.log("📦 OrderContext - loaded order:", order);

        dispatch({ type: "SET_CURRENT_ORDER", payload: order });
      } else {
        console.error("📦 OrderContext - loadOrder failed:", response);
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to load order",
        });
      }
    } catch (error: any) {
      console.error("📦 OrderContext - loadOrder error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to load order",
      });
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await orderService.cancelOrder(orderId);

      if (response.status === "success" && response.data) {
        dispatch({ type: "UPDATE_ORDER", payload: response.data });
        return true;
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to cancel order",
        });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to cancel order",
      });
      return false;
    }
  }, []);

  // Track order
  const trackOrder = useCallback(async (orderId: string) => {
    try {
      const response = await orderService.trackOrder(orderId);

      if (response.status === "success" && response.data) {
        return response.data;
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to track order",
        });
        return null;
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to track order",
      });
      return null;
    }
  }, []);

  // Reorder
  const reorder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await orderService.reorder(orderId);

        if (response.status === "success" && response.data) {
          dispatch({ type: "ADD_ORDER", payload: response.data });
          return response.data;
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to reorder",
          });
          return null;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to reorder",
        });
        return null;
      }
    },
    []
  );

  // Clear orders
  const clearOrders = useCallback(() => {
    dispatch({ type: "CLEAR_ORDERS" });
  }, []);

  // Load orders when user authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      clearOrders();
    }
  }, [isAuthenticated, loadOrders, clearOrders]);

  // Context value
  const value: OrderContextType = {
    state,
    createOrder,
    loadOrders,
    loadOrder,
    cancelOrder,
    trackOrder,
    reorder,
    clearOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
