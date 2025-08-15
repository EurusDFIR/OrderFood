import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/common/Button";

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { cart, isLoading, error },
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await updateCartItem(itemId, quantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    const safeCartItems = cart?.items || [];
    if (cart && safeCartItems.length > 0) {
      navigate("/checkout");
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Safe cart items to prevent undefined errors
  const safeCartItems = cart?.items || [];

  // Empty cart state
  if (!cart || safeCartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng của bạn đang trống
          </h1>
          <p className="text-gray-600 mb-6">
            Hãy thêm một số món ăn ngon vào giỏ hàng để bắt đầu đặt hàng!
          </p>
          <Link to="/products">
            <Button size="lg">Khám phá thực đơn</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Giỏ hàng của bạn
        </h1>
        <p className="text-gray-600">
          {safeCartItems.length} món trong giỏ hàng
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {safeCartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isUpdating={isLoading}
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            cart={cart}
            onCheckout={handleCheckout}
            onClearCart={handleClearCart}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
