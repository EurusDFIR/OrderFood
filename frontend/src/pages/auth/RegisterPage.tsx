import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { isValidEmail, isValidPhone } from "@/utils/helpers";
import type { RegisterData } from "@/types/auth.types";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<
    Partial<RegisterData & { confirmPassword: string }>
  >({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<RegisterData & { confirmPassword: string }> = {};

    if (!formData.name) {
      errors.name = "Họ tên là bắt buộc";
    } else if (formData.name.length < 2) {
      errors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (confirmPassword !== formData.password) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register(formData);

    if (result.success) {
      // Redirect to home page after successful registration
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
          <p className="text-gray-600">Tạo tài khoản để bắt đầu đặt món! 🍕</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Họ và tên"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={formErrors.name}
            placeholder="Nhập họ và tên"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            placeholder="Nhập email của bạn"
            required
          />

          <Input
            label="Số điện thoại"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={formErrors.phone}
            placeholder="Ví dụ: 0987654321, +84987654321"
            helperText="Số điện thoại để liên hệ khi giao hàng (8-15 số)"
          />

          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            placeholder="Nhập mật khẩu"
            helperText="Tối thiểu 6 ký tự bất kỳ"
            required
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            placeholder="Nhập lại mật khẩu"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};
