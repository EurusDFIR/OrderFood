import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ModernBanner from "@/components/home/ModernBanner";

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const categories = [
    {
      name: "Bánh mì",
      emoji: "🥖",
      color: "bg-orange-100 text-orange-600",
      count: "120+ món",
      slug: "banh-mi",
    },
    {
      name: "Phở",
      emoji: "🍜",
      color: "bg-red-100 text-red-600",
      count: "80+ món",
      slug: "pho",
    },
    {
      name: "Cơm",
      emoji: "🍚",
      color: "bg-green-100 text-green-600",
      count: "150+ món",
      slug: "com",
    },
    {
      name: "Bún",
      emoji: "🍝",
      color: "bg-blue-100 text-blue-600",
      count: "90+ món",
      slug: "bun",
    },
    {
      name: "Đồ uống",
      emoji: "🥤",
      color: "bg-purple-100 text-purple-600",
      count: "200+ món",
      slug: "do-uong",
    },
    {
      name: "Ăn vặt",
      emoji: "🍿",
      color: "bg-yellow-100 text-yellow-600",
      count: "100+ món",
      slug: "an-vat",
    },
    {
      name: "Tráng miệng",
      emoji: "🧁",
      color: "bg-pink-100 text-pink-600",
      count: "60+ món",
      slug: "trang-mieng",
    },
    {
      name: "Món chay",
      emoji: "🥗",
      color: "bg-green-100 text-green-600",
      count: "40+ món",
      slug: "mon-chay",
    },
  ];

  const features = [
    {
      icon: "🚀",
      title: "Giao hàng nhanh",
      description: "Trong vòng 30 phút tại nội thành",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: "💎",
      title: "Chất lượng cao",
      description: "Đối tác nhà hàng uy tín, món ngon đảm bảo",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: "💰",
      title: "Giá cả hợp lý",
      description: "Nhiều khuyến mãi, giá cạnh tranh",
      color: "bg-emerald-200 text-emerald-800",
    },
    {
      icon: "📱",
      title: "Theo dõi realtime",
      description: "Biết chính xác vị trí đơn hàng của bạn",
      color: "bg-emerald-300 text-emerald-900",
    },
  ];

  const stats = [
    { number: "10K+", label: "Khách hàng hài lòng" },
    { number: "500+", label: "Nhà hàng đối tác" },
    { number: "50K+", label: "Đơn hàng thành công" },
    { number: "4.8⭐", label: "Đánh giá trung bình" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Banner */}
      <ModernBanner />

      {/* Search Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tìm kiếm món ăn yêu thích 🔍
            </h2>
            <p className="text-gray-600 text-lg">
              Hơn 1000+ món ăn từ các nhà hàng hàng đầu
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-xl p-2 flex items-center"
          >
            <div className="flex items-center px-4">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm món ăn, nhà hàng, đồ uống..."
              className="flex-1 py-4 px-2 text-gray-700 text-lg bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Location & Delivery Info */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-90 mt-6">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">Giao hàng tại TP.HCM</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-600">Giao trong 30 phút</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">Miễn phí ship từ 99K</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Danh mục nổi bật 🍽️
            </h2>
            <p className="text-gray-600 text-lg">
              Khám phá những món ăn yêu thích từ mọi miền đất nước
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-center mb-2 text-lg">
                  {category.name}
                </h3>
                <p className="text-gray-500 text-center text-sm">
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Vì sao chọn Lena Food? ✨
            </h2>
            <p className="text-gray-600 text-lg">
              Chúng tôi cam kết mang đến trải nghiệm tuyệt vời nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1"
              >
                <div
                  className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Con số ấn tượng 📊</h2>
            <p className="text-emerald-100 text-lg">
              Niềm tin từ hàng ngàn khách hàng trên khắp cả nước
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2 text-yellow-300">
                  {stat.number}
                </div>
                <div className="text-purple-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Bắt đầu hành trình ẩm thực của bạn! 🚀
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Hàng ngàn món ăn ngon đang chờ bạn khám phá. Đặt hàng ngay để nhận
            ưu đãi đặc biệt cho lần đầu!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link
                to="/products"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                Khám phá ngay 🍽️
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  Đăng ký ngay 📝
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:-translate-y-1"
                >
                  Đăng nhập 🔑
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>🎉 Ưu đãi đặc biệt: Giảm 30% cho đơn hàng đầu tiên!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
