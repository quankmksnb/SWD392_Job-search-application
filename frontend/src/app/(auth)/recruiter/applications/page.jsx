"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Table, Tag, Button, message, Select, Space } from "antd";
import api from "@/services/api";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function RecruiterApplicationsPage() {
  const [recruiterId, setRecruiterId] = useState(null);
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Bộ lọc cho Tab A
  const [filterApp, setFilterApp] = useState({
    job: null,
    location: null,
    status: null,
  });

  // 🔹 Bộ lọc cho Tab B
  const [filterInt, setFilterInt] = useState({
    job: null,
    location: null,
    type: null,
    status: null,
  });

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

  // ---------------- TAB A FILTER LOGIC ----------------
  const filteredApps = useMemo(() => {
    return apps.filter((r) => {
      return (
        (!filterApp.job || r.job_title === filterApp.job) &&
        (!filterApp.location || r.location === filterApp.location) &&
        (!filterApp.status || r.application_status === filterApp.status)
      );
    });
  }, [apps, filterApp]);

  // ---------------- TAB B FILTER LOGIC ----------------
  const filteredInterviews = useMemo(() => {
    return interviews.filter((r) => {
      return (
        (!filterInt.job || r.job_title === filterInt.job) &&
        (!filterInt.location || r.location === filterInt.location) &&
        (!filterInt.type || r.interview_type === filterInt.type) &&
        (!filterInt.status || r.interview_status === filterInt.status)
      );
    });
  }, [interviews, filterInt]);

  // ✅ Tạo danh sách unique options
  const unique = (arr, key) => [...new Set(arr.map((x) => x[key]).filter(Boolean))];

  const jobOptionsA = unique(apps, "job_title").map((v) => ({ label: v, value: v }));
  const locOptionsA = unique(apps, "location").map((v) => ({ label: v, value: v }));
  const statusOptionsA = unique(apps, "application_status").map((v) => ({ label: v, value: v }));

  const jobOptionsB = unique(interviews, "job_title").map((v) => ({ label: v, value: v }));
  const locOptionsB = unique(interviews, "location").map((v) => ({ label: v, value: v }));
  const typeOptionsB = unique(interviews, "interview_type").map((v) => ({ label: v, value: v }));
  const statusOptionsB = unique(interviews, "interview_status").map((v) => ({ label: v, value: v }));

  // ------------------ COLUMNS ------------------
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
          return (
            <Tag color={r.application_status === "rejected" ? "volcano" : "green"}>
              Đã {r.application_status}
            </Tag>
          );
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
    {
      title: "Ngày",
      dataIndex: "scheduled_date",
      render: (v) => dayjs(v).format("DD/MM/YYYY HH:mm"),
    },
    { title: "Loại", dataIndex: "interview_type" },
    {
      title: "Trạng thái",
      dataIndex: "interview_status",
      render: (s) => {
        const color =
          s === "completed"
            ? "green"
            : s === "cancelled"
            ? "volcano"
            : "blue";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, r) => {
        if (["completed", "cancelled"].includes(r.interview_status)) {
          return (
            <Tag color={r.interview_status === "completed" ? "green" : "volcano"}>
              {r.interview_status === "completed" ? "Đã hoàn tất" : "Đã hủy"}
            </Tag>
          );
        }
        return (
          <Button
            type="default"
            onClick={() => router.push(`/recruiter/interviews/${r.interview_id}`)}
          >
            Xem/Sửa
          </Button>
        );
      },
    },
  ];

  // ------------------- RENDER -------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications Dashboard</h1>

      <Tabs
        items={[
          {
            key: "apps",
            label: "A. Applications List",
            children: (
              <>
                {/* 🧩 Bộ lọc Tab A */}
                <Space className="mb-3" wrap>
                  <Select
                    placeholder="Job"
                    allowClear
                    options={jobOptionsA}
                    onChange={(v) => setFilterApp({ ...filterApp, job: v })}
                    style={{ width: 160 }}
                  />
                  <Select
                    placeholder="Vị trí"
                    allowClear
                    options={locOptionsA}
                    onChange={(v) => setFilterApp({ ...filterApp, location: v })}
                    style={{ width: 160 }}
                  />
                  <Select
                    placeholder="Trạng thái"
                    allowClear
                    options={statusOptionsA}
                    onChange={(v) => setFilterApp({ ...filterApp, status: v })}
                    style={{ width: 160 }}
                  />
                </Space>

                <Table
                  columns={appCols}
                  dataSource={filteredApps}
                  rowKey="application_id"
                  loading={loading}
                  bordered
                />
              </>
            ),
          },
          {
            key: "interviews",
            label: "B. Interview List",
            children: (
              <>
                {/* 🧩 Bộ lọc Tab B */}
                <Space className="mb-3" wrap>
                  <Select
                    placeholder="Job"
                    allowClear
                    options={jobOptionsB}
                    onChange={(v) => setFilterInt({ ...filterInt, job: v })}
                    style={{ width: 160 }}
                  />
                  <Select
                    placeholder="Vị trí"
                    allowClear
                    options={locOptionsB}
                    onChange={(v) => setFilterInt({ ...filterInt, location: v })}
                    style={{ width: 160 }}
                  />
                  <Select
                    placeholder="Loại"
                    allowClear
                    options={typeOptionsB}
                    onChange={(v) => setFilterInt({ ...filterInt, type: v })}
                    style={{ width: 160 }}
                  />
                  <Select
                    placeholder="Trạng thái"
                    allowClear
                    options={statusOptionsB}
                    onChange={(v) => setFilterInt({ ...filterInt, status: v })}
                    style={{ width: 160 }}
                  />
                </Space>

                <Table
                  columns={interviewCols}
                  dataSource={filteredInterviews}
                  rowKey="interview_id"
                  bordered
                />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
