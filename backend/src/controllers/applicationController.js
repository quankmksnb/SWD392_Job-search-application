// src/controllers/applicationController.js
import pool from "../../config/db.js";

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;           // application_id
    const { status } = req.body;         // 'rejected' | 'accepted' | 'reviewed' ...
    const allowed = ['submitted','reviewed','shortlisted','rejected','accepted'];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Trạng thái không hợp lệ" });

    const [result] = await pool.query(
      `UPDATE applications SET status = ? WHERE id = ?`,
      [status, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Application không tồn tại" });
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Cập nhật trạng thái thất bại" });
  }
};
