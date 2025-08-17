import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./AdminProductsPage.css";

// Types
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  stock: number;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  isAvailable: boolean;
  isPopular: boolean;
  tags: string;
  stock: number;
}

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    isAvailable: true,
    isPopular: false,
    tags: "",
    stock: 0,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Category mapping
  const categoryLabels: { [key: string]: string } = {
    com: "Cơm",
    pho: "Phở",
    bun: "Bún",
    "banh-mi": "Bánh mì",
    "do-uong": "Đồ uống",
    "trang-mieng": "Tráng miệng",
    "mon-chay": "Món chay",
    lau: "Lẩu",
    nuong: "Nướng",
    khac: "Khác",
  };

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem("access_token");
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const token = getAuthToken();
      const url = `${API_BASE_URL}/products?isAdmin=true`;
      console.log("🔍 AdminProductsPage calling API:", url);
      console.log("🔑 Using token:", token ? "Present" : "Missing");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Products API response:", data);
        // Handle both old and new format
        const productsData = data.data?.data || data.data || data;
        setProducts(Array.isArray(productsData) ? productsData : []);
      } else {
        console.error("❌ Products API failed:", response.status);
        toast.error("Không thể tải danh sách sản phẩm");
      }
    } catch (error) {
      console.error("💥 Error fetching products:", error);
      toast.error("Lỗi khi tải danh sách sản phẩm");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);

      if (response.ok) {
        const data = await response.json();
        console.log("Categories API response:", data);
        const categoriesData = data.data || data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial load
  useEffect(() => {
    console.log("🚀 AdminProductsPage mounted, loading data...");
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getAuthToken();
    const url = editingProduct
      ? `${API_BASE_URL}/products/${editingProduct._id}`
      : `${API_BASE_URL}/products`;

    const method = editingProduct ? "PUT" : "POST";

    try {
      const submitData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success(
          editingProduct
            ? "Cập nhật sản phẩm thành công!"
            : "Thêm sản phẩm thành công!"
        );
        setShowModal(false);
        resetForm();
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Lỗi khi lưu sản phẩm");
    }
  };

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Xóa sản phẩm thành công!");
        fetchProducts();
      } else {
        const error = await response.json();
        toast.error(error.message || "Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: "",
      description: "",
      image: "",
      isAvailable: true,
      isPopular: false,
      tags: "",
      stock: 0,
    });
    setEditingProduct(null);
  };

  // Open edit modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      isAvailable: product.isAvailable,
      isPopular: product.isPopular,
      tags: product.tags.join(", "),
      stock: product.stock || 0,
    });
    setShowModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Filter products
  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !filterCategory || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    }
  );

  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1>🛍️ Quản lý sản phẩm</h1>
        <button className="btn-primary" onClick={openAddModal}>
          ➕ Thêm sản phẩm mới
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">📁 Tất cả danh mục</option>
            {(Array.isArray(categories) ? categories : []).map((category) => (
              <option
                key={category.name || category}
                value={category.name || category}
              >
                {category.displayName ||
                  categoryLabels[category.name || category] ||
                  category.name ||
                  category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-thumbnail"
                  />
                </td>
                <td>
                  <div className="product-name">
                    {product.name}
                    {product.isPopular && (
                      <span className="popular-badge">🔥 Hot</span>
                    )}
                  </div>
                </td>
                <td>{categoryLabels[product.category] || product.category}</td>
                <td className="price">
                  {product.price.toLocaleString("vi-VN")}đ
                </td>
                <td>
                  <span
                    className={`status ${
                      product.isAvailable ? "available" : "unavailable"
                    }`}
                  >
                    {product.isAvailable ? "✅ Có sẵn" : "❌ Hết hàng"}
                  </span>
                </td>
                <td>
                  <div className="rating">
                    ⭐ {product.ratings.average.toFixed(1)} (
                    {product.ratings.count})
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(product)}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-products">📦 Không có sản phẩm nào</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingProduct
                  ? "✏️ Chỉnh sửa sản phẩm"
                  : "➕ Thêm sản phẩm mới"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="form-group">
                  <label>Giá *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Danh mục *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Chọn danh mục</option>
                    {(Array.isArray(categories) ? categories : []).map(
                      (category) => (
                        <option
                          key={category.name || category}
                          value={category.name || category}
                        >
                          {category.displayName ||
                            categoryLabels[category.name || category] ||
                            category.name ||
                            category}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>URL hình ảnh *</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Tags (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="ngon, bổ, rẻ, nổi tiếng"
                />
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isAvailable: e.target.checked,
                        })
                      }
                    />
                    ✅ Có sẵn
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPopular: e.target.checked,
                        })
                      }
                    />
                    🔥 Sản phẩm nổi bật
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
