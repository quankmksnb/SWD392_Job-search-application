"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Tabs,
  Select,
  Button,
  DatePicker,
  message,
  Form,
  Modal,
} from "antd";
import api from "@/services/api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function RecruiterApplicationsPage() {
  const [recruiter, setRecruiter] = useState(null);

  // Dữ liệu hiển thị
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);

  // Bộ lọc tab A và B
  const [filtersA, setFiltersA] = useState({
    job_id: null,
    location: null,
    status: null,
  });

  const [filtersB, setFiltersB] = useState({
    job_id: null,
    interview_type: null,
    status: null,
    dateRange: [],
  });

  // Khởi tạo recruiter
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setRecruiter(stored?.user || stored);
    } catch (err) {
      console.error("Lỗi parse user:", err);
    }
  }, []);

  // Lấy jobs
  const fetchJobs = async () => {
    if (!recruiter?.id) return;
    try {
      const res = await api.get(`/recruiter/jobs?recruiter_id=${recruiter.id}`);
      setJobs(res.data);

      const uniqueLocs = [
        ...new Set(res.data.map((j) => j.location).filter(Boolean)),
      ];
      setLocations(uniqueLocs);
    } catch (e) {
      console.error("❌ Lỗi tải job:", e);
    }
  };

  // Lấy ứng viên
  const fetchApplications = async () => {
    if (!recruiter?.id) return;
    try {
      const params = new URLSearchParams({
        recruiter_id: recruiter.id,
        ...Object.fromEntries(Object.entries(filtersA).filter(([_, v]) => v)),
      });
      const res = await api.get(`/recruiter/applications?${params.toString()}`);
      setApplications(res.data);
    } catch (e) {
      console.error("❌ Lỗi tải ứng viên:", e);
      message.error("Không tải được danh sách ứng viên");
    }
  };

  // Lấy lịch phỏng vấn
  const fetchInterviews = async () => {
    if (!recruiter?.id) return;
    try {
      const params = new URLSearchParams({
        recruiter_id: recruiter.id,
        job_id: filtersB.job_id || "",
        interview_type: filtersB.interview_type || "",
        status: filtersB.status || "",
      });

      if (filtersB.dateRange?.length === 2) {
        params.append("date_from", filtersB.dateRange[0].format("YYYY-MM-DD"));
        params.append("date_to", filtersB.dateRange[1].format("YYYY-MM-DD"));
      }

      const res = await api.get(`/interviews?${params.toString()}`);
      setInterviews(res.data);
    } catch (e) {
      console.error("❌ Lỗi tải interview:", e);
      message.error("Không tải được lịch phỏng vấn");
    }
  };

  useEffect(() => {
    if (!recruiter?.id) return;
    fetchJobs();
    fetchApplications();
    fetchInterviews();
  }, [recruiter]);

  // Cột Tab A
  const columnsA = [
    { title: "Tên ứng viên", dataIndex: "candidate_first_name", key: "candidate_first_name" },
    { title: "Email", dataIndex: "candidate_email", key: "candidate_email" },
    { title: "Job", dataIndex: "job_title", key: "job_title" },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    { title: "Trạng thái", dataIndex: "application_status", key: "application_status" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          {record.application_status === "submitted" || record.application_status === "reviewed" ? (
            <Button type="link" href={`/recruiter/applications/${record.application_id}`}>
              Xem hồ sơ
            </Button>
          ) : record.application_status === "shortlisted" ? (
            <Button type="link" href={`/recruiter/interviews/${record.application_id}`}>
              Xem/Sửa lịch phỏng vấn
            </Button>
          ) : (
            "-"
          )}
        </>
      ),
    },
  ];

  // Cột Tab B
  const columnsB = [
    { title: "Ứng viên", dataIndex: "candidate_name", key: "candidate_name" },
    { title: "Job", dataIndex: "job_title", key: "job_title" },
    { title: "Ngày phỏng vấn", dataIndex: "scheduled_date", key: "scheduled_date",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "-")
    },
    { title: "Loại phỏng vấn", dataIndex: "interview_type", key: "interview_type" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="link" href={`/recruiter/interviews/${record.id}`}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <Tabs defaultActiveKey="A">
        {/* 🔹 Tab A: Applications List */}
        <TabPane tab="A. Applications List" key="A">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            {/* Lọc theo Job */}
            <Select
              allowClear
              placeholder="Chọn Job"
              style={{ width: 200 }}
              onChange={(value) => setFiltersA((prev) => ({ ...prev, job_id: value }))}
            >
              {jobs.map((job) => (
                <Select.Option key={job.job_id} value={job.job_id}>
                  {job.title}
                </Select.Option>
              ))}
            </Select>

            {/* Lọc theo Vị trí */}
            <Select
              allowClear
              placeholder="Chọn vị trí"
              style={{ width: 200 }}
              onChange={(value) => setFiltersA((prev) => ({ ...prev, location: value }))}
            >
              {locations.map((loc) => (
                <Select.Option key={loc} value={loc}>
                  {loc}
                </Select.Option>
              ))}
            </Select>

            {/* Lọc theo Trạng thái */}
            <Select
              allowClear
              placeholder="Trạng thái hồ sơ"
              style={{ width: 180 }}
              onChange={(value) => setFiltersA((prev) => ({ ...prev, status: value }))}
            >
              <Select.Option value="submitted">Chờ duyệt</Select.Option>
              <Select.Option value="reviewed">Đã xem</Select.Option>
              <Select.Option value="shortlisted">Đã chọn</Select.Option>
              <Select.Option value="rejected">Đã loại</Select.Option>
              <Select.Option value="accepted">Đã nhận</Select.Option>
            </Select>

            <Button type="primary" onClick={fetchApplications}>
              Lọc
            </Button>
          </div>

          <Table
            columns={columnsA}
            dataSource={applications}
            rowKey="application_id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        {/* 🔹 Tab B: Interview List */}
        <TabPane tab="B. Interview List" key="B">
          <div className="flex flex-wrap gap-3 mb-4 items-center">
            {/* Job */}
            <Select
              allowClear
              placeholder="Chọn Job"
              style={{ width: 200 }}
              onChange={(value) => setFiltersB((prev) => ({ ...prev, job_id: value }))}
            >
              {jobs.map((job) => (
                <Select.Option key={job.job_id} value={job.job_id}>
                  {job.title}
                </Select.Option>
              ))}
            </Select>

            {/* Loại phỏng vấn */}
            <Select
              allowClear
              placeholder="Hình thức phỏng vấn"
              style={{ width: 180 }}
              onChange={(value) => setFiltersB((prev) => ({ ...prev, interview_type: value }))}
            >
              <Select.Option value="in-person">Trực tiếp</Select.Option>
              <Select.Option value="video">Video</Select.Option>
              <Select.Option value="phone">Điện thoại</Select.Option>
            </Select>

            {/* Trạng thái */}
            <Select
              allowClear
              placeholder="Trạng thái"
              style={{ width: 160 }}
              onChange={(value) => setFiltersB((prev) => ({ ...prev, status: value }))}
            >
              <Select.Option value="scheduled">Đang lên lịch</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>

            {/* Khoảng thời gian */}
            <RangePicker
              style={{ width: 260 }}
              onChange={(dates) => setFiltersB((prev) => ({ ...prev, dateRange: dates }))}
              format="DD/MM/YYYY"
            />

            <Button type="primary" onClick={fetchInterviews}>
              Lọc
            </Button>
          </div>

          <Table
            columns={columnsB}
            dataSource={interviews}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
