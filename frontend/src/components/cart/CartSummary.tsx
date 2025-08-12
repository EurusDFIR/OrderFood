import React from "react";
import type { Cart } from "@/types/cart.types";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/helpers";

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
  onClearCart: () => void;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onCheckout,
  onClearCart,
  isLoading = false,
}) => {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.totalAmount;
  const deliveryFee = subtotal >= 200000 ? 0 : 30000; // Free delivery over 200k VND
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tóm tắt đơn hàng
      </h3>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Số món ({itemCount} món)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí giao hàng</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Miễn phí</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>

        {deliveryFee > 0 && (
          <p className="text-xs text-gray-500">
            Mua thêm {formatPrice(200000 - subtotal)} để được miễn phí giao hàng
          </p>
        )}

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onCheckout}
          disabled={isLoading || cart.items.length === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
        </Button>

        <Button
          onClick={onClearCart}
          disabled={isLoading || cart.items.length === 0}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Xóa toàn bộ giỏ hàng
        </Button>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          📍 Thông tin giao hàng
        </h4>
        <p className="text-xs text-gray-600">
          • Thời gian giao hàng: 30-45 phút
          <br />
          • Miễn phí giao hàng cho đơn hàng từ 200,000đ
          <br />• Thanh toán khi nhận hàng hoặc online
        </p>
      </div>
    </div>
  );
};
