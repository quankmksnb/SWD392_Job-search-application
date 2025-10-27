// src/routes/roleRoutes.js
import express from "express";
import { protect, isAdmin } from "../middlewares/auth.js";
import { createRole, listRoles, updateRole, deleteRole } from "../controllers/roleController.js";

const router = express.Router();

router.post("/", protect, isAdmin, createRole);
router.get("/", protect, isAdmin, listRoles);
router.put("/:id", protect, isAdmin, updateRole);
router.delete("/:id", protect, isAdmin, deleteRole);

export default router;
