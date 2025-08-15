import React, { useState, useEffect } from "react";
import type { ProductFilters } from "@/types/product.types";
import { useProducts } from "@/context/ProductContext";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
}) => {
  const { state } = useProducts();
  const { categories, filters: currentFilters } = state;

  const [localFilters, setLocalFilters] =
    useState<ProductFilters>(currentFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearAll = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.keys(currentFilters).some(
    (key) =>
      currentFilters[key as keyof ProductFilters] !== undefined &&
      currentFilters[key as keyof ProductFilters] !== null &&
      currentFilters[key as keyof ProductFilters] !== ""
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              Bộ lọc nâng cao
            </button>
            {hasActiveFilters && (
              <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-medium">
                Đang áp dụng
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={localFilters.category || ""}
                onChange={(e) =>
                  handleFilterChange("category", e.target.value || undefined)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá từ
              </label>
              <input
                type="number"
                placeholder="0"
                value={localFilters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPrice",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá đến
              </label>
              <input
                type="number"
                placeholder="1000000"
                value={localFilters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPrice",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá tối thiểu
              </label>
              <select
                value={localFilters.minRating || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minRating",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tất cả</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.0">4.0+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="3.0">3.0+ ⭐</option>
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bộ lọc nhanh
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("maxPrice", 50000)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  localFilters.maxPrice === 50000
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Dưới 50k
              </button>
              <button
                onClick={() => {
                  handleFilterChange("minPrice", 50000);
                  handleFilterChange("maxPrice", 100000);
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  localFilters.minPrice === 50000 &&
                  localFilters.maxPrice === 100000
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                50k - 100k
              </button>
              <button
                onClick={() => handleFilterChange("minPrice", 100000)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  localFilters.minPrice === 100000 && !localFilters.maxPrice
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Trên 100k
              </button>
              <button
                onClick={() => handleFilterChange("minRating", 4.0)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  localFilters.minRating === 4.0
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Top rated ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
