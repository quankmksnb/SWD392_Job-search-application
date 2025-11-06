"use client";
import {
  BankOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
const { Title, Paragraph, Text } = Typography;

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);

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
          {jobs.map((job, index) => (
            <Col xs={24} sm={24} md={12} lg={8} key={job.id}>
              <Card hoverable className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <Image
                    alt={job.company_name}
                    src={`/images/${job.company_logo}`}
                    width={48}
                    height={48}
                    className="rounded-md"
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
    </section>
  );
};

export default FeaturedJobs;
