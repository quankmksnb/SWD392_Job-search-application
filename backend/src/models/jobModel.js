import readline from 'readline';
import pool from '../../config/db.js';

const getAllJobById = async (userId) => {
    const [results] = await pool.execute(
        `SELECT job.*, cate.name as category_name, com.name as company_name FROM job_postings job  
        JOIN categories cate ON job.category_id = cate.id 
        JOIN companies com ON job.company_id = com.id
        JOIN company_recruiters cr on com.id= cr.company_id
        join users u on cr.recruiter_id = u.id where u.id= ?
        `, [userId]);
    return results;
}

const getAllJob = async () => {
    const [results] = await pool.execute(`
        SELECT job.*, cate.name as category_name, com.name as company_name FROM job_postings job  
        JOIN categories cate ON job.category_id = cate.id 
        JOIN companies com ON job.company_id = com.id
        JOIN company_recruiters cr on com.id= cr.company_id
        join users u on cr.recruiter_id = u.id
        `)
    return results;

}

const getCompanyName = async (userId) => (await pool.execute(`
    SELECT com.id,com.name FROM companies com
    JOIN job_postings job  ON job.company_id = com.id
    JOIN company_recruiters cr on com.id= cr.company_id
    join users u on cr.recruiter_id = u.id where u.id=?
    `, [userId]))[0];

const getCategoryName = async () => (await pool.execute(`select id, name from categories`))[0];

const addJob = async (
    company_id, category_id, title, description, requirements,
    salary_min, salary_max, location, job_type, experience_level,
    number_of_positions, status, deadline, required_skills, recruiter_id
) => {
    try {
        const [verifyResult] = await pool.execute(
            `SELECT id FROM company_recruiters WHERE company_id = ? AND recruiter_id = ?`,
            [company_id, recruiter_id]
        );

        if (verifyResult.length === 0) {
            throw new Error("Recruiter does not belong to this company");
        }

        const [result] = await pool.execute(
            `INSERT INTO job_postings (
                company_id, category_id, title, description, requirements,
                salary_min, salary_max, location, job_type, experience_level,
                number_of_positions, status, deadline, required_skills,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                company_id, category_id, title, description, requirements,
                Number(salary_min) || 0, Number(salary_max) || 0, location,
                job_type, experience_level, Number(number_of_positions) || 1,
                status, deadline, required_skills
            ]
        );

        return result;

    } catch (error) {
        console.error(error);
    }
};

const updateJob = async (
    company_id, category_id, title, description, requirements,
    salary_min, salary_max, location, job_type, experience_level,
    number_of_positions, status, deadline, required_skills, id, recruiter_id
) => {
    try {

        if (recruiter_id) {
            const [verifyResult] = await pool.execute(
                `SELECT id FROM company_recruiters 
                 WHERE company_id = ? AND recruiter_id = ?`,
                [company_id, recruiter_id]
            );

            if (verifyResult.length === 0) {
                throw new Error("Recruiter does not belong to this company");
            }
        }

        const [result] = await pool.execute(
            `UPDATE job_postings 
             SET company_id = ?, category_id = ?, title = ?, description = ?, 
                requirements = ?, salary_min = ?, salary_max = ?, location = ?, 
                job_type = ?, experience_level = ?, number_of_positions = ?,  
                status = ?, deadline = ?, required_skills = ?, updated_at = NOW() WHERE id = ?`,
            [
                company_id, category_id, title, description, requirements,
                Number(salary_min) || 0,
                Number(salary_max) || 0,
                location,
                job_type,
                experience_level,
                Number(number_of_positions) || 1,
                status,
                deadline,
                required_skills,
                id
            ]
        );

        return result;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


const deleteJob = async (id) => {
    await pool.execute('DELETE FROM interviews WHERE application_id IN (SELECT id FROM applications WHERE job_posting_id = ?)', [id]);
    await pool.execute('DELETE FROM applications WHERE job_posting_id = ?', [id]);

    const [results] = await pool.execute('DELETE FROM job_postings WHERE id = ?', [id]);
    return results;
};
export { getAllJob, getAllJobById, addJob, updateJob, getCategoryName, getCompanyName, deleteJob };