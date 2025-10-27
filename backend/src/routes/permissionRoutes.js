import express from "express";
import { protect, isAdmin } from "../middlewares/auth.js";
import {
  listPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController.js";

const router = express.Router();

router.get("/", protect, isAdmin, listPermissions);
router.post("/", protect, isAdmin, createPermission);
router.put("/:id", protect, isAdmin, updatePermission);
router.delete("/:id", protect, isAdmin, deletePermission);

export default router;
