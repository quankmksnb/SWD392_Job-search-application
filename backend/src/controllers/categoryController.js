import { CategoryModel } from "../models/categoryModel.js";

export const listCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    
    const result = await CategoryModel.listAll({ page, limit, search });
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách categories." });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category." });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy thông tin category." });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên category là bắt buộc." });
    }

    const existing = await CategoryModel.findByName(name);
    if (existing) {
      return res.status(400).json({ message: "Category đã tồn tại." });
    }

    const newCategory = await CategoryModel.create({ name, slug });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo category." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, slug } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;

    if (name) {
      const existing = await CategoryModel.findByName(name);
      if (existing && existing.id !== id) {
        return res.status(400).json({ message: "Tên category đã tồn tại." });
      }
    }

    const updated = await CategoryModel.update(id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy category." });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật category." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category." });
    }

    await CategoryModel.delete(id);
    res.json({ message: "Đã xóa category thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ khi xóa category." });
  }
};
