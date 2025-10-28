import express from "express";
import { protect, isAdmin } from "../middlewares/auth.js";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Public routes
router.get("/", listCategories);
router.get("/:id", getCategoryById);

// Admin-only routes
router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

export default router;
