"use client";
import React, { useEffect, useState } from "react";
import '@ant-design/compatible';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  App,
  Popconfirm,
  Tag,
  Select,
  Card,
  Statistic,
  Badge,
  Divider,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  PlusOutlined,
  SafetyOutlined,
  KeyOutlined,
  EyeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  createRole,
  listRoles,
  updateRole,
  deleteRole,
} from "@/services/RoleService";
import { listPermissions } from "@/services/PermissionService";

function RoleManagementContent() {
  const { message } = App.useApp();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Lấy danh sách vai trò
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await listRoles();
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      message.error({
        content: "Không thể tải danh sách vai trò ❌",
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách quyền
  const fetchPermissions = async () => {
    try {
      const res = await listPermissions();
      setPermissions(res.data);
    } catch (err) {
      console.error(err);
      message.error({
        content: "Không thể tải danh sách quyền ❌",
        duration: 3,
      });
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Thêm / sửa vai trò
  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setEditingRole(record);
    form.setFieldsValue({
      name: record.name,
      permissions: record.permissions?.map((p) => p.id),
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingRole) {
        await updateRole(editingRole.id, values);
        message.success({
          content: "Cập nhật vai trò thành công 🎉",
          duration: 3,
        });
      } else {
        await createRole(values);
        message.success({
          content: "Thêm vai trò thành công 🎉",
          duration: 3,
        });
      }

      setOpenModal(false);
      fetchRoles();
    } catch (err) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Có lỗi xảy ra khi lưu vai trò ❌",
        duration: 3,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      message.success({
        content: "Đã xóa vai trò thành công 🗑️",
        duration: 3,
      });
      fetchRoles();
    } catch (err) {
      console.error(err);
      message.error({
        content: err.response?.data?.message || "Không thể xóa vai trò ❌",
        duration: 3,
      });
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRole(record);
    setOpenDetailModal(true);
  };

  // Nhóm quyền theo module
  const groupPermissionsByModule = (perms) => {
    const grouped = {};
    perms?.forEach((p) => {
      const module = p.module || "Khác";
      if (!grouped[module]) grouped[module] = [];
      grouped[module].push(p);
    });
    return grouped;
  };

  const columns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <SafetyOutlined /> ID
        </span>
      ),
      dataIndex: "id",
      width: 80,
      align: "center",
      render: (id) => (
        <Badge
          count={id}
          style={{ backgroundColor: "#52c41a" }}
          overflowCount={999}
        />
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <TeamOutlined /> Tên vai trò
        </span>
      ),
      dataIndex: "name",
      render: (name) => (
        <span className="font-semibold text-gray-800">{name}</span>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <KeyOutlined /> Quyền
        </span>
      ),
      render: (_, record) => {
        const permCount = record.permissions?.length || 0;
        return (
          <div className="flex flex-wrap gap-1">
            {record.permissions?.slice(0, 3).map((p) => (
              <Tag key={p.id} color="blue" className="m-0">
                {p.name}
              </Tag>
            ))}
            {permCount > 3 && (
              <Tooltip
                title={record.permissions
                  .slice(3)
                  .map((p) => p.name)
                  .join(", ")}
              >
                <Tag color="default" className="m-0 cursor-pointer">
                  +{permCount - 3} quyền khác
                </Tag>
              </Tooltip>
            )}
            {permCount === 0 && (
              <span className="text-gray-400 italic text-sm">Chưa có quyền</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              type="primary"
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc muốn xóa vai trò này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                icon={<DeleteOutlined />}
                danger
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
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Tổng số vai trò</span>}
            value={roles.length}
            prefix={<TeamOutlined className="text-blue-500" />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Tổng số quyền</span>}
            value={permissions.length}
            prefix={<KeyOutlined className="text-green-500" />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Vai trò có quyền</span>}
            value={roles.filter((r) => r.permissions?.length > 0).length}
            suffix={`/ ${roles.length}`}
            prefix={<SafetyOutlined className="text-purple-500" />}
            valueStyle={{ color: "#722ed1" }}
          />
        </Card>
      </div>

      {/* Main Content */}
      <Card
        className="shadow-xl rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Quản lý vai trò
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý vai trò và phân quyền trong hệ thống
            </p>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchRoles}
              loading={loading}
              className="hover:shadow-md transition-shadow"
            >
              Tải lại
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:shadow-lg transition-shadow"
            >
              Thêm vai trò
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          dataSource={roles}
          columns={columns}
          loading={loading}
          bordered
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Tổng ${total} vai trò`,
            showSizeChanger: true,
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleViewDetail(record),
            className: "cursor-pointer hover:bg-blue-50 transition-colors",
          })}
          className="shadow-sm"
        />
      </Card>

      {/* Modal thêm/sửa */}
      <Modal
        open={openModal}
        title={
          <div className="flex items-center gap-2 text-lg">
            <SafetyOutlined className="text-blue-500" />
            {editingRole ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
          </div>
        }
        okText="Lưu"
        cancelText="Hủy"
        onCancel={() => setOpenModal(false)}
        onOk={handleSubmit}
        width={600}
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-600",
        }}
      >
        <Divider className="my-4" />
        <Form form={form} layout="vertical">
          <Form.Item
            label={
              <span className="font-semibold">
                <TeamOutlined /> Tên vai trò
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên vai trò" }]}
          >
            <Input
              placeholder="VD: Admin, User, Manager..."
              size="large"
              prefix={<TeamOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <KeyOutlined /> Danh sách quyền
              </span>
            }
            name="permissions"
          >
            <Select
              mode="multiple"
              placeholder="Chọn quyền cho vai trò..."
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={permissions.map((p) => ({
                label: `${p.module ? `[${p.module}] ` : ""}${p.name}`,
                value: p.id,
              }))}
              maxTagCount="responsive"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chi tiết */}
      <Modal
        open={openDetailModal}
        title={
          <div className="flex items-center gap-2 text-lg">
            <EyeOutlined className="text-blue-500" />
            Chi tiết vai trò
          </div>
        }
        footer={
          <Button
            type="primary"
            onClick={() => setOpenDetailModal(false)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Đóng
          </Button>
        }
        onCancel={() => setOpenDetailModal(false)}
        width={700}
      >
        {selectedRole ? (
          <div className="space-y-4 mt-4">
            <Card size="small" className="bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">ID vai trò</p>
                  <Badge
                    count={selectedRole.id}
                    style={{ backgroundColor: "#52c41a" }}
                    overflowCount={999}
                  />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Tên vai trò</p>
                  <p className="font-semibold text-lg">{selectedRole.name}</p>
                </div>
              </div>
            </Card>

            <Divider className="my-4">Danh sách quyền</Divider>

            {selectedRole.permissions?.length ? (
              <div className="space-y-4">
                {Object.entries(groupPermissionsByModule(selectedRole.permissions)).map(
                  ([module, perms]) => (
                    <Card
                      key={module}
                      size="small"
                      title={
                        <span className="flex items-center gap-2">
                          <KeyOutlined className="text-blue-500" />
                          {module}
                        </span>
                      }
                      className="shadow-sm"
                    >
                      <div className="flex flex-wrap gap-2">
                        {perms.map((p) => (
                          <Tag key={p.id} color="blue" className="text-sm py-1 px-3">
                            {p.name}
                          </Tag>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Tổng: {perms.length} quyền
                      </div>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <Card className="text-center bg-gray-50">
                <KeyOutlined className="text-4xl text-gray-300 mb-2" />
                <p className="text-gray-400 italic">Vai trò chưa có quyền nào</p>
              </Card>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">Không có dữ liệu</p>
        )}
      </Modal>
    </div>
  );
}

// Wrap component với App provider
export default function RoleManagement() {
  return (
    <App>
      <RoleManagementContent />
    </App>
  );
}