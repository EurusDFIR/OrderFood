import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { formatPrice } from "@/utils/helpers";
import type { CreateOrderRequest } from "@/types/order.types";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { cart },
    clearCart,
  } = useCart();
  const { createOrder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
    paymentMethod: "cash" as "cash" | "momo" | "banking",
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
      // Validate required fields
      if (
        !formData.fullName ||
        !formData.phone ||
        !formData.street ||
        !formData.city ||
        !formData.district ||
        !formData.ward
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Create order request
      const orderRequest: CreateOrderRequest = {
        items: cart!.items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          district: formData.district,
          ward: formData.ward,
          phone: formData.phone,
        },
        notes: formData.notes || undefined,
      };

      // Create the order
      const newOrder = await createOrder(orderRequest);

      if (newOrder) {
        // Clear cart and navigate to order details
        clearCart();
        navigate(`/orders/${newOrder._id}`, {
          state: { message: "Order placed successfully!" },
        });
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("An error occurred while placing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No items to checkout
          </h1>
          <Button onClick={() => navigate("/products")}>Back to Menu</Button>
        </div>
      </div>
    );
  }

  const deliveryFee = cart.totalAmount >= 200000 ? 0 : 30000;
  const total = cart.totalAmount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <Input
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter district"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward *
                  </label>
                  <Input
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter ward"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter street address"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-3">💵 Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="momo"
                    checked={formData.paymentMethod === "momo"}
                    onChange={handleInputChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-3">📱 MoMo Wallet</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="banking"
                    checked={formData.paymentMethod === "banking"}
                    onChange={handleInputChange}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-3">🏦 Bank Transfer</span>
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
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm text-gray-900">
                      {item.product.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span className="text-orange-600">{formatPrice(total)}</span>
              </div>
            </div>

            {deliveryFee > 0 && (
              <p className="text-sm text-gray-600 mt-4">
                Free delivery on orders over {formatPrice(200000)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
