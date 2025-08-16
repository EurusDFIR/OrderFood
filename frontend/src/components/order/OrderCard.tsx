import React from "react";
import { useNavigate } from "react-router-dom";
import type { Order } from "@/types/order.types";
import { formatCurrency } from "@/utils/helpers";

interface OrderCardProps {
  order: Order;
  onReorder?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}

// Order status badge component
const OrderStatusBadge: React.FC<{ status: Order["status"] }> = ({
  status,
}) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivering":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "delivering":
        return "Delivering";
      case "completed":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
};

// Payment status badge component
const PaymentStatusBadge: React.FC<{ status: Order["payment"]["status"] }> = ({
  status,
}) => {
  const getPaymentStatusColor = (status: Order["payment"]["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status: Order["payment"]["status"]) => {
    switch (status) {
      case "pending":
        return "Payment Pending";
      case "paid":
        return "Paid";
      case "failed":
        return "Payment Failed";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
        status
      )}`}
    >
      {getPaymentStatusText(status)}
    </span>
  );
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onReorder,
  onCancel,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/orders/${order._id}`);
  };

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReorder) {
      onReorder(order._id);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCancel && confirm("Are you sure you want to cancel this order?")) {
      onCancel(order._id);
    }
  };

  const canCancel = order.status === "pending" || order.status === "confirmed";
  const canReorder =
    order.status === "completed" || order.status === "cancelled";

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id.slice(-8)}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment?.status || "pending"} />
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {order.items &&
            order.items.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-700"
              >
                {item.quantity}x {item.product?.name || "Unknown Product"}
              </div>
            ))}
          {order.items && order.items.length > 3 && (
            <div className="bg-gray-50 rounded-md px-3 py-1 text-sm text-gray-500">
              +{order.items.length - 3} more
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">
          {order.items?.length || 0} item
          {(order.items?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Delivery Information */}
      {order.deliveryInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Delivery Address
          </h4>
          <p className="text-sm text-gray-600">{order.deliveryInfo.address}</p>
          {order.deliveryInfo.recipientName && (
            <p className="text-sm text-gray-600">
              Recipient: {order.deliveryInfo.recipientName}
            </p>
          )}
          {order.deliveryInfo.phone && (
            <p className="text-sm text-gray-600">
              Phone: {order.deliveryInfo.phone}
            </p>
          )}
        </div>
      )}

      {/* Order Total */}
      <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-100">
        <span className="text-lg font-semibold text-gray-900">Total</span>
        <span className="text-lg font-bold text-orange-600">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleViewDetails}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>

        {canReorder && onReorder && (
          <button
            onClick={handleReorder}
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Reorder
          </button>
        )}

        {canCancel && onCancel && (
          <button
            onClick={handleCancel}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
