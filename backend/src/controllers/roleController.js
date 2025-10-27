import pool from "../../config/db.js";

/**
 * Lấy danh sách vai trò + quyền
 */
export const listRoles = async (req, res) => {
  try {
    // Lấy danh sách roles
    const [roles] = await pool.query("SELECT id, name, created_at FROM roles ORDER BY id");

    // Lấy danh sách quyền theo từng role
    const [rolePermissions] = await pool.query(`
      SELECT rp.role_id, p.id AS permission_id, p.name AS permission_name, p.module
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
    `);

    // Gộp quyền vào từng role
    const result = roles.map((r) => ({
      ...r,
      permissions: rolePermissions
        .filter((rp) => rp.role_id === r.id)
        .map((p) => ({
          id: p.permission_id,
          name: p.permission_name,
          module: p.module,
        })),
    }));

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách vai trò:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

/**
 * Tạo vai trò mới kèm quyền
 */
export const createRole = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { name, permissions = [] } = req.body;

    if (!name) return res.status(400).json({ message: "Tên vai trò là bắt buộc." });

    await conn.beginTransaction();

    // Thêm vai trò mới
    const [result] = await conn.query(
      "INSERT INTO roles (name, created_at) VALUES (?, NOW())",
      [name]
    );
    const roleId = result.insertId;

    // Gán quyền (nếu có)
    if (permissions.length > 0) {
      const values = permissions.map((pid) => [roleId, pid]);
      await conn.query("INSERT INTO role_permissions (role_id, permission_id) VALUES ?", [values]);
    }

    await conn.commit();

    res.status(201).json({ id: roleId, name, permissions });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi khi tạo vai trò:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  } finally {
    conn.release();
  }
};

/**
 * Cập nhật vai trò + danh sách quyền
 */
export const updateRole = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    const { name, permissions = [] } = req.body;

    await conn.beginTransaction();

    // Cập nhật tên vai trò
    await conn.query("UPDATE roles SET name = ? WHERE id = ?", [name, id]);

    // Xóa quyền cũ
    await conn.query("DELETE FROM role_permissions WHERE role_id = ?", [id]);

    // Thêm quyền mới
    if (permissions.length > 0) {
      const values = permissions.map((pid) => [id, pid]);
      await conn.query("INSERT INTO role_permissions (role_id, permission_id) VALUES ?", [values]);
    }

    await conn.commit();

    res.json({ id, name, permissions });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi khi cập nhật vai trò:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  } finally {
    conn.release();
  }
};

/**
 * Xóa vai trò + quan hệ quyền
 */
export const deleteRole = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { id } = req.params;
    await conn.beginTransaction();

    // Xóa quyền liên quan
    await conn.query("DELETE FROM role_permissions WHERE role_id = ?", [id]);

    // Xóa vai trò
    await conn.query("DELETE FROM roles WHERE id = ?", [id]);

    await conn.commit();

    res.json({ message: "Đã xóa vai trò và quyền liên quan." });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi khi xóa vai trò:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  } finally {
    conn.release();
  }
};
