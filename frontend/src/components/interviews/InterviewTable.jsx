"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Table, Tag, Space, Button, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import InterviewForm from "./InterviewForm";
import InterviewService from "@/services/InterviewService";

export default function InterviewTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // record đang edit

  const fetchData = async () => {
    setLoading(true);
    try {
      const rows = await InterviewService.getAll();
      setData(rows || []);
    } catch (e) {
      message.error("Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await InterviewService.remove(id);
      message.success("Deleted");
      fetchData();
    } catch (e) {
      message.error("Delete failed");
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (editing?.id) {
        await InterviewService.update(editing.id, payload);
        message.success("Updated");
      } else {
        await InterviewService.create(payload);
        message.success("Created");
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (e) {
      message.error("Save failed");
    }
  };

  const columns = useMemo(
    () => [
      { title: "ID", dataIndex: "id", width: 50 },
      { title: "Application", dataIndex: "application_id", width: 120 },
      {
        title: "Interviewer",
        dataIndex: "interviewer_id",
        width: 120,
        render: (v, row) => (
          <span>
            {row.interviewer_first_name || row.first_name || ""}{" "}
            {row.interviewer_last_name || row.last_name || ""}{" "}
          </span>
        ),
      },
      {
        title: "Scheduled",
        dataIndex: "scheduled_date",
        render: (v) => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-"),
      },
      {
        title: "Type",
        dataIndex: "interview_type",
        render: (t) => <Tag>{t || "-"}</Tag>,
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (s) => {
          const color =
            s === "scheduled"
              ? "blue"
              : s === "completed"
              ? "green"
              : s === "canceled"
              ? "red"
              : "default";
          return <Tag color={color}>{s || "-"}</Tag>;
        },
      },
      { title: "Rating", dataIndex: "rating", width: 90 },
      {
        title: "Job",
        dataIndex: "job_title",
        ellipsis: true,
        render: (t, row) => t || row.title || "-", // hỗ trợ cả SELECT join hoặc raw
      },
      {
        title: "Actions",
        fixed: "right",
        width: 160,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => handleEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete interview?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button size="small" danger>Delete</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Interviews</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          New Interview
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <InterviewForm
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        initialValues={editing}
      />
    </div>
  );
}
