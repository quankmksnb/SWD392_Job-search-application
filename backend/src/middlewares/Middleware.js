import jwt from "jsonwebtoken";

console.log(">>> Middleware.js loaded");

import { verify } from "../services/jwtService.js";

export const checkAuth = (req, res, next) => {
  console.log("Chạy checkAuth")
  if (req.method === "OPTIONS") return next(); // skip preflight
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Chạy checkAuth1")
    return res.status(401).json({ success: false, message: "User chưa đăng nhập." });
  }
  const token = authHeader.split(" ")[1].trim();
  try {
    const decoded = verify(token);
    console.log("decoded token:", decoded);
    req.user = decoded;
    next();
    console.log("Chạy checkAuth1")
  } catch (err) {
    console.log("CHạy vao middleware và trả về 401")
    return res.status(401).json({ success: false, message: "Token không hợp lệ hoặc hết hạn." });
  }
};