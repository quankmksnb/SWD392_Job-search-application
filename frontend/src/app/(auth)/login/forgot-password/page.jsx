"use client";
import React, { useState, useEffect } from "react";
import { forgotPassword, resetPassword } from "@/services/AuthService";
import FloatingInput from "@/components/ui/Floating/FloatingInput";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Lấy token từ URL nếu có (?token=xxx)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) setToken(tokenParam);
  }, []);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword(email);
      setMessage(res.data?.message || "Đã gửi email đặt lại mật khẩu.");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await resetPassword({ token, newPassword });
      setMessage(res.data?.message || "Đặt lại mật khẩu thành công.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-[80vh] bg-gray-100 p-4">
      <div className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {token ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
        </h2>

        {!token ? (
          // --- Form nhập email ---
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <FloatingInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
            </button>
          </form>
        ) : (
          // --- Form đặt lại mật khẩu ---
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <FloatingInput
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}

        {/* Thông báo */}
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
