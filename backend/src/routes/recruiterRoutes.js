import express from "express";
import {
  listRecruiterApplications,
  listRecruiterInterviews,
  listRecruiterJobs,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get("/applications", listRecruiterApplications);
router.get("/jobs", listRecruiterJobs);
router.get("/interviews", listRecruiterInterviews);

export default router;
