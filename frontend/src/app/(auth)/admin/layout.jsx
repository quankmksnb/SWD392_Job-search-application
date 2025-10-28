"use client";

import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const { Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // <- reactively theo URL
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
      } catch (err) {
        console.error("Error parsing user:", err);
        router.replace("/login");
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentUser) return null;

  const menuItems = [
    {
      key: "role-manager",
      icon: <SettingOutlined />,
      label: "Quản lý phân quyền",
      onClick: () => router.push("/admin/role-manager"),
    },
    {
      key: "user-manager",
      icon: <UserOutlined />,
      label: "Quản lý tài khoản",
      onClick: () => router.push("/admin/user-manager"),
    },
    {
      key: "category-manager",
      icon: <SettingOutlined />,
      label: "Quản lý Categories",
      onClick: () => router.push("/admin/category-manager"),
    },
  ];

  // Map pathname thành key menu
  const pathToKey = {
    "/admin/role-manager": "role-manager",
    "/admin/user-manager": "user-manager",
    "/admin/category-manager": "category-manager",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
        style={{ boxShadow: "2px 0 6px rgba(0,0,0,0.1)" }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 16,
          }}
        >
          {collapsed ? "AD" : "Admin Dashboard"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[pathToKey[pathname] || "user-manager"]}
          style={{ background: "#001529" }}
        />
      </Sider>

      <Layout>
        <Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 10,
              borderRadius: 8,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
