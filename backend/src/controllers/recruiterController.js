import pool from "../../config/db.js";

/**
 * 📋 Lấy danh sách ứng viên apply vào job của recruiter
 * GET /api/recruiter/applications?recruiter_id=2
 */
export const listRecruiterApplications = async (req, res) => {
  try {
    const recruiterId = Number(req.query.recruiter_id || req.body.recruiter_id);
    if (!recruiterId) return res.status(400).json({ message: "Thiếu recruiter_id." });

    const [rows] = await pool.query(
      `
      SELECT
        a.id AS application_id,
        a.status AS application_status,
        a.applied_at,

        u.id AS candidate_user_id,
        u.first_name AS candidate_first_name,
        u.last_name AS candidate_last_name,
        u.email AS candidate_email,

        j.id AS job_id,
        j.title AS job_title,
        j.location,
        j.experience_level,
        j.status AS job_status,
        comp.name AS company_name,

        -- Lấy interview mới nhất (nếu có)
        li.id AS interview_id,
        li.scheduled_date,
        li.interview_type,
        li.status AS interview_status

      FROM applications a
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      JOIN users u ON cp.user_id = u.id
      JOIN job_postings j ON a.job_posting_id = j.id
      JOIN companies comp ON j.company_id = comp.id
      JOIN company_recruiters cr ON j.company_id = cr.company_id
      LEFT JOIN (
        SELECT i1.*
        FROM interviews i1
        JOIN (
          SELECT application_id, MAX(created_at) AS mx
          FROM interviews GROUP BY application_id
        ) x ON i1.application_id = x.application_id AND i1.created_at = x.mx
      ) li ON li.application_id = a.id
      WHERE cr.recruiter_id = ?
      ORDER BY a.applied_at DESC
      `,
      [recruiterId]
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
    if (!recruiterId) return res.status(400).json({ message: "Thiếu recruiter_id." });

    const [rows] = await pool.query(`
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
    `, [recruiterId]);

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Lỗi khi tải lịch phỏng vấn" });
  }
};
