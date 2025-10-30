"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Form, DatePicker, Select, App, Tag } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";

export default function RecruiterInterviewDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interviews/${id}`);
      setInterview(res.data);
      form.setFieldsValue({
        scheduled_date: dayjs(res.data.scheduled_date),
        interview_type: res.data.interview_type,
      });
    } catch {
      message.error("Không tải được lịch phỏng vấn");
    }
  };

  // 🟢 Cập nhật lịch phỏng vấn
  const handleUpdate = async (values) => {
    try {
      await api.put(`/interviews/${id}`, {
        scheduled_date: values.scheduled_date.format("YYYY-MM-DD HH:mm:ss"),
        interview_type: values.interview_type,
      });
      message.success("✅ Đã cập nhật lịch phỏng vấn");
      setTimeout(() => router.push("/recruiter/applications"), 1000);
    } catch {
      message.error("❌ Cập nhật thất bại");
    }
  };

  // ✅ PASSED → interview.completed + application.accepted
  const markPassed = async () => {
    modal.confirm({
      title: "Xác nhận kết quả phỏng vấn",
      content: "Đánh dấu ứng viên này là PASSED?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await api.put(`/interviews/${id}`, {
            status: "completed",
            result: "passed",
          });
          message.success("✅ Ứng viên đã passed phỏng vấn");
          setTimeout(() => router.push("/recruiter/applications"), 1000);
        } catch {
          message.error("❌ Cập nhật thất bại");
        }
      },
    });
  };

  // ❌ NOT PASSED → interview.completed + application.rejected
  const markNotPassed = async () => {
    modal.confirm({
      title: "Xác nhận kết quả phỏng vấn",
      content: "Đánh dấu ứng viên này là NOT PASSED?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await api.put(`/interviews/${id}`, {
            status: "completed",
            result: "not_passed",
          });
          message.success("⚠️ Ứng viên không vượt qua phỏng vấn");
          setTimeout(() => router.push("/recruiter/applications"), 1000);
        } catch {
          message.error("❌ Cập nhật thất bại");
        }
      },
    });
  };

  // 🔴 HỦY CUỘC PHỎNG VẤN → interview.cancelled + application.rejected
  const cancelInterview = async () => {
    modal.confirm({
      title: "Hủy cuộc phỏng vấn",
      content: "Bạn có chắc muốn hủy cuộc phỏng vấn này không?",
      okText: "Xác nhận hủy",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          await api.put(`/interviews/${id}`, { status: "cancelled" });
          message.success("🔴 Cuộc phỏng vấn đã bị hủy");
          setTimeout(() => router.push("/recruiter/applications"), 1000);
        } catch {
          message.error("❌ Hủy thất bại");
        }
      },
    });
  };

  if (!interview) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6">
      <Card title="Chi tiết lịch phỏng vấn" bordered>
        <p>
          <b>Trạng thái:</b>{" "}
          <Tag
            color={
              interview.status === "completed"
                ? "green"
                : interview.status === "cancelled"
                ? "volcano"
                : "blue"
            }
          >
            {interview.status}
          </Tag>
        </p>

        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Ngày phỏng vấn"
            name="scheduled_date"
            rules={[{ required: true, message: "Chọn ngày giờ phỏng vấn" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>

          <Form.Item
            label="Hình thức phỏng vấn"
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

          <div className="flex gap-3">
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>

            <Button
              onClick={markPassed}
              type="default"
              style={{ color: "green", borderColor: "green" }}
            >
              Passed
            </Button>

            <Button onClick={markNotPassed} danger>
              Not Passed
            </Button>

            <Button onClick={cancelInterview} danger type="default">
              Hủy cuộc phỏng vấn
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
