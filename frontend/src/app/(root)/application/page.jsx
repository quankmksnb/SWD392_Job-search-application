"use client";

import React, { useEffect, useState } from "react";
import {
  getApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "@/services/applicationService";

export default function ApplicationPage() {
  const [applications, setApplications] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  // load danh sách khi mở trang
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await getApplications(); // ✅ vì service đã trả về res.data
      setApplications(data || []);
    } catch (err) {
      console.error(" Failed to load applications in page:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      console.log("Bứt đầu Chạy handle CReate in page")
    await createApplication({
      candidate_id: 1, // ứng với candidate_profiles.id = 1
      job_posting_id: 2,
      cv_id: 1, // nếu có
      cover_letter: note, // map đúng tên trường
    });
    console.log("sau khi goi api")
    setNote("");
    await loadApplications();
  } catch (err) {
    console.error("Create failed in page:", err);
  }
  };

  const handleDelete = async (id) => {
    await deleteApplication(id);
    await loadApplications();
  };

  const handleUpdate = async (id, status) => {
    await updateApplicationStatus(id, status);
    await loadApplications();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4"> Quản lý hồ sơ ứng tuyển</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nhập ghi chú"
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Ứng tuyển
        </button>
      </div>

      {applications.length === 0 ? (
        <p>Chưa có hồ sơ ứng tuyển nào.</p>
      ) : (
        <ul className="space-y-3">
          {applications.map((app) => (
            <li
              key={app.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <strong>{app.job_title}</strong> <br />
                <span className="text-gray-600 text-sm">
                  Trạng thái: {app.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(app.id, "withdrawn")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Rút đơn
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
