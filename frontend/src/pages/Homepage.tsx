import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button, Card } from "@/components";

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
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
    },
    {
      name: "Phở",
      emoji: "🍜",
      color: "bg-red-100 text-red-600",
      count: "80+ món",
    },
    {
      name: "Cơm",
      emoji: "🍚",
      color: "bg-green-100 text-green-600",
      count: "150+ món",
    },
    {
      name: "Bún",
      emoji: "🍝",
      color: "bg-blue-100 text-blue-600",
      count: "90+ món",
    },
    {
      name: "Đồ uống",
      emoji: "🥤",
      color: "bg-purple-100 text-purple-600",
      count: "200+ món",
    },
    {
      name: "Tráng miệng",
      emoji: "🍰",
      color: "bg-pink-100 text-pink-600",
      count: "60+ món",
    },
    {
      name: "Lẩu",
      emoji: "🍲",
      color: "bg-yellow-100 text-yellow-600",
      count: "45+ món",
    },
    {
      name: "Món chay",
      emoji: "🥗",
      color: "bg-emerald-100 text-emerald-600",
      count: "70+ món",
    },
  ];

  const popularDeals = [
    {
      title: "Combo Phở Bò + Nước ngọt",
      price: "85.000đ",
      originalPrice: "120.000đ",
      discount: "30%",
      rating: "4.8",
      image: "🍜",
      restaurant: "Phở Hồng",
    },
    {
      title: "Set Bánh mì + Cà phê",
      price: "45.000đ",
      originalPrice: "60.000đ",
      discount: "25%",
      rating: "4.6",
      image: "🥖",
      restaurant: "Bánh mì Hà Nội",
    },
    {
      title: "Cơm tấm sườn + Trà đá",
      price: "65.000đ",
      originalPrice: "85.000đ",
      discount: "24%",
      rating: "4.7",
      image: "🍚",
      restaurant: "Cơm tấm Sài Gòn",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white opacity-10"></div>

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Đặt món ngon
              <span className="block text-yellow-300">chỉ trong 30 giây</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 font-light">
              Khám phá hàng nghìn món ăn từ các nhà hàng uy tín
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="flex bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="flex items-center px-6 text-gray-500">
                  <svg
                    className="w-6 h-6"
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
                  className="flex-1 py-4 px-2 text-gray-700 text-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-semibold transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>

            {/* Location & Delivery Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Giao hàng 15-30 phút</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Đảm bảo chất lượng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Danh mục phổ biến
          </h2>
          <p className="text-lg text-gray-600">
            Chọn loại món ăn yêu thích của bạn
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name.toLowerCase()
              )}`}
              className="group"
            >
              <Card className="text-center p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white">
                <div
                  className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Deals Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Ưu đãi hôm nay
              </h2>
              <p className="text-lg text-gray-600">
                Những deal hot được săn đón nhất
              </p>
            </div>
            <Link to="/products">
              <Button variant="outline" className="hidden md:block">
                Xem tất cả
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularDeals.map((deal, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0"
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-6xl">
                    {deal.image}
                  </div>
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    -{deal.discount}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-yellow-500">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 ml-1">
                        {deal.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      • {deal.restaurant}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
                    {deal.title}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-red-600">
                        {deal.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {deal.originalPrice}
                      </span>
                    </div>
                    <Button size="sm" className="text-sm">
                      Đặt ngay
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tại sao chọn OrderFood?
          </h2>
          <p className="text-lg text-gray-600">
            Trải nghiệm đặt món hoàn hảo với những ưu điểm vượt trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-0 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              🚀
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Giao hàng siêu tốc
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Giao hàng trong 15-30 phút với đội ngũ shipper chuyên nghiệp, theo
              dõi đơn hàng realtime
            </p>
          </Card>

          <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 border-0 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              🍽️
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Đa dạng lựa chọn
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Hàng nghìn món ăn từ các nhà hàng uy tín, từ street food đến fine
              dining
            </p>
          </Card>

          <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-0 hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
              💳
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">
              Thanh toán linh hoạt
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Hỗ trợ đa dạng: Tiền mặt, MoMo, ZaloPay, thẻ tín dụng, chuyển
              khoản
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Sẵn sàng trải nghiệm?</h2>
            <p className="text-xl mb-8 opacity-90">
              Đăng ký ngay để nhận ưu đãi 50% cho đơn hàng đầu tiên!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8"
                >
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8"
                >
                  Khám phá ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && (
        <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Xin chào {user?.name}! 👋
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Hôm nay bạn muốn ăn gì? Hàng nghìn món ngon đang chờ bạn!
            </p>
            <Link to="/products">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8"
              >
                Bắt đầu đặt món 🍴
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
