"use client";
import '@ant-design/compatible';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Tag,
  Space,
  Card,
  Avatar,
  Input,
  Select,
  Badge,
  Modal,
  Descriptions,
  Divider,
  Form,
  Statistic,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  CrownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  EyeOutlined,
  TeamOutlined,
  SafetyOutlined,
  UserAddOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  listUsers,
  deleteUser,
  createUser,
  updateUser,
} from "@/services/UserService";

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [msg, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  // 🔒 Kiểm tra quyền admin
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          router.replace("/login");
          return;
        }

        const data = JSON.parse(stored);
        const user = data.user;

        if (!user || Number(user.role_id) !== 1) {
          router.replace("/");
          return;
        }

        setCurrentUser(user);
        fetchUsers();
      } catch (err) {
        console.error("Error parsing user:", err);
        router.replace("/login");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchText, filterRole, filterStatus]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await listUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      msg.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter((user) => {
        const fullName = `${user.first_name || ""} ${
          user.last_name || ""
        }`.toLowerCase();
        const email = (user.email || "").toLowerCase();
        const search = searchText.toLowerCase();
        return fullName.includes(search) || email.includes(search);
      });
    }

    // Filter by role
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role_id === Number(filterRole));
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      msg.success("Đã xóa người dùng thành công");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      msg.error("Không thể xóa người dùng");
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = (firstName || "").charAt(0).toUpperCase();
    const last = (lastName || "").charAt(0).toUpperCase();
    return first + last || "??";
  };

  const getRoleName = (roleId) => {
    const roles = {
      1: "Admin",
      2: "Recruiter",
      3: "Candidate",
    };
    return roles[roleId] || "Unknown";
  };

  const getRoleColor = (roleId) => {
    const colors = {
      1: "#1890ff",
      2: "#722ed1",
      3: "#52c41a",
    };
    return colors[roleId] || "#d9d9d9";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showUserDetail = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsFormVisible(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role_id: user.role_id,
      status: user.status,
    });
    setIsFormVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        // update
        await updateUser(editingUser.id, values);
        msg.success("Cập nhật người dùng thành công!");
      } else {
        // create
        await createUser(values);
        msg.success("Thêm người dùng thành công!");
      }

      setIsFormVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      msg.error("Không thể lưu thông tin người dùng.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  // Stats calculations
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role_id === 1).length,
  };

  const columns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <UserOutlined /> Người dùng
        </span>
      ),
      key: "user",
      width: 280,
      render: (_, record) => {
        const fullName =
          `${record.first_name || ""} ${record.last_name || ""}`.trim() ||
          "Chưa có tên";
        const initials = getInitials(record.first_name, record.last_name);
        const isCurrentUser = currentUser?.id === record.id;

        return (
          <Space size={12}>
            <Avatar
              size={45}
              style={{
                backgroundColor: getRoleColor(record.role_id),
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {initials}
            </Avatar>
            <div>
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                {fullName}
                {record.role_id === 1 && (
                  <CrownOutlined className="text-blue-500" />
                )}
                {isCurrentUser && (
                  <Tag color="cyan" style={{ margin: 0, fontSize: "11px" }}>
                    Bạn
                  </Tag>
                )}
              </div>
              <div className="text-gray-500 text-sm flex items-center gap-1">
                <MailOutlined className="text-xs" />
                {record.email}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <CrownOutlined /> Vai trò
        </span>
      ),
      dataIndex: "role_id",
      key: "role_id",
      width: 140,
      align: "center",
      render: (role_id) => {
        const roleName = getRoleName(role_id);
        const roleConfig = {
          1: { color: "blue", icon: <CrownOutlined /> },
          2: { color: "purple", icon: <UserOutlined /> },
          3: { color: "green", icon: <UserOutlined /> },
        };
        const config = roleConfig[role_id] || {
          color: "default",
          icon: <UserOutlined />,
        };

        return (
          <Tag color={config.color} icon={config.icon} className="text-sm py-1 px-3">
            {roleName}
          </Tag>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <CheckCircleOutlined /> Trạng thái
        </span>
      ),
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: (status) =>
        status === "active" ? (
          <Badge
            status="success"
            text={<span className="text-green-600 font-medium">Hoạt động</span>}
          />
        ) : (
          <Badge
            status="error"
            text={<span className="text-red-600 font-medium">Đã khóa</span>}
          />
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) =>
        currentUser?.id === record.id ? (
          <Tag color="cyan" icon={<CheckCircleOutlined />} className="px-3 py-1">
            Tài khoản của bạn
          </Tag>
        ) : (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  showUserDetail(record);
                }}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                icon={<EditOutlined />}
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(record);
                }}
              />
            </Tooltip>
            <Popconfirm
              title={<span className="font-semibold">Xác nhận xóa</span>}
              description={
                <div className="max-w-xs">
                  Bạn có chắc chắn muốn xóa tài khoản{" "}
                  <strong>{record.email}</strong>?
                  <br />
                  <span className="text-red-500">
                    Hành động này không thể hoàn tác!
                  </span>
                </div>
              }
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Xóa">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
    },
  ];

  return (
    <div>
      {contextHolder}

      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Tổng người dùng</span>}
            value={stats.total}
            prefix={<TeamOutlined className="text-blue-500" />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Đang hoạt động</span>}
            value={stats.active}
            prefix={<CheckCircleOutlined className="text-green-500" />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Đã khóa</span>}
            value={stats.inactive}
            prefix={<LockOutlined className="text-red-500" />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Quản trị viên</span>}
            value={stats.admins}
            prefix={<CrownOutlined className="text-purple-500" />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </div>

      {/* Main Content Card */}
      <Card
        className="shadow-xl rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Quản lý người dùng
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý và giám sát tất cả tài khoản trong hệ thống
            </p>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchUsers}
              loading={loading}
              className="hover:shadow-md transition-shadow"
            >
              Tải lại
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-lg transition-shadow"
            >
              Thêm người dùng
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-gray-50" size="small">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="🔍 Tìm kiếm theo tên hoặc email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              size="large"
              className="flex-1"
            />
            <Select
              placeholder="Vai trò"
              value={filterRole}
              onChange={setFilterRole}
              size="large"
              style={{ width: 180 }}
            >
              <Select.Option value="all">
                <TeamOutlined /> Tất cả vai trò
              </Select.Option>
              <Select.Option value="1">
                <CrownOutlined /> Admin
              </Select.Option>
              <Select.Option value="2">
                <UserOutlined /> Recruiter
              </Select.Option>
              <Select.Option value="3">
                <UserOutlined /> Candidate
              </Select.Option>
            </Select>
            <Select
              placeholder="Trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              size="large"
              style={{ width: 180 }}
            >
              <Select.Option value="all">
                <SafetyOutlined /> Tất cả
              </Select.Option>
              <Select.Option value="active">
                <CheckCircleOutlined /> Hoạt động
              </Select.Option>
              <Select.Option value="inactive">
                <CloseCircleOutlined /> Đã khóa
              </Select.Option>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          bordered
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onRow={(record) => ({
            onDoubleClick: () => showUserDetail(record),
            className: "cursor-pointer hover:bg-blue-50 transition-colors",
          })}
          className="shadow-sm"
        />
      </Card>

      {/* User Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <EyeOutlined className="text-blue-500" />
            Chi tiết người dùng
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
        centered
      >
        {selectedUser && (
          <div className="py-4">
            <Divider className="mt-0" />
            
            {/* Header */}
            <Card size="small" className="bg-gradient-to-r from-blue-50 to-indigo-50 mb-4">
              <div className="flex items-center gap-4">
                <Avatar
                  size={80}
                  style={{
                    backgroundColor: getRoleColor(selectedUser.role_id),
                    fontSize: "28px",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(selectedUser.first_name, selectedUser.last_name)}
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {`${selectedUser.first_name || ""} ${
                      selectedUser.last_name || ""
                    }`.trim() || "Chưa có tên"}
                  </h2>
                  <Space size={8}>
                    <Tag
                      color={
                        selectedUser.role_id === 1
                          ? "blue"
                          : selectedUser.role_id === 2
                          ? "purple"
                          : "green"
                      }
                      icon={
                        selectedUser.role_id === 1 ? (
                          <CrownOutlined />
                        ) : (
                          <UserOutlined />
                        )
                      }
                      className="text-sm py-1 px-3"
                    >
                      {getRoleName(selectedUser.role_id)}
                    </Tag>
                    {selectedUser.status === "active" ? (
                      <Badge status="success" text="Hoạt động" />
                    ) : (
                      <Badge status="error" text="Đã khóa" />
                    )}
                    {currentUser?.id === selectedUser.id && (
                      <Tag color="cyan">Tài khoản của bạn</Tag>
                    )}
                  </Space>
                </div>
              </div>
            </Card>

            {/* Details */}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    ID người dùng
                  </span>
                }
              >
                <Badge
                  count={selectedUser.id}
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                />
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <MailOutlined className="mr-2" />
                    Email
                  </span>
                }
              >
                <a
                  href={`mailto:${selectedUser.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {selectedUser.email}
                </a>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Họ
                  </span>
                }
              >
                {selectedUser.last_name || (
                  <span className="text-gray-400 italic">Chưa cập nhật</span>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <UserOutlined className="mr-2" />
                    Tên
                  </span>
                }
              >
                {selectedUser.first_name || (
                  <span className="text-gray-400 italic">Chưa cập nhật</span>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CrownOutlined className="mr-2" />
                    Vai trò
                  </span>
                }
              >
                <Tag
                  color={
                    selectedUser.role_id === 1
                      ? "blue"
                      : selectedUser.role_id === 2
                      ? "purple"
                      : "green"
                  }
                  className="text-sm py-1 px-3"
                >
                  {getRoleName(selectedUser.role_id)}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CheckCircleOutlined className="mr-2" />
                    Trạng thái
                  </span>
                }
              >
                {selectedUser.status === "active" ? (
                  <Tag color="success" icon={<CheckCircleOutlined />} className="py-1 px-3">
                    Đang hoạt động
                  </Tag>
                ) : (
                  <Tag color="error" icon={<CloseCircleOutlined />} className="py-1 px-3">
                    Đã khóa
                  </Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <CalendarOutlined className="mr-2" />
                    Ngày tạo
                  </span>
                }
              >
                <span className="text-gray-700">
                  {formatDate(selectedUser.created_at)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {/* Actions */}
            {currentUser?.id !== selectedUser.id && (
              <>
                <Divider />
                <div className="flex justify-end gap-3">
                  <Button onClick={handleModalClose}>Đóng</Button>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      handleModalClose();
                      openEditModal(selectedUser);
                    }}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Chỉnh sửa
                  </Button>
                  <Popconfirm
                    title={<span className="font-semibold">Xác nhận xóa</span>}
                    description={
                      <div className="max-w-xs">
                        Bạn có chắc chắn muốn xóa tài khoản{" "}
                        <strong>{selectedUser.email}</strong>?
                        <br />
                        <span className="text-red-500">
                          Hành động này không thể hoàn tác!
                        </span>
                      </div>
                    }
                    onConfirm={() => {
                      handleDelete(selectedUser.id);
                      handleModalClose();
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                    okButtonProps={{ danger: true }}
                  >
                    <Button type="primary" danger icon={<DeleteOutlined />}>
                      Xóa tài khoản
                    </Button>
                  </Popconfirm>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Create / Update User Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            {editingUser ? <EditOutlined className="text-blue-500" /> : <UserAddOutlined className="text-green-500" />}
            {editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </div>
        }
        open={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onOk={handleFormSubmit}
        okText={editingUser ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        centered
        width={600}
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-600",
        }}
      >
        <Divider className="my-4" />
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role_id: 2, status: "active" }}
        >
          <Form.Item
            label={<span className="font-semibold"><MailOutlined /> Email</span>}
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input 
              placeholder="example@gmail.com" 
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label={<span className="font-semibold"><LockOutlined /> Mật khẩu</span>}
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password 
                placeholder="••••••" 
                size="large"
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              label={<span className="font-semibold"><UserOutlined /> Họ</span>}
              name="last_name"
            >
              <Input placeholder="Nguyễn" size="large" />
            </Form.Item>

            <Form.Item 
              label={<span className="font-semibold"><UserOutlined /> Tên</span>}
              name="first_name"
            >
              <Input placeholder="Văn A" size="large" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-semibold"><CrownOutlined /> Vai trò</span>}
            name="role_id"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select size="large">
              <Select.Option value={1}>
                <CrownOutlined /> Admin
              </Select.Option>
              <Select.Option value={2}>
                <UserOutlined /> Recruiter
              </Select.Option>
              <Select.Option value={3}>
                <UserOutlined /> Candidate
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label={<span className="font-semibold"><CheckCircleOutlined /> Trạng thái</span>}
            name="status"
          >
            <Select size="large">
              <Select.Option value="active">
                <CheckCircleOutlined /> Hoạt động
              </Select.Option>
              <Select.Option value="inactive">
                <CloseCircleOutlined /> Đã khóa
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}