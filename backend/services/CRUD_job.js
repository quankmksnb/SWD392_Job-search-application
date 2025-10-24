import readline from 'readline';
import pool from "../config/db.js";

const getAllJob = async () => {
    const [results] = await pool.execute(`SELECT job.*, cate.name as category_name, com.name as company_name FROM job_postings job  
                                JOIN categories cate ON job.category_id = cate.id JOIN companies com ON job.company_id = com.id`);
    return results;
}

const getCompanyName = async () => (await pool.execute('SELECT id,name FROM companies'))[0];
const getCategoryName = async () => (await pool.execute('SELECT id,name FROM categories'))[0];

const addJob = async (company_id, category_id, title, description, requirements,
    salary_min, salary_max, location, job_type, experience_level,
    number_of_positions, status, deadline, required_skills) => {

    const [results] = await pool.execute(`
        INSERT INTO job_postings (
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

    return results;
}

const updateJob = async (company_id, category_id, title, description, requirements,
    salary_min, salary_max, location, job_type, experience_level,
    number_of_positions, status, deadline, required_skills, id) => {

    const [results] = await pool.execute(`
            UPDATE job_postings SET 
                company_id = ?, category_id = ?, title = ?, description = ?,
                requirements = ?, salary_min = ?, salary_max = ?, location = ?, 
                job_type = ?, experience_level = ?, number_of_positions = ?, 
                status = ?, deadline = ?, required_skills = ?, updated_at = NOW() 
            WHERE id = ?`,
        [
            company_id, category_id, title, description, requirements,
            Number(salary_min) || 0, Number(salary_max) || 0, location,
            job_type, experience_level, Number(number_of_positions) || 1,
            status, deadline, required_skills, id
        ]
    );
}


const deleteJob = async (id) => {
    await pool.execute('DELETE FROM interviews WHERE application_id IN (SELECT id FROM applications WHERE job_posting_id = ?)', [id]);
    await pool.execute('DELETE FROM applications WHERE job_posting_id = ?', [id]);

    const [results] = await pool.execute('DELETE FROM job_postings WHERE id = ?', [id]);
    return results;
};
export { getAllJob, addJob, updateJob, getCategoryName, getCompanyName, deleteJob };