import React from "react";
import { Card, Button } from "@/components";
import { formatCurrency } from "@/utils/helpers";
import type { Product } from "@/types/product.types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  return (
    <Card className="group overflow-hidden" hover>
      {/* Product Image */}
      <div className="aspect-4-3 overflow-hidden">
        <img
          src={product.images[0] || "/placeholder-food.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3
          className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600 cursor-pointer"
          onClick={handleViewDetails}
        >
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Category */}
        <div className="mb-3">
          <span className="badge badge-secondary text-xs">
            {product.category}
          </span>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={handleViewDetails}>
              Chi tiết
            </Button>

            {product.isAvailable && product.stock > 0 ? (
              <Button size="sm" onClick={handleAddToCart}>
                Thêm vào giỏ
              </Button>
            ) : (
              <Button size="sm" disabled className="btn-disabled">
                Hết hàng
              </Button>
            )}
          </div>
        </div>

        {/* Stock Warning */}
        {product.isAvailable && product.stock > 0 && product.stock <= 5 && (
          <div className="mt-2">
            <span className="text-orange-600 text-xs">
              ⚠️ Chỉ còn {product.stock} món
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
