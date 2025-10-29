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
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await InterviewModel.updateStatus(req.params.id, status);
    res.status(200).json({ message: `Interview marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});


export default router;
