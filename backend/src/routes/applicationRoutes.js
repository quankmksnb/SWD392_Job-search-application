// src/routes/applicationRoutes.js
import express from "express";
import { updateApplicationStatus } from "../controllers/applicationController.js";
const router = express.Router();

router.put("/:id/status", updateApplicationStatus);

export default router;
