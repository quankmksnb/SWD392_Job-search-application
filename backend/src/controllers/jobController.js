import { getAllJob, getAllJobById, addJob, updateJob, getCategoryName, getCompanyName, deleteJob } from '../models/jobModel.js'
const getJobListById = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Not login account"
            });
        }
        let results = await getAllJob(userId)
        return res.status(200).json({
            success: true,
            data: results,
            message: "Get job list successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Query failed" });
    }
}
const getJobList = async (req, res) => {
    try {
        let results = await getAllJob()
        return res.status(200).json({
            success: true,
            data: results,
            message: "Get job list successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Query failed" });
    }
}

const getCateName = async (req, res) => {
    try {
        let results = await getCategoryName()
        return res.status(200).json({
            success: true,
            data: results,
            message: "Get category name list successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Query failed" });
    }
}
const getCompName = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Not login account"
            });
        }
        let results = await getCompanyName(userId)
        return res.status(200).json({
            success: true,
            data: results,
            message: "Get company name list successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Query failed" });
    }
}


const createJob = async (req, res) => {
    try {
        const {
            company_id, category_id, title, description, requirements,
            salary_min, salary_max, location, job_type, experience_level,
            number_of_positions, status, deadline, required_skills,
            created_by
        } = req.body;

        if (!title || !description || !company_id || !category_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const result = await addJob(
            company_id, category_id, title, description, requirements,
            salary_min, salary_max, location, job_type, experience_level,
            number_of_positions, status, deadline, required_skills,
            created_by
        );

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create job: " + error.message
        });
    }
};


const editJob = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter_id = req.body.user_id;

        const {
            company_id, category_id, title, description, requirements,
            salary_min, salary_max, location, job_type, experience_level,
            number_of_positions, status, deadline, required_skills
        } = req.body;

        if (!id || !company_id || !category_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const result = await updateJob(
            company_id, category_id, title, description, requirements,
            salary_min, salary_max, location, job_type, experience_level,
            number_of_positions, status, deadline, required_skills, id, recruiter_id
        );

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found or not updated"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update job: " + error.message
        });
    }
};




const dropJob = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await deleteJob(id);
        if (results.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete job failed",
            error: error.message
        });
    }
};


export { getJobList, getJobListById, editJob, getCateName, getCompName, createJob, dropJob };
