// src/routes/interviewRoutes.js
import express from "express";
import {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.get("/", getAllInterviews);
router.get("/:id", getInterviewById);
router.post("/", createInterview);
router.put("/:id", updateInterview);
router.delete("/:id", deleteInterview);

export default router;
