"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Spin,
  App,
  Avatar,
  Badge,
  Typography,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getProfile, updateProfile } from "@/services/UserService";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const { notification } = App.useApp();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setProfile(res.data);
      form.setFieldsValue(res.data);

      notification.success({
        message: "Tải thông tin thành công",
        description: "Thông tin hồ sơ của bạn đã được tải.",
        duration: 3,
        placement: "topRight",
      });
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Tải thông tin thất bại",
        description: "Không thể tải thông tin hồ sơ. Vui lòng thử lại.",
        duration: 3,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateInfo = async () => {
    try {
      const values = await form.validateFields();
      await updateProfile(values);

      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được lưu lại.",
        duration: 3,
        placement: "topRight",
      });

      fetchProfile();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Cập nhật thất bại",
        description:
          err.response?.data?.message ||
          "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        duration: 3,
        placement: "topRight",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();

      if (values.new_password !== values.confirm_password) {
        return notification.warning({
          message: "Xác nhận mật khẩu không khớp",
          description: "Mật khẩu xác nhận không khớp!",
          duration: 3,
          placement: "topRight",
        });
      }

      setPasswordLoading(true);
      await updateProfile({
        old_password: values.old_password,
        new_password: values.new_password,
      });

      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu mới của bạn đã được cập nhật.",
        duration: 3,
        placement: "topRight",
      });

      passwordForm.resetFields();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Đổi mật khẩu thất bại",
        description:
          err.response?.data?.message ||
          "Không thể đổi mật khẩu. Hãy kiểm tra lại mật khẩu cũ.",
        duration: 3,
        placement: "topRight",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Title level={2} className="!mb-2">
          Hồ sơ cá nhân
        </Title>
        <Text type="secondary" className="text-base">
          Quản lý thông tin tài khoản và bảo mật của bạn
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Card */}
        <Col xs={24} lg={8}>
          <Card
            className="shadow-lg rounded-2xl border-0"
            bodyStyle={{ padding: "32px" }}
          >
            <div className="flex flex-col items-center text-center">
              <Badge
                count={
                  profile?.status === "active" ? (
                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                  ) : null
                }
                offset={[-8, 8]}
              >
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl"
                  style={{ border: "4px solid white" }}
                />
              </Badge>

              <Title level={3} className="!mt-6 !mb-2">
                {profile?.first_name} {profile?.last_name}
              </Title>

              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MailOutlined />
                <Text type="secondary">{profile?.email}</Text>
              </div>

              <div className="w-full mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <Text type="secondary">Trạng thái tài khoản</Text>
                  <Badge
                    status={profile?.status === "active" ? "success" : "default"}
                    text={
                      <Text strong className="capitalize">
                        {profile?.status || "N/A"}
                      </Text>
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column - Forms */}
        <Col xs={24} lg={16}>
          <div className="space-y-6">
            {/* Personal Information Card */}
            <Card
              title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <UserOutlined className="text-blue-500 text-lg" />
                  </div>
                  <div>
                    <Title level={4} className="!mb-0">
                      Thông tin cá nhân
                    </Title>
                    <Text type="secondary" className="text-sm">
                      Cập nhật thông tin cơ bản của bạn
                    </Text>
                  </div>
                </div>
              }
              className="shadow-lg rounded-2xl border-0"
              bodyStyle={{ padding: "32px" }}
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={profile}
                requiredMark={false}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>Họ</Text>}
                      name="first_name"
                      rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Nguyễn"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>Tên</Text>}
                      name="last_name"
                      rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Văn A"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item label={<Text strong>Email</Text>} name="email">
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        disabled
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label={<Text strong>Trạng thái</Text>} name="status">
                      <Input
                        disabled
                        size="large"
                        className="rounded-lg capitalize"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end pt-4">
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleUpdateInfo}
                    size="large"
                    className="rounded-lg px-8 shadow-md hover:shadow-lg transition-shadow"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </Card>

            {/* Change Password Card */}
            <Card
              title={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <LockOutlined className="text-orange-500 text-lg" />
                  </div>
                  <div>
                    <Title level={4} className="!mb-0">
                      Bảo mật
                    </Title>
                    <Text type="secondary" className="text-sm">
                      Thay đổi mật khẩu tài khoản
                    </Text>
                  </div>
                </div>
              }
              className="shadow-lg rounded-2xl border-0"
              bodyStyle={{ padding: "32px" }}
            >
              <Form form={passwordForm} layout="vertical" requiredMark={false}>
                <Form.Item
                  label={<Text strong>Mật khẩu cũ</Text>}
                  name="old_password"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Nhập mật khẩu cũ"
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>Mật khẩu mới</Text>}
                      name="new_password"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu mới" },
                        { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Nhập mật khẩu mới"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<Text strong>Xác nhận mật khẩu</Text>}
                      name="confirm_password"
                      dependencies={["new_password"]}
                      rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Nhập lại mật khẩu mới"
                        size="large"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <div className="flex justify-end pt-4">
                  <Button
                    type="primary"
                    danger
                    icon={<SaveOutlined />}
                    loading={passwordLoading}
                    onClick={handleChangePassword}
                    size="large"
                    className="rounded-lg px-8 shadow-md hover:shadow-lg transition-shadow"
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}