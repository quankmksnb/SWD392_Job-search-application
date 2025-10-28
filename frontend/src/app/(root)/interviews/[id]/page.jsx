"use client";
import React, { useEffect, useState } from "react";
import { Descriptions, Card, message } from "antd";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import InterviewService from "@/services/InterviewService";

export default function InterviewDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    InterviewService.getById(id)
      .then(setItem)
      .catch(() => message.error("Load detail failed"));
  }, [id]);

  if (!item) return null;

  return (
    <div className="p-4 md:p-6">
      <Card title={`Interview #${item.id}`}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Application ID">{item.application_id}</Descriptions.Item>
          <Descriptions.Item label="Interviewer ID">{item.interviewer_id}</Descriptions.Item>
          <Descriptions.Item label="Scheduled">
            {item.scheduled_date ? dayjs(item.scheduled_date).format("YYYY-MM-DD HH:mm") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{item.interview_type}</Descriptions.Item>
          <Descriptions.Item label="Status">{item.status}</Descriptions.Item>
          <Descriptions.Item label="Rating">{item.rating ?? "-"}</Descriptions.Item>
          <Descriptions.Item label="Feedback">{item.feedback ?? "-"}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
