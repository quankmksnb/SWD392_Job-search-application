// import express from "express";
// import {
//   getApplications,
//   createApplication,
//   updateStatus,
//   removeApplication,
// } from "../controllers/applicationController.js";

// const router = express.Router();

// console.log("✅ applicationRoutes loaded")

// router.get("/", getApplications);
// router.post("/", createApplication);
// router.put("/:id", updateStatus);
// router.delete("/:id", removeApplication);

// export default router;

import express from "express";
import { getApplications, createApplication, deleteApplication, updateStatus } from "../controllers/applicationController.js";
import { checkAuth } from "../middlewares/Middleware.js";

console.log(">>> Router application loaded");


const router = express.Router();

router.get("/", getApplications);
router.post("/", checkAuth, createApplication);
router.put("/:id", checkAuth, updateStatus);
router.delete("/:id", checkAuth, deleteApplication);


export default router;