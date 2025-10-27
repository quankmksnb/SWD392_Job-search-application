// src/routes/userRoutes.js
import express from "express";
import { protect, isAdmin } from "../middlewares/auth.js";
import {
  getProfile,
  updateProfile,
  listUsers,
  removeUser,
  createUser,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

// admin-only
router.get("/", protect, isAdmin, listUsers);
router.post("/", protect, isAdmin, createUser);
router.put("/:id", protect, isAdmin, updateUser);
router.delete("/:id", protect, removeUser);

export default router;
