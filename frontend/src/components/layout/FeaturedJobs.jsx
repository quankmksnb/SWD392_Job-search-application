import {
  BankOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import Image from "next/image";
import job2 from "../../../public/images/BE.png";
import job5 from "../../../public/images/DA.jpg";
import job1 from "../../../public/images/FE.jpg";
import job6 from "../../../public/images/MS.jpg";
import job3 from "../../../public/images/PM.jpg";
import job4 from "../../../public/images/uxui.png";

const { Title, Paragraph, Text } = Typography;

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Innovations",
    location: "Hà Nội",
    salary: "25 - 35 triệu",
    type: "Full-time",
    logo: job1,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Digital Solutions",
    location: "TP. Hồ Chí Minh",
    salary: "20 - 30 triệu",
    type: "Full-time",
    logo: job3,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Creative Studio",
    location: "Đà Nẵng",
    salary: "15 - 25 triệu",
    type: "Full-time",
    logo: job4,
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Analytics Pro",
    location: "Hà Nội",
    salary: "18 - 28 triệu",
    type: "Full-time",
    logo: job5,
  },
  {
    id: 5,
    title: "Backend Engineer",
    company: "Cloud Systems",
    location: "TP. Hồ Chí Minh",
    salary: "22 - 32 triệu",
    type: "Full-time",
    logo: job2,
  },
  {
    id: 6,
    title: "Marketing Specialist",
    company: "Brand Agency",
    location: "Hà Nội",
    salary: "16 - 26 triệu",
    type: "Full-time",
    logo: job6,
  },
];

const FeaturedJobs = () => {
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
              <Card hoverable className="h-full">
                <div className="flex items-start justify-between mb-4">
                  <Image
                    alt=""
                    size={48}
                    src={job.logo}
                    icon={<BankOutlined />}
                    shape="square"
                    className="mr-4"
                  />
                  <Tag color="blue">{job.type}</Tag>
                </div>

                <Title
                  level={5}
                  className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition"
                >
                  {job.title}
                </Title>

                <Text type="secondary" className="text-sm block mb-4">
                  {job.company}
                </Text>

                <Space className="w-full flex justify-between">
                  <Space size={4}>
                    <EnvironmentOutlined className="text-gray-500" />
                    <Text type="secondary" className="text-sm">
                      {job.location}
                    </Text>
                  </Space>
                  <Space size={4}>
                    <DollarOutlined className="text-blue-600" />
                    <Text className="text-sm font-semibold text-blue-600">
                      {job.salary}
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
