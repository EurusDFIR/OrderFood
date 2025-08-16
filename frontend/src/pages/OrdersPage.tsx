import React, { useEffect, useState } from "react";
import { useOrder } from "@/context/OrderContext";
import { OrderCard } from "@/components/order/OrderCard";
import type { OrderFilters } from "@/types/order.types";

// Filter component
const OrderFilters: React.FC<{
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
}> = ({ filters, onFiltersChange }) => {
  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const handlePaymentStatusChange = (paymentStatus: string) => {
    onFiltersChange({
      ...filters,
      paymentStatus: paymentStatus === "all" ? undefined : paymentStatus,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Status
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={filters.paymentStatus || "all"}
            onChange={(e) => handlePaymentStatusChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                startDate: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                endDate: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export const OrdersPage: React.FC = () => {
  const { state, loadOrders, cancelOrder, reorder } = useOrder();
  const [filters, setFilters] = useState<OrderFilters>({});
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadOrders(filters);
  }, [filters, loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    setIsProcessing(orderId);
    const success = await cancelOrder(orderId);
    setIsProcessing(null);

    if (success) {
      // Orders will be updated automatically through context
    }
  };

  const handleReorder = async (orderId: string) => {
    setIsProcessing(orderId);
    const newOrder = await reorder(orderId);
    setIsProcessing(null);

    if (newOrder) {
      // Orders will be updated automatically through context
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined
  );

  if (state.isLoading && state.orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your food orders
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {/* Error State */}
      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Error loading orders
              </h3>
              <p className="text-sm text-red-700 mt-1">{state.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      {state.orders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 mb-6">
            {hasActiveFilters
              ? "No orders match your current filters. Try adjusting your search criteria."
              : "You haven't placed any orders yet. Start browsing our menu!"}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <a
              href="/products"
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors inline-block"
            >
              Browse Menu
            </a>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={
                  order.orderStatus === "pending"
                    ? () => handleCancelOrder(order._id)
                    : undefined
                }
                onReorder={
                  order.orderStatus === "delivered" ||
                  order.orderStatus === "cancelled"
                    ? () => handleReorder(order._id)
                    : undefined
                }
              />
            ))}
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mr-3"></div>
                  <span className="text-gray-900">
                    Processing your request...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {state.pagination && state.pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    loadOrders({
                      ...filters,
                      page: Math.max(1, state.pagination?.page || 1),
                    })
                  }
                  disabled={state.pagination?.page === 1}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from(
                  { length: state.pagination?.pages || 0 },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadOrders({ ...filters, page })}
                    className={`px-3 py-2 text-sm rounded-md ${
                      page === state.pagination?.page
                        ? "bg-orange-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    loadOrders({
                      ...filters,
                      page: Math.min(
                        state.pagination?.pages || 1,
                        (state.pagination?.page || 1) + 1
                      ),
                    })
                  }
                  disabled={state.pagination?.page === state.pagination?.pages}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {state.isLoading && state.orders.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mr-2"></div>
            <span className="text-sm text-gray-600">Updating orders...</span>
          </div>
        </div>
      )}
    </div>
  );
};
