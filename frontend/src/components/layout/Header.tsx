import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components";
import { CartBadge } from "@/components/cart/CartBadge";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍕</span>
            <span className="text-xl font-bold text-primary-600">
              OrderFood
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">
              Trang chủ
            </Link>
            <Link to="/products" className="nav-link">
              Thực đơn
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/orders" className="nav-link">
                  Đơn hàng
                </Link>
                <Link to="/admin/orders" className="nav-link">
                  Admin
                </Link>
                <Link to="/cart" className="nav-link relative">
                  Giỏ hàng
                  <CartBadge />
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Xin chào, {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Đăng ký
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
