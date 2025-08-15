import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthContextType,
} from "@/types/auth.types";
import { authService } from "@/services/authService";
import { tokenUtils, userUtils } from "@/utils/auth";

// Auth State
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "LOAD_USER_START" }
  | { type: "LOAD_USER_SUCCESS"; payload: User }
  | { type: "LOAD_USER_FAILURE" }
  | { type: "CLEAR_ERROR" };

// Initial State
const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
    case "LOAD_USER_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
    case "LOAD_USER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };

    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case "LOAD_USER_FAILURE":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = tokenUtils.getAccessToken();

      if (token && !tokenUtils.isTokenExpired(token)) {
        dispatch({ type: "LOAD_USER_START" });
        try {
          const userData = userUtils.getUserData();
          if (userData) {
            dispatch({ type: "LOAD_USER_SUCCESS", payload: userData });
          } else {
            // Fetch user profile from API
            const response = await authService.getProfile();
            if (response.status === "success" && response.data) {
              userUtils.setUserData(response.data);
              dispatch({ type: "LOAD_USER_SUCCESS", payload: response.data });
            } else {
              dispatch({ type: "LOAD_USER_FAILURE" });
            }
          }
        } catch (error) {
          dispatch({ type: "LOAD_USER_FAILURE" });
        }
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(credentials);

      if (response.status === "success" && response.data) {
        const { user, tokens } = response.data;

        // Store tokens and user data
        tokenUtils.setAccessToken(tokens.accessToken);
        tokenUtils.setRefreshToken(tokens.refreshToken);
        userUtils.setUserData(user);

        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.message || "Login failed",
        });
        return { success: false, error: response.message || "Login failed" };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Network error";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    dispatch({ type: "REGISTER_START" });
    try {
      const response = await authService.register(userData);

      if (response.status === "success" && response.data) {
        const { user, tokens } = response.data;

        // Store tokens and user data
        tokenUtils.setAccessToken(tokens.accessToken);
        tokenUtils.setRefreshToken(tokens.refreshToken);
        userUtils.setUserData(user);

        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        return { success: true };
      } else {
        dispatch({
          type: "REGISTER_FAILURE",
          payload: response.message || "Registration failed",
        });
        return {
          success: false,
          error: response.message || "Registration failed",
        };
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Network error";
      dispatch({ type: "REGISTER_FAILURE", payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout API fails, still clear local data
      console.error("Logout API error:", error);
    } finally {
      // Clear local storage
      tokenUtils.removeTokens();
      userUtils.removeUserData();
      dispatch({ type: "LOGOUT" });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Context value
  const value: AuthContextType = {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
