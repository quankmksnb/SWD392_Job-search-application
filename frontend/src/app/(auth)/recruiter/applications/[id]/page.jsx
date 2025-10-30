"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Form, Modal, DatePicker, Select, message, Tag } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";

export default function RecruiterApplicationDetail() {
  const { id } = useParams(); // application_id
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [recruiterId, setRecruiterId] = useState(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) {
      const u = JSON.parse(stored);
      setRecruiterId(u?.id || u?.user?.id);
    }
  }, []);

  useEffect(() => {
    if (!recruiterId) return;
    fetchData();
  }, [recruiterId]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/recruiter/applications?recruiter_id=${recruiterId}`);
      const found = res.data.find((a) => a.application_id == id);
      setRecord(found);
    } catch (e) {
      message.error("Không tải được hồ sơ");
    }
  };

  const handleCreateInterview = async (values) => {
    try {
      await api.post("/interviews", {
        application_id: record.application_id,
        interviewer_id: recruiterId,
        scheduled_date: values.scheduled_date.format("YYYY-MM-DD HH:mm:ss"), // ✅ format FE
        interview_type: values.interview_type,
        status: "scheduled",
      });
      message.success("Đã tạo lịch & chuyển trạng thái shortlisted");
      router.push("/recruiter/applications");
    } catch (e) {
      message.error("Tạo lịch thất bại");
    }
  };

  const markRejected = async () => {
    Modal.confirm({
      title: "Xác nhận từ chối",
      content: "Đánh dấu ứng viên không phù hợp?",
      onOk: async () => {
        try {
          await api.put(`/applications/${id}/status`, { status: "rejected" });
          message.success("Đã cập nhật trạng thái");
          router.push("/recruiter/applications");
        } catch {
          message.error("Cập nhật thất bại");
        }
      },
    });
  };

  if (!record) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6">
      <Card title="Chi tiết hồ sơ">
        <p><b>Họ tên:</b> {record.candidate_first_name} {record.candidate_last_name}</p>
        <p><b>Email:</b> {record.candidate_email}</p>
        <p><b>Vị trí:</b> {record.job_title} — {record.location}</p>
        <p><b>Trạng thái ứng dụng:</b> <Tag>{record.application_status}</Tag></p>

        <div className="flex gap-3 mt-4">
          <Button type="primary" onClick={() => setModalOpen(true)}>Phù hợp (Tạo lịch)</Button>
          <Button danger onClick={markRejected}>Ứng viên chưa phù hợp</Button>
        </div>
      </Card>

      <Modal
        title="Tạo lịch phỏng vấn"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateInterview}>
          <Form.Item
            label="Ngày phỏng vấn"
            name="scheduled_date"
            rules={[{ required: true, message: "Chọn ngày giờ" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item
            label="Hình thức"
            name="interview_type"
            rules={[{ required: true, message: "Chọn hình thức" }]}
          >
            <Select
              options={[
                { value: "in-person", label: "Trực tiếp" },
                { value: "video", label: "Video" },
                { value: "phone", label: "Điện thoại" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
