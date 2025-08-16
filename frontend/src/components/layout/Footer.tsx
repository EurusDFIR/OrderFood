import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/lenaFood.png"
                alt="Lena Food"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Nền tảng đặt món ăn trực tuyến hàng đầu với hàng nghìn nhà hàng
              đối tác, mang đến trải nghiệm ẩm thực tuyệt vời cho bạn.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-sm">📘</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-sm">📱</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="text-sm">📧</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-400">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🏠</span>
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🍽️</span>
                  <span>Thực đơn</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">📦</span>
                  <span>Đơn hàng</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">👤</span>
                  <span>Tài khoản</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-400">Danh mục</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products?category=banh-mi"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🥖</span>
                  <span>Bánh mì</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=pho"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🍜</span>
                  <span>Phở</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=com"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🍚</span>
                  <span>Cơm</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=do-uong"
                  className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                >
                  <span className="text-emerald-500">🥤</span>
                  <span>Đồ uống</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-emerald-400">
              Liên hệ & Hỗ trợ
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-500">📍</span>
                <span className="text-gray-300 text-sm">
                  123 Đường ABC, Quận XYZ, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-500">📞</span>
                <span className="text-gray-300 text-sm">
                  Hotline: 0123 456 789
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-500">✉️</span>
                <span className="text-gray-300 text-sm">info@lenafood.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-500">🕒</span>
                <span className="text-gray-300 text-sm">
                  24/7 - Phục vụ mọi lúc
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-emerald-400">
              Đăng ký nhận tin tức
            </h3>
            <p className="text-gray-300">
              Nhận thông báo về khuyến mãi và món ăn mới nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Lena Food. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/support"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
            >
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
