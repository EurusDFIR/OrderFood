import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/helpers";

interface AdminOrder {
  _id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  payment: {
    method: string;
    status: string;
  };
  deliveryInfo: {
    recipientName: string;
    phone: string;
    address: string;
    notes?: string;
  };
  createdAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  delivering: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "assigned_to_shipper", label: "Assigned to Shipper" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      console.log("🔧 Admin token:", token);

      const response = await fetch(
        "http://localhost:5000/api/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🔧 Admin response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      console.log("🔧 Admin response data:", data);

      if (data.status === "success") {
        console.log("🔧 Setting orders:", data.data.orders);
        setOrders(data.data.orders);
      } else {
        console.log("🔧 API response not successful:", data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const data = await response.json();
      if (data.status === "success") {
        // Update local state
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert("Order status updated successfully");
        // Refresh data to make sure everything is in sync
        fetchAllOrders();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to update order status: ${errorMessage}`);
      // Reset the select to original value
      fetchAllOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin - Manage Orders
          </h1>
          <p className="mt-2 text-gray-600">Total orders: {orders.length}</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">Customer:</p>
                        <p className="text-gray-600">{order.user.name}</p>
                        <p className="text-gray-600">{order.user.email}</p>
                        {order.user.phone && (
                          <p className="text-gray-600">{order.user.phone}</p>
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Delivery:</p>
                        <p className="text-gray-600">
                          {order.deliveryInfo.recipientName}
                        </p>
                        <p className="text-gray-600">
                          {order.deliveryInfo.phone}
                        </p>
                        <p className="text-gray-600">
                          {order.deliveryInfo.address}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">Items:</p>
                        {order.items.map((item, index) => (
                          <p key={index} className="text-gray-600">
                            {item.name} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <label className="text-sm font-medium text-gray-700">
                        Update Status:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        disabled={updatingOrder === order._id}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {updatingOrder === order._id && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {orders.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found.</p>
            <button
              onClick={fetchAllOrders}
              className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Retry Loading Orders
            </button>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Debug: Orders count: {orders.length}</p>
          <p>Loading: {loading ? "true" : "false"}</p>
        </div>
      </div>
    </div>
  );
};
