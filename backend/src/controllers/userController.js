import { UserModel } from "../models/userModel.js";
import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, email, first_name, last_name, role_id, status, created_at, updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Không tìm thấy người dùng." });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  } finally {
    conn.release();
  }
};

/**
 * Cập nhật thông tin cá nhân + đổi mật khẩu
 */
export const updateProfile = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;
    const {
      first_name,
      last_name,
      status,
      role_id,
      old_password,
      new_password,
    } = req.body;

    // Lấy thông tin user hiện tại
    const [users] = await conn.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (!users.length)
      return res.status(404).json({ message: "Người dùng không tồn tại." });

    const user = users[0];

    // Kiểm tra đổi mật khẩu
    if (old_password || new_password) {
      if (!old_password || !new_password) {
        return res
          .status(400)
          .json({ message: "Cần nhập đầy đủ mật khẩu cũ và mật khẩu mới." });
      }

      const isMatch = await bcrypt.compare(old_password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không đúng." });
      }

      const hashedPassword = await bcrypt.hash(new_password, 10);
      await conn.query("UPDATE users SET password_hash = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);
    }

    // Cập nhật thông tin cá nhân
    const updateFields = { first_name, last_name, status, role_id };
    const filteredFields = Object.entries(updateFields)
      .filter(([_, v]) => v !== undefined && v !== null)
      .reduce((obj, [k, v]) => ((obj[k] = v), obj), {});

    if (Object.keys(filteredFields).length > 0) {
      const setClause = Object.keys(filteredFields)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(filteredFields), userId];
      await conn.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    }

    // Trả lại dữ liệu mới
    const [updatedRows] = await conn.query(
      "SELECT id, email, first_name, last_name, role_id, status, updated_at FROM users WHERE id = ?",
      [userId]
    );

    res.json({
      message: "Cập nhật hồ sơ thành công.",
      user: updatedRows[0],
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật hồ sơ:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  } finally {
    conn.release();
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await UserModel.listAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const removeUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (req.user.role_id !== 1 && req.user.id !== id)
      return res
        .status(403)
        .json({ message: "Không có quyền xóa người dùng này." });

    await UserModel.delete(id);
    res.json({ message: "Đã xóa người dùng." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role_id } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email và mật khẩu là bắt buộc." });
    }

    // Mặc định status là active
    const newUser = {
      first_name: first_name || "",
      last_name: last_name || "",
      email,
      password,
      role_id: role_id || 3, // mặc định là user thường
      status: "active",
    };

    const created = await UserModel.create(newUser);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo người dùng." });
  }
};

// 🟡 Cập nhật thông tin người dùng (admin)
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const allowed = ["first_name", "last_name", "status", "role_id"];
    const updates = {};

    allowed.forEach((key) => {
      if (key in req.body) updates[key] = req.body[key];
    });

    const updated = await UserModel.update(id, updates);
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy người dùng." });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật người dùng." });
  }
};
