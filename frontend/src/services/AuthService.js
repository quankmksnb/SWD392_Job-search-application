import api from "./index";

// Đăng ký
export const register = (data) => api.post("/auth/register", data);

// Xác thực email
export const verifyEmail = (token) =>
  api.get("/auth/verify-email", { params: { token } });

// Đăng nhập
export const login = (data) => api.post("/auth/login", data);

// Quên mật khẩu
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

// Đặt lại mật khẩu
export const resetPassword = (data) => api.post("/auth/reset-password", data);

// Đổi mật khẩu (yêu cầu token)
export const changePassword = (data) => api.post("/auth/change-password", data);

export const logout = () => api.post("/auth/logout");
