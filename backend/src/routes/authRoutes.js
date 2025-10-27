// src/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email", verifyEmail);
router.post("/change-password", protect, changePassword);
router.post("/logout", protect, logout);

export default router;
