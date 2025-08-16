import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Order } from "@/types/order.types";
import { useOrder } from "@/context/OrderContext";
import { formatCurrency } from "@/utils/helpers";

// Order status timeline component
const OrderTimeline: React.FC<{ order: Order }> = ({ order }) => {
  const getStepStatus = (step: string) => {
    const statusOrder = ["pending", "preparing", "ready", "completed"];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(step);

    if (order.status === "cancelled") {
      return step === "pending" ? "completed" : "cancelled";
    }

    if (stepIndex <= currentIndex) return "completed";
    if (stepIndex === currentIndex + 1) return "current";
    return "upcoming";
  };

  const steps = [
    {
      id: "pending",
      title: "Order Placed",
      description: "Order has been received",
    },
    {
      id: "preparing",
      title: "Preparing",
      description: "Food is being prepared",
    },
    { id: "ready", title: "Ready", description: "Food is ready for delivery" },
    {
      id: "completed",
      title: "Delivered",
      description: "Order has been delivered",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
      <div className="relative">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="relative pb-8 last:pb-0">
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-0.5 h-8 ${
                    status === "completed" ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
              <div className="relative flex items-start">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    status === "completed"
                      ? "border-green-500 bg-green-500"
                      : status === "current"
                      ? "border-orange-500 bg-orange-500"
                      : status === "cancelled"
                      ? "border-red-500 bg-red-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {status === "completed" && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {status === "current" && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                  {status === "cancelled" && (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <h4
                    className={`text-sm font-medium ${
                      status === "completed" || status === "current"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      status === "completed" || status === "current"
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Order item detail component
const OrderItemDetail: React.FC<{ item: Order["items"][0] }> = ({ item }) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
        <p className="text-sm text-gray-600">
          Unit Price: {formatCurrency(item.product.price)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">
          {formatCurrency(item.price)}
        </p>
      </div>
    </div>
  );
};

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state, loadOrder, cancelOrder, reorder } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId, loadOrder]);

  const order = state.currentOrder;

  if (state.isLoading && !order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{state.error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setIsProcessing(true);
    const success = await cancelOrder(order._id);
    setIsProcessing(false);

    if (success) {
      // Order will be updated automatically through context
    }
  };

  const handleReorder = async () => {
    setIsProcessing(true);
    const newOrder = await reorder(order._id);
    setIsProcessing(false);

    if (newOrder) {
      navigate(`/orders/${newOrder._id}`);
    }
  };

  const canCancel = order.status === "pending" || order.status === "confirmed";
  const canReorder =
    order.status === "completed" || order.status === "cancelled";

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Orders
          </button>
          <div className="flex space-x-3">
            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={isProcessing}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            {canReorder && (
              <button
                onClick={handleReorder}
                disabled={isProcessing}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? "Processing..." : "Reorder"}
              </button>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Order #{order._id?.slice(-8) || "Unknown"}
        </h1>
        <p className="text-gray-600 mt-1">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Timeline */}
        <div className="lg:col-span-1">
          <OrderTimeline order={order} />
        </div>

        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h3>
            <div>
              {order.items.map((item, index) => (
                <OrderItemDetail key={index} item={item} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span className="text-orange-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900 capitalize">
                  {order.payment?.method || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.payment?.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.payment?.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.payment?.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.payment?.status || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delivery Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 block">Recipient</span>
                <span className="text-gray-900">
                  {order.deliveryInfo?.recipientName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Phone</span>
                <span className="text-gray-900">
                  {order.deliveryInfo?.phone || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-600 block">Address</span>
                <span className="text-gray-900">
                  {order.deliveryInfo?.address || "N/A"}
                </span>
              </div>
              {order.deliveryInfo?.notes && (
                <div>
                  <span className="text-gray-600 block">Notes</span>
                  <span className="text-gray-900">
                    {order.deliveryInfo.notes}
                  </span>
                </div>
              )}
              {order.estimatedDelivery && (
                <div>
                  <span className="text-gray-600 block">
                    Estimated Delivery
                  </span>
                  <span className="text-gray-900">
                    {formatDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-gray-600 block">Notes</span>
                  <span className="text-gray-900">{order.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
