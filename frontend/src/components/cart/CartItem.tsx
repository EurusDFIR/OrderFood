import React from "react";
import type { CartItem as CartItemType } from "@/types/cart.types";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/helpers";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isUpdating?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item._id);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.product.images[0] || "/placeholder-food.jpg"}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {formatPrice(item.price)} x {item.quantity}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          -
        </Button>

        <span className="min-w-[2rem] text-center text-sm font-medium">
          {item.quantity}
        </span>

        <Button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="w-8 h-8 p-0 flex items-center justify-center"
        >
          +
        </Button>
      </div>

      {/* Item Total */}
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(itemTotal)}
        </p>
      </div>

      {/* Remove Button */}
      <div>
        <Button
          onClick={handleRemove}
          disabled={isUpdating}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};
