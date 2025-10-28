"use client";
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
  Input,
  Modal,
  Divider,
  Form,
  Statistic,
  Tooltip,
  Descriptions,
  Badge,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  ReloadOutlined,
  EyeOutlined,
  AppstoreOutlined,
  TagsOutlined,
  CalendarOutlined,
  IdcardOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/CategoryService";

export default function CategoryManagementPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [msg, contextHolder] = message.useMessage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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
        fetchCategories();
      } catch (err) {
        console.error("Error parsing user:", err);
        router.replace("/login");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const res = await listCategories({ page, limit, search });
      setCategories(res.data.data);
      setPagination({
        current: res.data.pagination.page,
        pageSize: res.data.pagination.limit,
        total: res.data.pagination.total,
      });
    } catch (err) {
      console.error(err);
      msg.error("Lỗi khi tải danh sách categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchCategories(1, pagination.pageSize, searchText);
  };

  const handleTableChange = (newPagination) => {
    fetchCategories(newPagination.current, newPagination.pageSize, searchText);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      msg.success("Đã xóa category thành công");
      fetchCategories(pagination.current, pagination.pageSize, searchText);
    } catch (err) {
      console.error(err);
      msg.error(err.response?.data?.message || "Không thể xóa category");
    }
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

  const showCategoryDetail = (record) => {
    setSelectedCategory(record);
    setIsModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsFormVisible(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
    });
    setIsFormVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        // update
        await updateCategory(editingCategory.id, values);
        msg.success("Cập nhật category thành công!");
      } else {
        // create
        await createCategory(values);
        msg.success("Thêm category thành công!");
      }

      setIsFormVisible(false);
      fetchCategories(pagination.current, pagination.pageSize, searchText);
    } catch (err) {
      console.error(err);
      msg.error(err.response?.data?.message || "Không thể lưu thông tin category.");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCategory(null);
  };

  const columns = [
    {
      title: (
        <span className="flex items-center gap-2">
          <IdcardOutlined /> ID
        </span>
      ),
      dataIndex: "id",
      key: "id",
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
          <TagsOutlined /> Tên Category
        </span>
      ),
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <div className="font-semibold text-gray-800 flex items-center gap-2">
          <AppstoreOutlined className="text-blue-500" />
          {name}
        </div>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <LinkOutlined /> Slug
        </span>
      ),
      dataIndex: "slug",
      key: "slug",
      render: (slug) => (
        <Tag color="blue" className="font-mono">
          {slug}
        </Tag>
      ),
    },
    {
      title: (
        <span className="flex items-center gap-2">
          <CalendarOutlined /> Ngày tạo
        </span>
      ),
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (date) => (
        <span className="text-gray-600">{formatDate(date)}</span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                showCategoryDetail(record);
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
                Bạn có chắc chắn muốn xóa category{" "}
                <strong>{record.name}</strong>?
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
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      {/* Header Stats Card */}
      <div className="mb-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Statistic
            title={<span className="text-gray-600">Tổng số Categories</span>}
            value={pagination.total}
            prefix={<AppstoreOutlined className="text-blue-500" />}
            valueStyle={{ color: "#1890ff" }}
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
              Quản lý Categories
            </h2>
            <p className="text-gray-500 text-sm">
              Quản lý danh mục công việc trong hệ thống
            </p>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchCategories(pagination.current, pagination.pageSize, searchText)}
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
              Thêm Category
            </Button>
          </Space>
        </div>

        {/* Search */}
        <Card className="mb-6 bg-gray-50" size="small">
          <div className="flex gap-3">
            <Input
              placeholder="🔍 Tìm kiếm theo tên hoặc slug..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              size="large"
              className="flex-1"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              size="large"
            >
              Tìm kiếm
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          rowKey="id"
          bordered
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} categories`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={handleTableChange}
          onRow={(record) => ({
            onDoubleClick: () => showCategoryDetail(record),
            className: "cursor-pointer hover:bg-blue-50 transition-colors",
          })}
          className="shadow-sm"
        />
      </Card>

      {/* Category Detail Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <EyeOutlined className="text-blue-500" />
            Chi tiết Category
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        centered
      >
        {selectedCategory && (
          <div className="py-4">
            <Divider className="mt-0" />

            {/* Header */}
            <Card
              size="small"
              className="bg-gradient-to-r from-blue-50 to-indigo-50 mb-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full"
                  style={{ backgroundColor: "#1890ff" }}
                >
                  <AppstoreOutlined
                    className="text-white"
                    style={{ fontSize: "28px" }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedCategory.name}
                  </h2>
                  <Tag color="blue" className="font-mono">
                    {selectedCategory.slug}
                  </Tag>
                </div>
              </div>
            </Card>

            {/* Details */}
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <IdcardOutlined className="mr-2" />
                    ID
                  </span>
                }
              >
                <Badge
                  count={selectedCategory.id}
                  style={{ backgroundColor: "#52c41a" }}
                  overflowCount={999}
                />
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <TagsOutlined className="mr-2" />
                    Tên Category
                  </span>
                }
              >
                {selectedCategory.name}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="font-semibold">
                    <LinkOutlined className="mr-2" />
                    Slug
                  </span>
                }
              >
                <Tag color="blue" className="font-mono">
                  {selectedCategory.slug}
                </Tag>
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
                  {formatDate(selectedCategory.created_at)}
                </span>
              </Descriptions.Item>
            </Descriptions>

            {/* Actions */}
            <Divider />
            <div className="flex justify-end gap-3">
              <Button onClick={handleModalClose}>Đóng</Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  handleModalClose();
                  openEditModal(selectedCategory);
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Chỉnh sửa
              </Button>
              <Popconfirm
                title={<span className="font-semibold">Xác nhận xóa</span>}
                description={
                  <div className="max-w-xs">
                    Bạn có chắc chắn muốn xóa category{" "}
                    <strong>{selectedCategory.name}</strong>?
                    <br />
                    <span className="text-red-500">
                      Hành động này không thể hoàn tác!
                    </span>
                  </div>
                }
                onConfirm={() => {
                  handleDelete(selectedCategory.id);
                  handleModalClose();
                }}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Xóa Category
                </Button>
              </Popconfirm>
            </div>
          </div>
        )}
      </Modal>

      {/* Create / Update Category Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            {editingCategory ? (
              <EditOutlined className="text-blue-500" />
            ) : (
              <PlusOutlined className="text-green-500" />
            )}
            {editingCategory ? "Cập nhật Category" : "Thêm Category mới"}
          </div>
        }
        open={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        onOk={handleFormSubmit}
        okText={editingCategory ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        centered
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
                <TagsOutlined /> Tên Category
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên category" },
              { max: 255, message: "Tên category không được quá 255 ký tự" },
            ]}
          >
            <Input
              placeholder="Ví dụ: Công nghệ thông tin"
              size="large"
              prefix={<TagsOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold">
                <LinkOutlined /> Slug
              </span>
            }
            name="slug"
            extra="Để trống để tự động tạo từ tên category"
            rules={[
              { max: 255, message: "Slug không được quá 255 ký tự" },
              {
                pattern: /^[a-z0-9-]*$/,
                message:
                  "Slug chỉ chứa chữ thường, số và dấu gạch ngang",
              },
            ]}
          >
            <Input
              placeholder="cong-nghe-thong-tin"
              size="large"
              prefix={<LinkOutlined className="text-gray-400" />}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
