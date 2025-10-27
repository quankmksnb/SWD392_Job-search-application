import api from "./index";

// 🧾 Lấy danh sách tất cả quyền
export const listPermissions = () => api.get("/permissions");

//Tạo quyền mới

export const createPermission = (data) => api.post("/permissions", data);

//Cập nhật quyền
export const updatePermission = (id, data) =>
  api.put(`/permissions/${id}`, data);

// Xóa quyền

export const deletePermission = (id) => api.delete(`/permissions/${id}`);
