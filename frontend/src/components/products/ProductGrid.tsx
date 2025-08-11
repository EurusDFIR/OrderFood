import React from "react";
import { ProductCard } from "./ProductCard";
import { LoadingSpinner } from "@/components";
import type { Product } from "@/types/product.types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onAddToCart,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-600">
          Thử điều chỉnh bộ lọc hoặc tìm kiếm từ khóa khác
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
