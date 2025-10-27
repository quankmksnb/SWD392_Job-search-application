import { BankOutlined } from "@ant-design/icons";
import "@ant-design/compatible";
import { Card, Col, Row, Typography } from "antd";
import Image from "next/image";
import cty1 from "../../../public/images/cty1.jpg";
import cty2 from "../../../public/images/cty2.jpg";
import cty3 from "../../../public/images/cty3.jpg";
import cty4 from "../../../public/images/cty4.jpg";
import cty5 from "../../../public/images/cty5.jpg";
import cty6 from "../../../public/images/cty6.jpg";

const { Title, Paragraph, Text } = Typography;

const companies = [
  {
    id: 1,
    name: "Tech Innovations",
    logo: cty1,
    jobs: 24,
  },
  {
    id: 2,
    name: "Digital Solutions",
    logo: cty2,
    jobs: 18,
  },
  {
    id: 3,
    name: "Creative Studio",
    logo: cty3,
    jobs: 15,
  },
  {
    id: 4,
    name: "Analytics Pro",
    logo: cty4,
    jobs: 12,
  },
  {
    id: 5,
    name: "Cloud Systems",
    logo: cty5,
    jobs: 20,
  },
  {
    id: 6,
    name: "Brand Agency",
    logo: cty6,
    jobs: 14,
  },
];

const TopCompanies = () => {
  return (
    <section className="flex justify-center px-6 py-5 bg-gray-50">
      <div className=" w-[85%]">
        <div className="mb-8">
          <Title level={2} className="text-4xl font-bold text-gray-900 mb-4">
            Công ty nổi bật
          </Title>
          <Paragraph className="text-lg text-gray-600 mb-0">
            Những công ty hàng đầu đang tuyển dụng
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {companies.map((company) => (
            <Col xs={12} sm={12} md={8} lg={4} key={company.id}>
              <a href="#">
                <Card
                  hoverable
                  className="text-center h-full flex flex-col items-center justify-center"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                  }}
                >
                  <Image
                    alt=""
                    size={80}
                    src={company.logo}
                    icon={<BankOutlined />}
                    className="mb-4"
                  />
                  <Title
                    level={5}
                    className="text-sm font-bold text-gray-900 text-center mb-2"
                  >
                    {company.name}
                  </Title>
                  <Text type="secondary" className="text-xs">
                    {company.jobs} việc làm
                  </Text>
                </Card>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TopCompanies;
