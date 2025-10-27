import { getAllJob, addJob, updateJob, getCategoryName, getCompanyName, deleteJob } from '../services/CRUD_job.js';
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
        let results = await getCompanyName()
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
            number_of_positions, status, deadline, required_skills
        } = req.body;

        if (!company_id || !category_id || !title) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: company_id, category_id, title"
            });
        }

        const results = await addJob(
            Number(company_id), Number(category_id), title, description || '',
            requirements || '', Number(salary_min) || 0, Number(salary_max) || 0,
            location || '', job_type || 'Full-time', experience_level || 'Mid-level',
            Number(number_of_positions) || 1, status || 'active', deadline || '2024-12-31',
            required_skills || ''
        );

        res.status(201).json({
            success: true,
            data: results,
            message: "Job created successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Create job failed",
            error: error.message
        });
    }
}

const editJob = async (req, res) => {
    try {
        const { id } = req.params;
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

        const results = await updateJob(
            company_id, category_id, title, description, requirements,
            salary_min, salary_max, location, job_type, experience_level,
            number_of_positions, status, deadline, required_skills, id
        );

        return res.status(200).json({
            success: true,
            data: results,
            message: "Job updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Update job failed",
            error: error.message
        });
    }
}

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


export { getJobList, editJob, getCateName, getCompName, createJob, dropJob };
