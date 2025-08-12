import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { formatPrice } from "@/utils/helpers";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { cart },
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cod", // cash on delivery
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // TODO: Implement order creation API call
      console.log("Creating order:", { cart, formData });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success page or orders page
      navigate("/orders", {
        state: { message: "Đặt hàng thành công!" },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không có sản phẩm để thanh toán
          </h1>
          <Button onClick={() => navigate("/products")}>
            Quay lại thực đơn
          </Button>
        </div>
      </div>
    );
  }

  const deliveryFee = cart.totalAmount >= 200000 ? 0 : 30000;
  const total = cart.totalAmount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Thanh toán đơn hàng
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ giao hàng *
                </label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (không bắt buộc)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ghi chú cho đơn hàng..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3">
                    💵 Thanh toán khi nhận hàng (COD)
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3">📱 MoMo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === "banking"}
                    onChange={handleInputChange}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3">🏦 Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full"
              size="lg"
            >
              {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Đơn hàng của bạn
            </h3>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Pricing Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Miễn phí</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
              📍 Thời gian giao hàng: 30-45 phút
              <br />
              📞 Hotline: 1900-xxxx
              <br />
              🛡️ Đảm bảo chất lượng 100%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
