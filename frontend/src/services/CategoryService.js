// src/services/CategoryService.js
import api from "./api";

// Lấy danh sách categories với phân trang
export const listCategories = (params) => api.get("/categories", { params });

// Lấy chi tiết một category
export const getCategoryById = (id) => api.get(`/categories/${id}`);

// (Admin) Tạo category mới
export const createCategory = (data) => api.post("/categories", data);

// (Admin) Cập nhật category
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);

// (Admin) Xóa category
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
