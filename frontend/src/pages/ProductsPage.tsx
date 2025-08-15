import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import type { Product, ProductFilters } from "@/types/product.types";
import { ProductModal } from "@/components/products/ProductModal";
import { SearchBar } from "@/components/products/SearchBar";
import { ProductFilter } from "@/components/products/ProductFilter";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/common/Button";

// Fallback image as data URL to avoid network requests
const FALLBACK_IMAGE =
  "data:image/svg+xml,%3csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='400' height='300' fill='%23f3f4f6'/%3e%3ctext x='200' y='150' text-anchor='middle' font-family='Arial' font-size='16' fill='%236b7280'%3e🍽️ No Image%3c/text%3e%3c/svg%3e";

// Memoized image component to prevent re-renders
const ProductImage = memo(
  ({
    src,
    alt,
    productId,
  }: {
    src: string;
    alt: string;
    productId: string;
  }) => {
    const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
    const [hasErrored, setHasErrored] = useState(false);

    const handleError = useCallback(() => {
      console.log(
        `🖼️ Image error for product ${productId}, src: ${imgSrc}, hasErrored: ${hasErrored}`
      );
      if (!hasErrored && imgSrc !== FALLBACK_IMAGE) {
        setHasErrored(true);
        setImgSrc(FALLBACK_IMAGE);
        console.log(`🔄 Switching to fallback for product ${productId}`);
      } else {
        console.log(
          `⚠️ Already using fallback for product ${productId}, preventing infinite loop`
        );
      }
    }, [hasErrored, imgSrc, productId]);

    // Update src when prop changes but preserve error state
    useEffect(() => {
      if (!hasErrored && src && src !== imgSrc) {
        setImgSrc(src);
      }
    }, [src, hasErrored, imgSrc]);

    return (
      <img
        key={`${productId}-image`}
        src={imgSrc}
        alt={alt}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        onError={handleError}
      />
    );
  }
);

ProductImage.displayName = "ProductImage";

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    state,
    loadProducts,
    loadCategories,
    searchProducts,
    setFilters,
    clearFilters,
  } = useProducts();

  const { addToCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { products, categories, isLoading, error, filters } = state;

  // Safe arrays to prevent undefined errors with memoization
  const safeProducts = useMemo(() => products || [], [products]);
  const safeCategories = useMemo(() => categories || [], [categories]);

  // Debug log to track re-renders
  console.log("ProductsPage render:", {
    productsCount: safeProducts.length,
    categoriesCount: safeCategories.length,
    isLoading,
    error,
  });

  // Extract search params with useMemo to prevent infinite re-renders
  const urlSearchQuery = useMemo(
    () => searchParams.get("search") || "",
    [searchParams]
  );
  const urlCategoryParam = useMemo(
    () => searchParams.get("category") || "",
    [searchParams]
  );

  // Initial load - only once on mount
  useEffect(() => {
    console.log("🎯 ProductsPage initial load");
    loadProducts();
    loadCategories();
  }, []); // Empty deps to run only once

  // Handle URL parameter changes separately
  useEffect(() => {
    console.log("🔍 URL params changed");
    console.log("🔍 URL params:", { urlSearchQuery, urlCategoryParam });

    // Only run if there are actually URL params (not on initial load)
    if (urlSearchQuery || urlCategoryParam) {
      if (urlSearchQuery) {
        console.log("🔎 Performing search for:", urlSearchQuery);
        searchProducts(urlSearchQuery);
      } else if (urlCategoryParam) {
        console.log("📂 Filtering by category:", urlCategoryParam);
        setFilters({ category: urlCategoryParam });
        loadProducts({ category: urlCategoryParam });
      }
    }
  }, [urlSearchQuery, urlCategoryParam]); // Only depend on URL params, not functions

  // Memoized callback functions to prevent re-renders
  const handleAddToCart = useCallback(
    async (product: Product) => {
      const success = await addToCart(product._id, 1);
      if (success) {
        console.log(`Successfully added ${product.name} to cart`);
      }
    },
    [addToCart]
  );

  const handleViewDetails = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchProducts(query);
    } else {
      await loadProducts();
    }
  };

  const handleFiltersChange = async (newFilters: ProductFilters) => {
    setFilters(newFilters);
    if (urlSearchQuery.trim()) {
      await searchProducts(urlSearchQuery);
    } else {
      await loadProducts();
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    loadProducts();
  };

  // Wrapper for ProductModal's different interface
  const handleModalAddToCart = useCallback(
    async (productId: string, quantity: number) => {
      const success = await addToCart(productId, quantity);
      if (success) {
        console.log(`Successfully added product to cart`);
      }
    },
    [addToCart]
  );

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => loadProducts()} variant="outline">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thực đơn
              </h1>
              <p className="text-gray-600">
                Khám phá {safeProducts.length} món ăn ngon được tuyển chọn đặc
                biệt
                {urlSearchQuery && ` cho "${urlSearchQuery}"`}
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full lg:w-96">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm món ăn, đồ uống..."
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Xóa bộ lọc
                </button>
              </div>

              <ProductFilter
                categories={safeCategories}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">
                    {safeProducts.length} sản phẩm
                  </span>
                  {urlSearchQuery && (
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      Kết quả cho: {urlSearchQuery}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value="default">Mặc định</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Có lỗi xảy ra
                    </h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={() => loadProducts()} variant="outline">
                      Thử lại
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))
                  ) : safeProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="text-6xl mb-4">🍽️</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Không tìm thấy sản phẩm
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Thử điều chỉnh bộ lọc hoặc tìm kiếm từ khóa khác
                      </p>
                      <Button onClick={() => loadProducts()}>
                        Xem tất cả sản phẩm
                      </Button>
                    </div>
                  ) : (
                    safeProducts.map((product) => {
                      // Cast to any to access extended properties from API
                      const productData = product as any;

                      return (
                        <div
                          key={product._id}
                          className="group bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          {/* Product Image */}
                          <div className="relative overflow-hidden">
                            <ProductImage
                              src={productData.image}
                              alt={product.name}
                              productId={product._id}
                            />
                            {productData.discount &&
                              productData.discount.percentage > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  -{productData.discount.percentage}%
                                </div>
                              )}
                            {productData.isPopular && (
                              <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                🔥 Hot
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </h3>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {productData.tags
                                ?.slice(0, 2)
                                .map((tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>

                            {/* Rating and Time */}
                            <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500">⭐</span>
                                <span>
                                  {productData.ratings?.average || "4.5"}
                                </span>
                                <span>
                                  ({productData.ratings?.count || "123"})
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>⏱️</span>
                                <span>
                                  {productData.preparationTime || 15} phút
                                </span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-orange-600">
                                  {formatCurrency(
                                    productData.finalPrice || product.price
                                  )}
                                </span>
                                {productData.discount &&
                                  productData.discount.percentage > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                      {formatCurrency(product.price)}
                                    </span>
                                  )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewDetails(product)}
                                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  title="Xem chi tiết"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};

// Export memoized component to prevent unnecessary re-renders
export default memo(ProductsPage);
