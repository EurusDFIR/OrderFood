import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { Cart, CartItem } from "@/types/cart.types";
import { cartService } from "@/services/cartService";
import { useAuth } from "@/context/AuthContext";

// Cart State
interface CartState {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// Cart Actions
type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: Cart }
  | { type: "CLEAR_CART" }
  | { type: "UPDATE_ITEM_COUNT"; payload: number };

// Initial State
const initialState: CartState = {
  cart: null,
  items: [],
  itemCount: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
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

    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        items: action.payload?.items || [],
        itemCount: (action.payload?.items || []).reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        totalAmount: action.payload?.totalAmount || 0,
        isLoading: false,
        error: null,
      };

    case "CLEAR_CART":
      return {
        ...initialState,
      };

    case "UPDATE_ITEM_COUNT":
      return {
        ...state,
        itemCount: action.payload,
      };

    default:
      return state;
  }
};

// Cart Context Type
interface CartContextType {
  state: CartState;
  loadCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateCartItem: (itemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCartCount: () => Promise<void>;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider Props
interface CartProviderProps {
  children: ReactNode;
}

// Cart Provider Component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from server
  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await cartService.getCart();

      if (response.status === "success" && response.data) {
        dispatch({ type: "SET_CART", payload: response.data });
      } else {
        // If no cart exists, initialize empty cart state
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to load cart",
      });
    }
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = useCallback(
    async (productId: string, quantity: number = 1): Promise<boolean> => {
      if (!isAuthenticated) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please login to add items to cart",
        });
        return false;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await cartService.addToCart({ productId, quantity });

        if (response.status === "success" && response.data) {
          dispatch({ type: "SET_CART", payload: response.data });
          return true;
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to add item to cart",
          });
          return false;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to add item to cart",
        });
        return false;
      }
    },
    [isAuthenticated]
  );

  // Update cart item quantity
  const updateCartItem = useCallback(
    async (itemId: string, quantity: number): Promise<boolean> => {
      if (!isAuthenticated) {
        return false;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await cartService.updateCartItem(itemId, { quantity });

        if (response.status === "success" && response.data) {
          dispatch({ type: "SET_CART", payload: response.data });
          return true;
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to update cart item",
          });
          return false;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to update cart item",
        });
        return false;
      }
    },
    [isAuthenticated]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (itemId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        return false;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await cartService.removeFromCart(itemId);

        if (response.status === "success" && response.data) {
          dispatch({ type: "SET_CART", payload: response.data });
          return true;
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to remove item from cart",
          });
          return false;
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Failed to remove item from cart",
        });
        return false;
      }
    },
    [isAuthenticated]
  );

  // Clear entire cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await cartService.clearCart();

      if (response.status === "success") {
        dispatch({ type: "CLEAR_CART" });
        return true;
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to clear cart",
        });
        return false;
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to clear cart",
      });
      return false;
    }
  }, [isAuthenticated]);

  // Refresh cart count only
  const refreshCartCount = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "UPDATE_ITEM_COUNT", payload: 0 });
      return;
    }

    try {
      const response = await cartService.getCartCount();

      if (response.status === "success" && response.data) {
        dispatch({ type: "UPDATE_ITEM_COUNT", payload: response.data.count });
      }
    } catch (error: any) {
      // Silently fail for cart count refresh
      console.error("Failed to refresh cart count:", error);
    }
  }, [isAuthenticated]);

  // Load cart when user authentication status changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Context value
  const value: CartContextType = {
    state,
    loadCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
