import axios from "axios";

// 🔧 Tạo axios instance dùng chung
const axiosClient = axios.create({
  baseURL: "http://localhost:9999/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor – tự động đính kèm token vào mọi request
axiosClient.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const token = parsed?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("🪪 Token attached:", token.substring(0, 20) + "..."); // log 1 phần token
        } else {
          console.warn("⚠️ Không tìm thấy token trong localStorage.user");
        }
      } else {
        console.warn("⚠️ Chưa có user trong localStorage");
      }
    } catch (err) {
      console.error("❌ Lỗi khi parse localStorage user:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor – xử lý lỗi 401 toàn cục
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("🚫 Token hết hạn hoặc không hợp lệ — đăng nhập lại.");
//       localStorage.removeItem("user"); // 👈 xoá đúng key
//       // Optional: điều hướng về trang đăng nhập
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
