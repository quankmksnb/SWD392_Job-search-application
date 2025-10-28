import pool from "../../config/db.js";

export const CategoryModel = {
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT id, name, slug, created_at
       FROM categories WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  async findByName(name) {
    const [rows] = await pool.query(
      "SELECT * FROM categories WHERE name = ?",
      [name]
    );
    return rows[0];
  },

  async create({ name, slug }) {
    const now = new Date();
    
    if (!slug) {
      slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    const [result] = await pool.query(
      `INSERT INTO categories (name, slug, created_at)
       VALUES (?, ?, ?)`,
      [name, slug, now]
    );

    return this.findById(result.insertId);
  },

  async update(id, data = {}) {
    const fields = [];
    const values = [];

    const allowed = ["name", "slug"];
    for (const key of allowed) {
      if (key in data && data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;

    await pool.query(sql, values);
    return this.findById(id);
  },

  async listAll({ page = 1, limit = 10, search = "" } = {}) {
    const offset = (page - 1) * limit;
    
    let whereClause = "";
    let params = [];
    
    if (search) {
      whereClause = "WHERE name LIKE ? OR slug LIKE ?";
      const searchPattern = `%${search}%`;
      params = [searchPattern, searchPattern];
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM categories ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT id, name, slug, created_at
       FROM categories 
       ${whereClause}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    return {
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async delete(id) {
    await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return;
  },
};
