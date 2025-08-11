import React, { useState } from "react";
import type { Product } from "@/types/product.types";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { formatPrice } from "@/utils/helpers";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product._id, quantity);
    onClose();
  };

  const images = product.images || [];
  const displayImage =
    images.length > selectedImageIndex
      ? images[selectedImageIndex]
      : images[0] || "/placeholder-food.jpg";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Danh mục:</span>
              <span className="font-medium">{product.category}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Tình trạng:</span>
              <span
                className={`font-medium ${
                  product.isAvailable && product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.isAvailable && product.stock > 0
                  ? "Còn hàng"
                  : "Hết hàng"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Số lượng còn lại:</span>
              <span className="font-medium">{product.stock}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          {product.isAvailable && product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  Thêm vào giỏ hàng - {formatPrice(product.price * quantity)}
                </Button>
              </div>
            </div>
          )}

          {(!product.isAvailable || product.stock <= 0) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center font-medium">
                Sản phẩm này hiện đang hết hàng
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
