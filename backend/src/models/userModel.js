import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

export const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role_id, status,
              password_hash, created_at, updated_at
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async create({
    email,
    password_hash,
    password, // 👈 thêm fallback cho controller nào gửi password thường
    first_name,
    last_name,
    role_id = 3,
    status = "active",
  }) {
    // ✅ Nếu không có password_hash, nhưng có password thô → tự hash
    if (!password_hash && password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // ⚠️ Nếu vẫn không có password_hash → lỗi
    if (!password_hash) {
      throw new Error("Password hash is required when creating a user.");
    }

    const now = new Date();
    const [result] = await pool.query(
      `INSERT INTO users
        (email, password_hash, first_name, last_name, role_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, password_hash, first_name, last_name, role_id, status, now, now]
    );

    return this.findById(result.insertId);
  },

  async update(id, data = {}) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(new Date(), id);
    const sql = `UPDATE users SET ${fields.join(
      ", "
    )}, updated_at = ? WHERE id = ?`;

    await pool.query(sql, values);
    return this.findById(id);
  },

  async listAll() {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, role_id, status, created_at
       FROM users ORDER BY id DESC`
    );
    return rows;
  },

  async delete(id) {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return;
  },
};
