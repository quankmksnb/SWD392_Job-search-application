import api from "./index";

// Thêm vai trò mới
export const createRole = (data) => api.post("/roles", data);

// Danh sách vai trò
export const listRoles = () => api.get("/roles");

// Cập nhật vai trò
export const updateRole = (id, data) => api.put(`/roles/${id}`, data);

// Xóa vai trò
export const deleteRole = (id) => api.delete(`/roles/${id}`);
