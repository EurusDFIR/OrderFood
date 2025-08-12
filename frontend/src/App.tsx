import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import { HomePage } from "@/pages/Homepage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { OrderDetails } from "@/components/order/OrderDetails";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />

                  {/* Products Route (public access) */}
                  <Route path="/products" element={<ProductsPage />} />

                  {/* Auth Routes (redirect to home if already authenticated) */}
                  <Route
                    path="/login"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <LoginPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <RegisterPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Order Routes */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* Cart and Checkout Routes */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <div className="container mx-auto px-4 py-8">
                          <h1 className="text-3xl font-bold">
                            Hồ sơ cá nhân (Coming Soon)
                          </h1>
                          <p className="text-gray-600 mt-2">
                            Trang này sẽ được phát triển trong Phase 5
                          </p>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div className="container mx-auto px-4 py-8 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                          404 - Không tìm thấy trang
                        </h1>
                        <p className="text-gray-600 mb-8">
                          Trang bạn đang tìm kiếm không tồn tại.
                        </p>
                        <a
                          href="/"
                          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Về trang chủ
                        </a>
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            </Router>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
export default App;
