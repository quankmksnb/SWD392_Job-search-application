// src/services/applicationService.js
import db from "../../config/db.js";

/**
 * Lấy danh sách tất cả ứng tuyển, kèm tên job và email ứng viên
 */

export const getAllApplications = async () => {
  const [rows] = await db.execute(`
    SELECT 
      a.id,
      a.candidate_id,
      a.job_posting_id,
      a.cv_id,
      a.cover_letter,
      a.status,
      a.applied_at,
      u.email AS candidate_email,
      u.first_name AS candidate_first_name,
      u.last_name AS candidate_last_name,
      j.title AS job_title,
      c.name AS company_name
    FROM applications a
    JOIN candidate_profiles cp ON a.candidate_id = cp.id
    JOIN users u ON cp.user_id = u.id
    JOIN job_postings j ON a.job_posting_id = j.id
    JOIN companies c ON j.company_id = c.id
    ORDER BY a.applied_at DESC
  `);

  return rows;
};

/**
 * Thêm một ứng tuyển mới
 */
export const addApplication = async (candidate_id, job_posting_id, note, cv_id = null) => {
  //  Lấy id lớn nhất rồi tự tăng
  const [[{ maxId }]] = await db.execute(`SELECT MAX(id) AS maxId FROM applications`);
  const newId = (maxId || 0) + 1;

  console.log(" Thêm ứng tuyển với ID:", newId);

  await db.execute(
    `INSERT INTO applications (id, candidate_id, job_posting_id, cv_id, cover_letter, status, applied_at)
     VALUES (?, ?, ?, ?, ?, 'submitted', NOW())`,
    [newId, candidate_id, job_posting_id, cv_id, note || ""]
  );

  return { id: newId, candidate_id, job_posting_id, cv_id, cover_letter: note };
};

/**
 * Cập nhật trạng thái ứng tuyển
 */
export const updateApplicationStatus = async (id, status) => {
  const [result] = await db.execute(
    `UPDATE applications SET status = ?, applied_at = applied_at WHERE id = ?`,
    [status, id]
  );
  return result.affectedRows > 0;
};

/**
 * Xóa ứng tuyển
 */
export const deleteApplication = async (id) => {
  const [result] = await db.execute(`DELETE FROM applications WHERE id = ?`, [id]);
  return result.affectedRows > 0;
};
