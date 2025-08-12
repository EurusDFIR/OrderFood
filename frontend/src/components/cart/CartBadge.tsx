import React from "react";
import { useCart } from "@/context/CartContext";

interface CartBadgeProps {
  className?: string;
}

export const CartBadge: React.FC<CartBadgeProps> = ({ className = "" }) => {
  const { state } = useCart();

  if (state.itemCount === 0) {
    return null;
  }

  return (
    <span
      className={`
        absolute -top-2 -right-2 
        bg-red-500 text-white 
        text-xs font-bold 
        rounded-full 
        min-w-[1.25rem] h-5 
        flex items-center justify-center 
        ${className}
      `}
    >
      {state.itemCount > 99 ? "99+" : state.itemCount}
    </span>
  );
};
