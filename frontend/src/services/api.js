import axios from "axios";

// Tạo instance axios
const api = axios.create({
  baseURL: "http://localhost:9999/api",
  timeout: 10000, // giới hạn thời gian request (ms)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Thêm interceptor để tự động đính kèm token
api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const data = JSON.parse(stored);
        const token = data?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error("Lỗi khi parse localStorage user:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi chung (ví dụ: hết hạn token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      // Optional: điều hướng về trang đăng nhập
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
