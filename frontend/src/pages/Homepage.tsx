import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button, Card } from "@/components";

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🍕 Chào mừng đến OrderFood!
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Đặt món ăn yêu thích của bạn chỉ với vài cú click
          </p>

          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg">
                Xin chào <span className="font-semibold">{user?.name}</span>! 👋
              </p>
              <Link to="/products">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary-600"
                >
                  Xem thực đơn
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary-600"
                >
                  Đăng ký ngay
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                >
                  Đăng nhập
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tại sao chọn OrderFood?
          </h2>
          <p className="text-lg text-gray-600">
            Chúng tôi cung cấp dịch vụ đặt món tốt nhất với nhiều ưu điểm vượt
            trội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Giao hàng nhanh</h3>
            <p className="text-gray-600">
              Giao hàng trong vòng 30 phút với đội ngũ shipper chuyên nghiệp
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Đa dạng món ăn</h3>
            <p className="text-gray-600">
              Hàng trăm món ăn từ các nhà hàng uy tín với chất lượng đảm bảo
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Thanh toán linh hoạt</h3>
            <p className="text-gray-600">
              Hỗ trợ nhiều hình thức thanh toán: Tiền mặt, MoMo, chuyển khoản
            </p>
          </Card>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Danh mục phổ biến
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá các món ăn được yêu thích nhất
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Pizza", emoji: "🍕", color: "bg-red-100 text-red-600" },
              {
                name: "Burger",
                emoji: "🍔",
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                name: "Sushi",
                emoji: "🍣",
                color: "bg-green-100 text-green-600",
              },
              {
                name: "Drinks",
                emoji: "🥤",
                color: "bg-blue-100 text-blue-600",
              },
            ].map((category) => (
              <Card
                key={category.name}
                className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-3`}
                >
                  {category.emoji}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 text-center">
        <Card className="p-8 bg-gradient-to-r from-primary-50 to-secondary-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng đặt món?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Hàng ngàn món ăn ngon đang chờ bạn khám phá!
          </p>
          <Link to="/products">
            <Button size="lg">Bắt đầu đặt món 🍴</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};
