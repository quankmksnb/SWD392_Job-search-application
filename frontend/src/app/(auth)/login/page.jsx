"use client";
import FloatingInput from "@/components/ui/Floating/FloatingInput";
import React, { useState } from "react";
import { login } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EbayLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await login({
        email,
        password,
      });
      // Lưu thông tin người dùng vào localStorage (giả sử response chứa user hoặc token)
      localStorage.setItem(
        "user",
        JSON.stringify(response.user || response.data || response)
      );
      // Nếu có token riêng, lưu token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const roleId = userData.role_id || userData?.user?.role_id;

      if (roleId === 1) {
        router.push("/admin/user-manager");
      } else if (roleId === 2) {
        router.push("/recruiter/applications");
      } else {
        router.push("/candidate/jobs");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-2">Sign in to your account</div>
          <p className="text-sm text-black-600">
            New to eBay?
            <a href="#" className="text-black-600 underline hover:no-underline">
              Create account
            </a>
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Email Input */}
          <FloatingInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <FloatingInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Link href="/login/forgot-password">
            <div style={{ textAlign: "right", cursor: "pointer" }}>
              Quên mật khẩu
            </div>
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          {/* Stay signed in checkbox */}
          <div className="flex items-center justify-center mt-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-black-700">
                Stay signed in
              </span>
              <svg
                className="w-4 h-4 ml-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
