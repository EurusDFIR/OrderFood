import React from "react";
import type { ProductFilters } from "@/types/product.types";
import { Button } from "@/components/common/Button";

interface ProductFilterProps {
  categories: string[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  const handlePriceRangeChange = (minPrice?: number, maxPrice?: number) => {
    onFiltersChange({
      ...filters,
      minPrice,
      maxPrice,
    });
  };

  const handleAvailabilityChange = (isAvailable: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      isAvailable,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.isAvailable !== undefined;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
        {hasActiveFilters && (
          <Button onClick={onClearFilters} variant="outline" size="sm">
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Danh mục</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Khoảng giá</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priceRange"
              checked={!filters.minPrice && !filters.maxPrice}
              onChange={() => handlePriceRangeChange(undefined, undefined)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priceRange"
              checked={filters.minPrice === 0 && filters.maxPrice === 50000}
              onChange={() => handlePriceRangeChange(0, 50000)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Dưới 50,000đ</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priceRange"
              checked={
                filters.minPrice === 50000 && filters.maxPrice === 100000
              }
              onChange={() => handlePriceRangeChange(50000, 100000)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">50,000đ - 100,000đ</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priceRange"
              checked={
                filters.minPrice === 100000 && filters.maxPrice === 200000
              }
              onChange={() => handlePriceRangeChange(100000, 200000)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">100,000đ - 200,000đ</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="priceRange"
              checked={filters.minPrice === 200000 && !filters.maxPrice}
              onChange={() => handlePriceRangeChange(200000, undefined)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Trên 200,000đ</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Tình trạng</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="availability"
              checked={filters.isAvailable === undefined}
              onChange={() => handleAvailabilityChange(undefined)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="availability"
              checked={filters.isAvailable === true}
              onChange={() => handleAvailabilityChange(true)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Còn hàng</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="availability"
              checked={filters.isAvailable === false}
              onChange={() => handleAvailabilityChange(false)}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">Hết hàng</span>
          </label>
        </div>
      </div>
    </div>
  );
};
