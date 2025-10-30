"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Table, Tag, Button, message } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function RecruiterApplicationsPage() {
  const [recruiterId, setRecruiterId] = useState(null);
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (stored) {
      const u = JSON.parse(stored);
      setRecruiterId(u?.id || u?.user?.id);
    }
  }, []);

  useEffect(() => {
    if (!recruiterId) return;
    fetchApplications();
    fetchInterviews();
  }, [recruiterId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/recruiter/applications?recruiter_id=${recruiterId}`);
      setApps(res.data);
    } catch {
      message.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviews = async () => {
    try {
      const res = await api.get(`/recruiter/interviews?recruiter_id=${recruiterId}`);
      setInterviews(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const statusTag = (s) => {
    const map = {
      submitted: "default",
      reviewed: "processing",
      shortlisted: "blue",
      rejected: "volcano",
      accepted: "green",
    };
    return <Tag color={map[s] || "default"}>{s}</Tag>;
  };

  const appCols = [
    {
      title: "Ứng viên",
      render: (_, r) => `${r.candidate_first_name} ${r.candidate_last_name}`,
    },
    { title: "Email", dataIndex: "candidate_email" },
    { title: "Job", dataIndex: "job_title" },
    { title: "Vị trí", dataIndex: "location" },
    {
      title: "Trạng thái",
      dataIndex: "application_status",
      render: statusTag,
    },
    {
      title: "Hành động",
      render: (_, r) => {
        if (["submitted", "reviewed"].includes(r.application_status)) {
          return (
            <Button onClick={() => router.push(`/recruiter/applications/${r.application_id}`)}>
              Xem hồ sơ
            </Button>
          );
        }
        if (r.application_status === "shortlisted" && r.interview_id) {
          return (
            <Button onClick={() => router.push(`/recruiter/interviews/${r.interview_id}`)}>
              Xem/Sửa lịch phỏng vấn
            </Button>
          );
        }
        if (["rejected", "accepted"].includes(r.application_status)) {
          return <Tag color={r.application_status === "rejected" ? "volcano" : "green"}>Đã {r.application_status}</Tag>;
        }
        return null;
      },
    },
  ];

  const interviewCols = [
    {
      title: "Ứng viên",
      render: (_, r) => `${r.candidate_first_name} ${r.candidate_last_name}`,
    },
    { title: "Email", dataIndex: "candidate_email" },
    { title: "Job", dataIndex: "job_title" },
    { title: "Vị trí", dataIndex: "location" },
    { title: "Ngày", dataIndex: "scheduled_date", render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm") },
    { title: "Loại", dataIndex: "interview_type" },
    { title: "Trạng thái", dataIndex: "interview_status", render: (s) => <Tag>{s}</Tag> },
    {
      title: "Hành động",
      render: (_, r) => (
        <Button onClick={() => router.push(`/recruiter/interviews/${r.interview_id}`)}>
          Xem/Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications Dashboard</h1>

      <Tabs
        items={[
          {
            key: "apps",
            label: "A. Applications List",
            children: (
              <Table
                columns={appCols}
                dataSource={apps}
                rowKey="application_id"
                loading={loading}
                bordered
              />
            ),
          },
          {
            key: "interviews",
            label: "B. Interview List",
            children: (
              <Table
                columns={interviewCols}
                dataSource={interviews}
                rowKey="interview_id"
                bordered
              />
            ),
          },
        ]}
      />
    </div>
  );
}
