"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Rate } from "antd";
import dayjs from "dayjs";
// import { MasterDataService } from "@/services/masterDataService"; // nếu dùng

const typeOptions = [
  { value: "phone", label: "Phone" },
  { value: "video", label: "Video" },
  { value: "in-person", label: "In-person" },
];

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
];

export default function InterviewForm({
  open,
  onCancel,
  onSubmit,
  initialValues, // undefined khi create, có dữ liệu khi edit
}) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  // (tuỳ chọn) nạp options từ API
  // const [applications, setApplications] = useState([]);
  // const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        ...initialValues,
        scheduled_date: initialValues?.scheduled_date
          ? dayjs(initialValues.scheduled_date)
          : null,
      });
    } else {
      form.resetFields();
    }

    // (tuỳ chọn) gọi API
    // MasterDataService.applications().then(setApplications).catch(() => {});
    // MasterDataService.recruiters().then(setRecruiters).catch(() => {});
  }, [isEdit, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    // backend nhận dạng "YYYY-MM-DD HH:mm:ss"
    const payload = {
      ...values,
      scheduled_date: values.scheduled_date
        ? dayjs(values.scheduled_date).format("YYYY-MM-DD HH:mm:ss")
        : null,
    };
    onSubmit(payload);
  };

  return (
    <Modal
      title={isEdit ? "Update Interview" : "Create Interview"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText={isEdit ? "Save changes" : "Create"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Application ID"
            name="application_id"
            rules={[{ required: true, message: "Please input application_id" }]}
          >
            <Input placeholder="e.g. 1" />
            {/* Hoặc Select từ applications */}
          </Form.Item>

          <Form.Item
            label="Interviewer ID"
            name="interviewer_id"
            rules={[{ required: true, message: "Please input interviewer_id" }]}
          >
            <Input placeholder="e.g. 2" />
            {/* Hoặc Select từ recruiters */}
          </Form.Item>

          <Form.Item
            label="Scheduled Date"
            name="scheduled_date"
            rules={[{ required: true, message: "Please select date & time" }]}
          >
            <DatePicker showTime className="w-full" />
          </Form.Item>

          <Form.Item
            label="Interview Type"
            name="interview_type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select options={typeOptions} placeholder="Select type" />
          </Form.Item>

          <Form.Item label="Status" name="status" initialValue="scheduled">
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item label="Rating" name="rating">
            <Rate allowClear />
          </Form.Item>
        </div>

        <Form.Item label="Feedback" name="feedback">
          <Input.TextArea rows={3} placeholder="Notes / interviewer feedback" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
