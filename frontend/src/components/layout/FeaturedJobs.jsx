"use client";
import {
  BankOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Tag,
  Typography,
  Input,
  message,
} from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { createApplication } from "@/services/applicationService"; 
import { useParams, useRouter } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // --- Lấy danh sách việc làm
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:9999/job/job-list");
        setJobs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // --- Khi bấm vào 1 job card
  const handleCardClick = (job) => {
    setSelectedJob(job);
    setOpen(true);
  };

  // --- Khi người dùng bấm "Ứng tuyển"
  const handleApply = async () => {
    if (!selectedJob) return;
    setLoading(true);
    try {
      await createApplication({
        candidate_id: 1, // giả định tạm thời
        job_posting_id: selectedJob.id,
        cv_id: 1, // nếu có CV
        cover_letter: note,
      });
      message.success("Ứng tuyển thành công!");
      router.push("/application");

      setNote("");
      setOpen(false);
      setTimeout(() => {
      router.push("/application");
    }, 1000);
    } catch (err) {
      console.error("Error applying:", err);
      message.error("Ứng tuyển thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center px-6 py-10 bg-white">
      <div className="w-[85%]">
        <div className="mb-8">
          <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
            Việc làm nổi bật
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-0">
            Những cơ hội việc làm tốt nhất được cập nhật hàng ngày
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {jobs.map((job) => (
            <Col xs={24} sm={24} md={12} lg={8} key={job.id}>
              <Card
                hoverable
                className="h-full cursor-pointer"
                onClick={() => handleCardClick(job)}
              >
                <div className="flex items-start justify-between mb-4">
                  <Image
                    alt={job.company_name}
                    src={`/images/${job.company_logo}`}
                    width={48}
                    height={48}
                    className="rounded-md object-contain"
                  />
                  <Tag color="blue" className="capitalize">
                    {job.job_type}
                  </Tag>
                </div>

                <Title
                  level={5}
                  className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition"
                >
                  {job.title}
                </Title>

                <Text type="secondary" className="text-sm block mb-4">
                  {job.company_name}
                </Text>

                <Space className="w-full flex justify-between">
                  <Space size={4}>
                    <EnvironmentOutlined className="text-gray-500" />
                    <Text type="secondary" className="text-sm capitalize">
                      {job.location}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <DollarOutlined className="text-blue-600" />
                    <Text className="text-sm font-semibold text-blue-600">
                      {job.salary_min} - {job.salary_max} USD
                    </Text>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-12">
          <Button
            type="default"
            size="large"
            className="px-8 h-12 text-lg font-semibold"
          >
            Xem tất cả việc làm
          </Button>
        </div>
      </div>

      {/* Modal hiển thị chi tiết job */}
      <Modal
        open={open}
        title={selectedJob?.title}
        onCancel={() => { setOpen(false); setNote(""); }}
        footer={null}
      >
        {selectedJob && (
          <div className="space-y-3">
            <p>
              <strong>Công ty:</strong> {selectedJob.company_name}
            </p>
            <p>
              <strong>Địa điểm:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Mức lương:</strong> {selectedJob.salary_min} -{" "}
              {selectedJob.salary_max} USD
            </p>
            <p>
              <strong>Loại công việc:</strong> {selectedJob.job_type}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedJob.description}
            </p>

            <Input.TextArea
              rows={3}
              placeholder="Nhập ghi chú / cover letter"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                loading={loading}
                onClick={handleApply}
              >
                Ứng tuyển
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default FeaturedJobs;
