import React, { useState, useEffect } from "react";
import { useProducts } from "@/context/ProductContext";
import type { Product, ProductFilters } from "@/types/product.types";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductModal } from "@/components/products/ProductModal";
import { SearchBar } from "@/components/products/SearchBar";
import { ProductFilter } from "@/components/products/ProductFilter";
import { Button } from "@/components/common/Button";

export const ProductsPage: React.FC = () => {
  const {
    state,
    loadProducts,
    loadCategories,
    searchProducts,
    setFilters,
    clearFilters,
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { products, categories, isLoading, error, filters, searchQuery } =
    state;

  useEffect(() => {
    // Load initial products and categories
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchProducts(query);
    } else {
      await loadProducts();
    }
  };

  const handleFiltersChange = async (newFilters: ProductFilters) => {
    setFilters(newFilters);
    if (searchQuery.trim()) {
      await searchProducts(searchQuery);
    } else {
      await loadProducts();
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    loadProducts();
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    // TODO: Implement add to cart functionality
    console.log(
      `Adding product ${productId} to cart with quantity ${quantity}`
    );
    // This will be implemented when we create the cart context
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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thực đơn</h1>
        <p className="text-gray-600">
          Khám phá các món ăn ngon được tuyển chọn đặc biệt
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Tìm kiếm món ăn, đồ uống..."
        />
      </div>

      {/* Filter Toggle & Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
          </Button>

          <span className="text-gray-600">
            {products.length} sản phẩm
            {searchQuery && ` cho "${searchQuery}"`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <ProductFilter
              categories={categories}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <ProductGrid
            products={products}
            isLoading={isLoading}
            onAddToCart={(product) => handleAddToCart(product._id, 1)}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
