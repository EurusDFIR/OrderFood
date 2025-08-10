import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import { HomePage } from "@/pages/Homepage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />

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

            {/* Protected Routes (coming in next phases) */}
            <Route
              path="/products"
              element={
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold">Thực đơn (Coming Soon)</h1>
                  <p className="text-gray-600 mt-2">
                    Trang này sẽ được phát triển trong Phase 3
                  </p>
                </div>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold">
                      Đơn hàng của tôi (Coming Soon)
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Trang này sẽ được phát triển trong Phase 4
                    </p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold">
                      Giỏ hàng (Coming Soon)
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Trang này sẽ được phát triển trong Phase 4
                    </p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route
              path="*"
              element={
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-lg text-gray-600 mb-6">
                    Trang không tồn tại
                  </p>
                  <a
                    href="/"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Về trang chủ
                  </a>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
