// src/models/interviewModel.js
import pool from "../../config/db.js";

export const InterviewModel = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT i.*, 
             a.job_posting_id, 
             j.title AS job_title, 
             u.first_name AS interviewer_first_name, 
             u.last_name AS interviewer_last_name
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN job_postings j ON a.job_posting_id = j.id
      JOIN users u ON i.interviewer_id = u.id
      ORDER BY i.scheduled_date DESC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(`SELECT * FROM interviews WHERE id = ?`, [
      id,
    ]);
    return rows[0];
  },

  async create(data) {
    const {
      application_id,
      interviewer_id,
      scheduled_date, // FE gửi "YYYY-MM-DD HH:mm:ss"
      interview_type,
      status, // default 'scheduled'
      feedback,
      rating,
    } = data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO interviews(
          application_id, interviewer_id, scheduled_date,
          interview_type, status, feedback, rating, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          application_id,
          interviewer_id,
          scheduled_date, // ✅ FE đã format
          interview_type,
          status || "scheduled",
          feedback || null,
          rating || null,
        ]
      );

      // ✅ chuyển trạng thái application sang shortlisted
      await conn.query(
        `UPDATE applications SET status = 'shortlisted' WHERE id = ?`,
        [application_id]
      );

      await conn.commit();
      return result.insertId;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },

  async update(id, data) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 🔹 Update bảng interviews
      const fields = [];
      const values = [];

      Object.entries(data).forEach(([key, value]) => {
        fields.push(`${key} = ?`);
        values.push(value);
      });
      values.push(id);

      const [result] = await conn.query(
        `UPDATE interviews SET ${fields.join(", ")} WHERE id = ?`,
        values
      );

      // 🔹 Nếu có cập nhật trạng thái thì cần đồng bộ sang applications
      if (data.status) {
        const [rows] = await conn.query(
          `SELECT application_id FROM interviews WHERE id = ?`,
          [id]
        );
        const appId = rows[0]?.application_id;

        if (appId) {
          if (data.status === "completed") {
            await conn.query(
              `UPDATE applications SET status = 'accepted' WHERE id = ?`,
              [appId]
            );
          } else if (data.status === "cancelled") {
            await conn.query(
              `UPDATE applications SET status = 'rejected' WHERE id = ?`,
              [appId]
            );
          }
        }
      }

      await conn.commit();
      return result;
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  },
  async delete(id) {
    const [result] = await pool.query(`DELETE FROM interviews WHERE id = ?`, [
      id,
    ]);
    return result;
  },

  async updateStatus(id, status) {
    const [result] = await pool.query(
      `UPDATE interviews SET status = ? WHERE id = ?`,
      [status, id]
    );
    return result;
  },
};
