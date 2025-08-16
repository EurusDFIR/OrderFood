import React, { useState } from "react";
import type { Product } from "@/types/product.types";
import { Modal } from "@/components/common/Modal";
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

  console.log("🔍 ProductModal render:", { product: product?.name, isOpen });

  // Reset image index khi product thay đổi
  React.useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product._id, quantity);
    onClose();
  };

  const images = product.images || ((product as any).image ? [(product as any).image] : []);
  const displayImage =
    images.length > 0 ? images[selectedImageIndex] || images[0] : null;

  const hasValidImage =
    displayImage && 
    displayImage !== "/placeholder-food.svg" &&
    displayImage !== "" &&
    !displayImage.includes("data:image");

  console.log("🖼️ ProductModal images:", {
    productImages: product.images,
    productImage: (product as any).image,
    imagesArray: images,
    selectedIndex: selectedImageIndex,
    displayImage,
    hasValidImage,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {hasValidImage ? (
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Replace with fallback food image
                    e.currentTarget.src = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80";
                    e.currentTarget.onerror = null; // Prevent infinite loop
                  }}
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&q=80"
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Final fallback to SVG placeholder
                      e.currentTarget.style.display = "none";
                      const fallbackDiv = e.currentTarget.parentElement?.querySelector('.fallback-placeholder') as HTMLElement;
                      if (fallbackDiv) {
                        fallbackDiv.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="fallback-placeholder absolute inset-0 items-center justify-center text-gray-400"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm">🍽️ {product.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-emerald-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== "/placeholder-food.svg") {
                          target.src = "/placeholder-food.svg";
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {(product as any).category && (
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {(product as any).category}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPrice((product as any).finalPrice || product.price)}
              </span>
              {(product as any).discount &&
                (product as any).discount.percentage > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      -{(product as any).discount.percentage}%
                    </span>
                  </>
                )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Số lượng</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <span className="text-lg font-medium">-</span>
                </button>
                <span className="w-16 text-center text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium">+</span>
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Thêm vào giỏ hàng</span>
                <span className="text-lg">
                  {formatPrice(
                    ((product as any).finalPrice || product.price) * quantity
                  )}
                </span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className="ml-2 text-green-600 font-medium">
                    {product.isAvailable ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
                {(product as any).preparationTime && (
                  <div>
                    <span className="text-gray-500">Thời gian chuẩn bị:</span>
                    <span className="ml-2 font-medium">
                      {(product as any).preparationTime} phút
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
