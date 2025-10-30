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

      // ✅ Bỏ qua "result" khi build câu UPDATE
      const fields = [];
      const values = [];

      Object.entries(data).forEach(([key, value]) => {
        if (key === "result") return; // 🟢 Dòng này rất quan trọng!
        fields.push(`${key} = ?`);
        values.push(value);
      });
      values.push(id);

      // ✅ Chỉ chạy UPDATE nếu có field hợp lệ
      if (fields.length > 0) {
        await conn.query(
          `UPDATE interviews SET ${fields.join(", ")} WHERE id = ?`,
          values
        );
      }

      // ✅ Lấy application_id để đồng bộ trạng thái
      const [rows] = await conn.query(
        `SELECT application_id FROM interviews WHERE id = ?`,
        [id]
      );
      const appId = rows[0]?.application_id;

      if (appId) {
        // 🔴 Nếu bị hủy
        if (data.status === "cancelled") {
          await conn.query(
            `UPDATE applications SET status = 'rejected' WHERE id = ?`,
            [appId]
          );
        }
        // 🟢 Nếu completed
        else if (data.status === "completed") {
          if (data.result === "not_passed") {
            // ❌ Không đạt
            await conn.query(
              `UPDATE applications SET status = 'rejected' WHERE id = ?`,
              [appId]
            );
          } else {
            // ✅ Đạt
            await conn.query(
              `UPDATE applications SET status = 'accepted' WHERE id = ?`,
              [appId]
            );
          }
        }
      }

      await conn.commit();
      return { success: true };
    } catch (e) {
      await conn.rollback();
      console.error("❌ Interview update error:", e.message);
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
