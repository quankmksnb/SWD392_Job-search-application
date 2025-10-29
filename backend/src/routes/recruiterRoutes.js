import express from "express";
import {
  listRecruiterApplications,
  listRecruiterJobs,
} from "../controllers/recruiterController.js";

const router = express.Router();

router.get("/applications", listRecruiterApplications);
router.get("/jobs", listRecruiterJobs);

export default router;
