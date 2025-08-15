// Product Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  isAvailable: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Product Request Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  isAvailable?: boolean;
}

export interface ProductsQuery extends ProductFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
