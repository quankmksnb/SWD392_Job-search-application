import express from 'express';
import { getJobList, getJobListById, getCateName, getCompName, createJob, editJob, dropJob } from '../controllers/jobController.js';

const router = express.Router();


router.get('/job-list', getJobList);
router.get('/job-list/:id', getJobListById);

router.get('/category-name', getCateName);
router.get('/company-name', getCompName);
router.post('/create-job', createJob);
router.put('/update-job/:id', editJob);
router.delete('/delete-job/:id', dropJob)

export default router;