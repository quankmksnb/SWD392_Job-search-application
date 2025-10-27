import pool from "../../config/db.js";

/**
 * 📋 Lấy danh sách tất cả quyền
 * GET /permissions
 */
export const listPermissions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, module, created_at FROM permissions ORDER BY module, id"
    );
    res.json(rows);
  } catch (err) {
    console.error("Lỗi khi tải danh sách quyền:", err);
    res.status(500).json({ message: "Lỗi khi tải danh sách quyền." });
  }
};

/**
 * ➕ Tạo quyền mới
 * POST /permissions
 */
export const createPermission = async (req, res) => {
  try {
    const { name, module } = req.body;

    if (!name)
      return res.status(400).json({ message: "Tên quyền là bắt buộc." });

    const [result] = await pool.query(
      "INSERT INTO permissions (name, module, created_at) VALUES (?, ?, NOW())",
      [name, module]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      module,
      message: "Tạo quyền thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi tạo quyền:", err);
    res.status(500).json({ message: "Lỗi khi tạo quyền mới." });
  }
};

/**
 * ✏️ Cập nhật quyền
 * PUT /permissions/:id
 */
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, module } = req.body;

    if (!name)
      return res.status(400).json({ message: "Tên quyền là bắt buộc." });

    const [result] = await pool.query(
      "UPDATE permissions SET name = ?, module = ? WHERE id = ?",
      [name, module, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy quyền." });

    res.json({
      id,
      name,
      module,
      message: "Cập nhật quyền thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật quyền:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật quyền." });
  }
};

/**
 * ❌ Xóa quyền
 * DELETE /permissions/:id
 */
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM permissions WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Không tìm thấy quyền để xóa." });

    res.json({ message: "Đã xóa quyền thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa quyền:", err);
    res.status(500).json({ message: "Lỗi khi xóa quyền." });
  }
};
