import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type {
  Product,
  ProductsQuery,
  ProductFilters,
} from "@/types/product.types";
import { productService } from "@/services/productService";

// Product State
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  searchQuery: string;
}

// Product Actions
type ProductAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: { products: Product[]; pagination: any } }
  | { type: "SET_CURRENT_PRODUCT"; payload: Product | null }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_FEATURED_PRODUCTS"; payload: Product[] }
  | { type: "SET_FILTERS"; payload: ProductFilters }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "CLEAR_FILTERS" };

// Initial State
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  searchQuery: "",
};

// Product Reducer
const productReducer = (
  state: ProductState,
  action: ProductAction
): ProductState => {
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

    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };

    case "SET_CURRENT_PRODUCT":
      return {
        ...state,
        currentProduct: action.payload,
        isLoading: false,
        error: null,
      };

    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };

    case "SET_FEATURED_PRODUCTS":
      return {
        ...state,
        featuredProducts: action.payload,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {},
        searchQuery: "",
      };

    default:
      return state;
  }
};

// Product Context Type
interface ProductContextType {
  state: ProductState;
  loadProducts: (params?: ProductsQuery) => Promise<void>;
  loadProduct: (id: string) => Promise<void>;
  loadCategories: () => Promise<void>;
  loadFeaturedProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
}

// Create Context
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Product Provider Props
interface ProductProviderProps {
  children: ReactNode;
}

// Product Provider Component
export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load products with optional filters and pagination
  const loadProducts = useCallback(
    async (params?: ProductsQuery) => {
      console.log("🔄 loadProducts called with params:", params);
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const queryParams = {
          page: 1,
          limit: 12,
          ...state.filters, // Include current filters
          ...params,
        };

        console.log("📡 Calling API with:", queryParams);
        const response = await productService.getProducts(queryParams);
        console.log("📦 ProductContext loadProducts response:", response);

        if (response.status === "success") {
          // Handle server response structure: {status, results, pagination, data: {products: []}}
          const serverResponse = response as any;
          const products = serverResponse.data?.products || [];
          const pagination = serverResponse.pagination || {
            page: 1,
            limit: 12,
            total: products.length,
            pages: 1,
          };

          console.log(
            "✅ Parsed products:",
            products.length,
            "items, pagination:",
            pagination
          );

          dispatch({
            type: "SET_PRODUCTS",
            payload: {
              products: products,
              pagination: pagination,
            },
          });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Failed to load products",
          });
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Network error",
        });
      }
    },
    [state.filters] // Include filters in dependencies
  );

  // Load single product
  const loadProduct = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await productService.getProduct(id);

      if (response.status === "success" && response.data) {
        dispatch({ type: "SET_CURRENT_PRODUCT", payload: response.data });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: response.message || "Failed to load product",
        });
      }
    } catch (error: any) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Network error",
      });
    }
  }, []);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const response = await productService.getCategories();

      if (response.status === "success" && response.data) {
        dispatch({ type: "SET_CATEGORIES", payload: response.data });
      }
    } catch (error: any) {
      console.error("Failed to load categories:", error);
    }
  }, []);

  // Load featured products
  const loadFeaturedProducts = useCallback(async () => {
    try {
      const response = await productService.getFeaturedProducts();

      if (response.status === "success" && response.data) {
        dispatch({ type: "SET_FEATURED_PRODUCTS", payload: response.data });
      }
    } catch (error: any) {
      console.error("Failed to load featured products:", error);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(
    async (query: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });

      try {
        // Use current filters when searching
        const response = await productService.searchProducts(
          query,
          state.filters
        );

        if (response.status === "success") {
          console.log("🔍 Search products response:", response);

          // Handle server response structure: {status, results, pagination, data: {products: []}}
          const serverResponse = response as any;
          const products = serverResponse.data?.products || [];
          const pagination = serverResponse.pagination || {
            page: 1,
            limit: 12,
            total: products.length,
            pages: 1,
          };

          dispatch({
            type: "SET_PRODUCTS",
            payload: {
              products,
              pagination,
            },
          });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: response.message || "Search failed",
          });
        }
      } catch (error: any) {
        dispatch({
          type: "SET_ERROR",
          payload: error.message || "Network error",
        });
      }
    },
    [] // Remove state dependencies
  );

  // Set filters
  const setFilters = useCallback((filters: ProductFilters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  // Context value
  const value: ProductContextType = useMemo(
    () => ({
      state,
      loadProducts,
      loadProduct,
      loadCategories,
      loadFeaturedProducts,
      searchProducts,
      setFilters,
      clearFilters,
      setSearchQuery,
    }),
    [
      state,
      loadProducts,
      loadProduct,
      loadCategories,
      loadFeaturedProducts,
      searchProducts,
      setFilters,
      clearFilters,
      setSearchQuery,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
