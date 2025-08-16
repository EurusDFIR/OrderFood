import React from "react";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Chờ đến khi authentication state được load
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600">
            Bạn cần đăng nhập để truy cập trang này.
          </p>
        </div>
      </div>
    );
  }

  // Kiểm tra role admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập trang admin.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
