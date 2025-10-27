// src/services/userService.js
import api from "./index";

// Lấy thông tin user hiện tại
export const getProfile = () => api.get("/users/me");

// Cập nhật thông tin user hiện tại
export const updateProfile = (data) => api.put("/users/me", data);

// (Admin) Lấy danh sách toàn bộ users
export const listUsers = () => api.get("/users");

// 🟢 (Admin) Tạo user mới — mặc định status = "active"
export const createUser = (data) => api.post("/users", data);

// 🟡 (Admin) Cập nhật thông tin 1 user
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Xóa 1 user (chính mình hoặc admin)
export const deleteUser = (id) => api.delete(`/users/${id}`);

// thêm api create user, update user
