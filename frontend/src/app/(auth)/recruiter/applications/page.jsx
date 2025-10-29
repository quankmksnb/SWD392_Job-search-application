"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Select, DatePicker, message, Tag } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [recruiterId, setRecruiterId] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

  // ✅ Đọc localStorage trong useEffect (client side only)
  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      const recruiter = JSON.parse(storedUser);
      setRecruiterId(recruiter?.id || recruiter?.user?.id);
    }
  }, []);

  // ✅ Chỉ fetch khi recruiterId có giá trị
  useEffect(() => {
    if (!recruiterId) return;
    fetchApplications();
    fetchJobs();
  }, [recruiterId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/recruiter/applications?recruiter_id=${recruiterId}`);
      setApplications(res.data);
    } catch {
      message.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/recruiter/jobs?recruiter_id=${recruiterId}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Job fetch error:", err);
    }
  };

  const openInterviewModal = (record) => {
    setSelectedApp(record);
    setModalVisible(true);
  };

  const handleCreateInterview = async (values) => {
    try {
      await api.post("/interviews", {
        application_id: selectedApp.application_id,
        interviewer_id: recruiterId,
        scheduled_date: values.scheduled_date,
        interview_type: values.interview_type,
      });
      message.success("Tạo lịch phỏng vấn thành công!");
      setModalVisible(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      message.error("Tạo lịch phỏng vấn thất bại");
    }
  };

  const columns = [
    {
      title: "Ứng viên",
      dataIndex: "candidate_first_name",
      render: (_, r) => `${r.candidate_first_name} ${r.candidate_last_name}`,
    },
    { title: "Email", dataIndex: "candidate_email" },
    { title: "Job", dataIndex: "job_title" },
    { title: "Vị trí", dataIndex: "location" },
    {
      title: "Trạng thái",
      dataIndex: "interview_status",
      render: (status) => {
        const colors = {
          pending: "default",
          scheduled: "blue",
          passed: "green",
          not_passed: "red",
          cancel: "volcano",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Phỏng vấn",
      dataIndex: "interview_status",
      render: (status, record) => {
        if (status === "pending") {
          return (
            <Button
              onClick={() =>
                router.push(`/recruiter/applications/${record.application_id}`)
              }
            >
              Xem chi tiết hồ sơ
            </Button>
          );
        }
        if (status === "scheduled") {
          return (
            <Button
              onClick={() =>
                router.push(`/recruiter/interview/${record.interview_id}`)
              }
            >
              Sửa lịch phỏng vấn
            </Button>
          );
        }
        if (status === "passed" || status === "not_passed") {
          return <Button disabled>Gửi thông báo (sắp ra mắt)</Button>;
        }
        if (status === "cancel") {
          return <Tag color="volcano">Đã hủy</Tag>;
        }
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách ứng viên</h1>
      <Table
        columns={columns}
        dataSource={applications}
        loading={loading}
        rowKey="application_id"
        bordered
      />

      {/* Modal Tạo Lịch */}
      <Modal
        title={`Tạo lịch phỏng vấn - ${selectedApp?.candidate_first_name || ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateInterview}>
          <Form.Item
            label="Ngày phỏng vấn"
            name="scheduled_date"
            rules={[{ required: true, message: "Chọn ngày phỏng vấn" }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Loại phỏng vấn"
            name="interview_type"
            rules={[{ required: true, message: "Chọn loại phỏng vấn" }]}
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
