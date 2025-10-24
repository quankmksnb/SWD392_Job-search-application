// import express from 'express';
// import { getJobList, getCateName, getCompName, createJob, editJob } from '../controllers/jobController.js';
// const router = express.Router();

// // Route lấy danh sách job
// router.get('/job-list', getJobList);
// router.get('/category-name', getCateName)
// router.get('/company-name', getCompName)
// router.post('/create-job', createJob);
// router.put('/update-job/:id', editJob);
// export default router;


import express from 'express';
import { getJobList, getCateName, getCompName, createJob, editJob, dropJob } from '../controllers/jobController.js';

const router = express.Router();


router.get('/job-list', getJobList);
router.get('/category-name', getCateName);
router.get('/company-name', getCompName);
router.post('/create-job', createJob);
router.put('/update-job/:id', editJob);
router.delete('/delete-job/:id', dropJob)
router.put('/test-direct', (req, res) => {
    console.log("✅ DIRECT PUT ROUTE WORKING!");
    res.json({ message: "Direct route works", success: true });
});

export default router;