// src/controllers/applicationController.js
import * as ApplicationService from "../services/applicationService.js";

export const getApplications = async (req, res) => {
  try {
    const applications = await ApplicationService.getAllApplications();
    res.json({ data: applications });
  } catch (err) {
    console.error(" Lỗi khi getAllApplications:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách ứng tuyển" });
  }
};

export const createApplication = async (req, res) => {
  try {
    const { candidate_id, job_posting_id, cover_letter, cv_id } = req.body;
    const newApp = await ApplicationService.addApplication(candidate_id, job_posting_id, cover_letter, cv_id);
    res.status(201).json({ data: newApp });
  } catch (err) {
    console.error(" Lỗi khi createApplication:", err);
    res.status(500).json({ message: "Lỗi khi thêm ứng tuyển mới" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const success = await ApplicationService.updateApplicationStatus(id, status);
    res.json({ success });
  } catch (err) {
    console.error(" Lỗi khi updateStatus:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await ApplicationService.deleteApplication(id);
    res.json({ success });
  } catch (err) {
    console.error(" Lỗi khi deleteApplication:", err);
    res.status(500).json({ message: "Lỗi khi xóa ứng tuyển" });
  }
};
