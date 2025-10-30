"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Form, DatePicker, Select, message, Tag } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";

export default function RecruiterInterviewDetail() {
  const { id } = useParams(); // interview_id
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => { fetchInterview(); }, []);

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

  const handleUpdate = async (values) => {
    try {
      await api.put(`/interviews/${id}`, {
        scheduled_date: values.scheduled_date.format("YYYY-MM-DD HH:mm:ss"),
        interview_type: values.interview_type,
      });
      message.success("Đã cập nhật lịch phỏng vấn");
      fetchInterview();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  const markCompleted = async () => {
    try {
      await api.put(`/interviews/${id}`, { status: "completed" });
      message.success("Đã đánh dấu completed");
      fetchInterview();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  if (!interview) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6">
      <Card title="Chi tiết lịch phỏng vấn">
        <p><b>Trạng thái:</b> <Tag>{interview.status}</Tag></p>

        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Ngày phỏng vấn" name="scheduled_date" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item label="Hình thức" name="interview_type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "in-person", label: "Trực tiếp" },
                { value: "video", label: "Video" },
                { value: "phone", label: "Điện thoại" },
              ]}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">Cập nhật</Button>
          <Button className="ml-2" onClick={markCompleted}>Đánh dấu Completed</Button>
        </Form>
      </Card>
    </div>
  );
}
