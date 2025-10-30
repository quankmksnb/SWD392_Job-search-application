import pool from "../../config/db.js";

/**
 * 📋 Lấy danh sách ứng viên apply vào job của recruiter
 * GET /api/recruiter/applications?recruiter_id=2
 */
export const listRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = Number(req.query.recruiter_id || req.body.recruiter_id);
    if (!recruiterId)
      return res.status(400).json({ message: "Thiếu recruiter_id." });

    const { job_id, location, status, search } = req.query;

    let whereClause = `WHERE cr.recruiter_id = ?`;
    const params = [recruiterId];

    if (job_id) {
      whereClause += ` AND j.id = ?`;
      params.push(job_id);
    }

    if (location) {
      whereClause += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (status) {
      whereClause += ` AND a.status = ?`;
      params.push(status);
    }

    if (search) {
      whereClause += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(
      `
      SELECT 
        a.id AS application_id,
        a.status AS application_status,
        a.applied_at,
        u.first_name AS candidate_first_name,
        u.last_name AS candidate_last_name,
        u.email AS candidate_email,
        j.id AS job_id,
        j.title AS job_title,
        j.location,
        j.experience_level,
        comp.name AS company_name,
        i.id AS interview_id,
        i.status AS interview_status,
        i.scheduled_date
      FROM applications a
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      JOIN users u ON cp.user_id = u.id
      JOIN job_postings j ON a.job_posting_id = j.id
      JOIN companies comp ON j.company_id = comp.id
      JOIN company_recruiters cr ON j.company_id = cr.company_id
      LEFT JOIN interviews i ON a.id = i.application_id
      ${whereClause}
      ORDER BY a.applied_at DESC
      `,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ SQL Error:", error.sqlMessage || error);
    res.status(500).json({ message: "Lỗi khi tải danh sách ứng viên." });
  }
};

/**
 * 📋 Lấy danh sách job postings mà recruiter quản lý
 * GET /api/recruiter/jobs?recruiter_id=2
 */
export const listRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = Number(req.query.recruiter_id || req.body.recruiter_id);
    if (!recruiterId)
      return res.status(400).json({ message: "Thiếu recruiter_id." });

    const [rows] = await pool.query(
      `
      SELECT 
        j.id AS job_id,
        j.title,
        j.status AS job_status,
        j.location,
        j.experience_level,
        j.number_of_positions,
        j.deadline,
        j.created_at,
        comp.name AS company_name,
        COUNT(a.id) AS total_applications
      FROM job_postings j
      JOIN companies comp ON j.company_id = comp.id
      JOIN company_recruiters cr ON j.company_id = cr.company_id
      LEFT JOIN applications a ON j.id = a.job_posting_id
      WHERE cr.recruiter_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
      `,
      [recruiterId]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ SQL Error:", error.sqlMessage || error);
    res.status(500).json({ message: "Lỗi khi tải danh sách job." });
  }
};

export const listRecruiterInterviews = async (req, res) => {
  try {
    const recruiterId = Number(req.query.recruiter_id || req.body.recruiter_id);
    if (!recruiterId)
      return res.status(400).json({ message: "Thiếu recruiter_id." });

    const [rows] = await pool.query(
      `
      SELECT
        i.id AS interview_id,
        i.scheduled_date,
        i.status AS interview_status,
        i.interview_type,
        a.id AS application_id,
        u.first_name AS candidate_first_name,
        u.last_name AS candidate_last_name,
        u.email AS candidate_email,
        j.title AS job_title,
        j.location
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      JOIN users u ON cp.user_id = u.id
      JOIN job_postings j ON a.job_posting_id = j.id
      JOIN company_recruiters cr ON j.company_id = cr.company_id
      WHERE cr.recruiter_id = ?
      ORDER BY i.scheduled_date DESC
    `,
      [recruiterId]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Lỗi khi tải lịch phỏng vấn" });
  }
};
