"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Dropdown, Menu } from "antd";
import { usePathname } from "next/navigation";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  CrownOutlined,
} from "@ant-design/icons";
// import { logout } from "@/services/AuthService";

// import { logout } from "./src/services/AuthService.js";
import { logout } from "@/services/AuthService";
export default function Header() {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // 🔥 Kiểm tra xem có phải trang admin không
  const isAdminPage = pathname?.startsWith("/admin");
  const isHR = user?.role_id === 2


  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          setUser(null);
          return;
        }

        const data = JSON.parse(stored);
        const userData = data.user || data;

        setUser(userData);
      } catch (err) {
        console.error("Error parsing user:", err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Call API logout
      logout();

      // Xóa thông tin khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Cập nhật state
      setUser(null);

      // Redirect về trang login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const accountMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: <Link href="/user/info">Thông tin cá nhân</Link>,
      },
      ...(user?.role_id === 1
        ? [
          {
            key: "divider-1",
            type: "divider",
          },
          {
            key: "admin-user",
            icon: <CrownOutlined />,
            label: <Link href="/admin/user-manager">Quản lý người dùng</Link>,
            style: { color: "#1890ff" },
          },
          {
            key: "admin-role",
            icon: <CrownOutlined />,
            label: <Link href="/admin/role-manager">Quản lý phân quyền</Link>,
            style: { color: "#1890ff" },
          },
        ]
        : []),
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
        onClick: handleLogout,
        danger: true,
      },
    ],
  };

  return (
    <header>
      {/* --- NAV TOP --- */}
      <nav className="border-b border-[#e5e5e5] flex justify-center px-[24px]">
        <div className="container flex justify-between items-center h-[32px]">
          <ul className="flex gap-[8px] items-center">
            <li key="greeting" className="nav-link">
              {user ? (
                <>
                  Xin chào, <b>{user.first_name || user.email}</b>
                </>
              ) : (
                <>
                  Xin chào (
                  <Link
                    href="/login"
                    className="text-[#0968f6] font-medium underline"
                  >
                    Đăng nhập
                  </Link>
                  /
                  <Link
                    href="/register"
                    className="text-[#0968f6] font-medium underline"
                  >
                    Đăng ký
                  </Link>
                  )
                </>
              )}
            </li>
            <li key="job">
              <Link className="nav-link" href={"/"}>
                Việc làm hấp dẫn
              </Link>
            </li>
            <li key="company">
              <Link className="nav-link" href={"/"}>
                Công ty nổi bật
              </Link>
            </li>
            <li key="cv">
              <Link className="nav-link" href={"/"}>
                Công cụ CV
              </Link>
            </li>
            <li key="support">
              <Link className="nav-link" href={"/"}>
                Hỗ trợ & Liên hệ
              </Link>
            </li>
          </ul>

          <ul className="flex items-center gap-[12px]">
            <li key="area">
              <Link className="nav-link" href={"/"}>
                Khu vực
              </Link>
            </li>
            {isHR && (
              <li key="post">
                <Link className="nav-link" href={"/job/job-list"}>
                  Đăng tuyển
                </Link>
              </li>
            )}

            <li key="saved">
              <Link className="nav-link flex items-center gap-[4px]" href={"/"}>
                Việc đã lưu
                <Image
                  src={"/icons/chevron_down.svg"}
                  width={12}
                  height={12}
                  alt=""
                />
              </Link>
            </li>
            <li key="account">
              {user ? (
                <Dropdown
                  menu={accountMenu}
                  trigger={["hover", "click"]}
                  placement="bottomRight"
                >
                  <span className="nav-link flex items-center gap-[4px] cursor-pointer hover:text-[#0968f6] transition-colors">
                    {user.first_name || "Tài khoản"}
                    {user.role_id === 1 && (
                      <CrownOutlined
                        style={{ fontSize: 12, color: "#1890ff" }}
                      />
                    )}
                    <DownOutlined style={{ fontSize: 10 }} />
                  </span>
                </Dropdown>
              ) : (
                <Link
                  className="nav-link flex items-center gap-[4px]"
                  href={"/login"}
                >
                  Tài khoản
                  <Image
                    src={"/icons/chevron_down.svg"}
                    width={12}
                    height={12}
                    alt=""
                  />
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* --- SEARCH AREA --- 🔥 Ẩn nếu đang ở trang admin */}
      {!isAdminPage && (
        <div className="border-b border-[#e5e5e5] flex justify-center py-[20px] px-[24px]">
          <div className="container flex items-center gap-[20px]">
            <div className="flex items-center gap-[16px]">
              <Link href={"/"}>
                <Image
                  src={"/images/EBay_logo.svg.png"}
                  alt="Ebay logo"
                  width={117}
                  height={48}
                />
              </Link>
              <div className="flex cursor-pointer">
                <span className="text-[#707070] text-[12px]/[14px] font-semibold w-[70px]">
                  Danh mục ngành nghề
                </span>
                <Image
                  src={"/icons/chevron_down.svg"}
                  width={12}
                  height={12}
                  alt=""
                />
              </div>
            </div>

            <form className="flex w-full items-center gap-[16px]">
              <div className="w-full flex items-center border-[2px] border-[#191919] rounded-full h-[44px] overflow-hidden">
                <div className="pl-4">
                  <Image
                    src={"/icons/search.svg"}
                    width={16}
                    height={16}
                    alt=""
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tìm kiếm vị trí, công ty, kỹ năng..."
                  className="flex-1 px-3 outline-none text-gray-700 placeholder-gray-400"
                />

                <div className="border-l border-[#e5e5e5] h-[28px]"></div>

                <input
                  type="text"
                  placeholder="Địa điểm"
                  className="w-[200px] px-3 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <div className="form_btn flex items-center gap-[8px]">
                <Button>Tìm việc</Button>
                <Link
                  href={"/"}
                  className="text-[#707070] text-[11px] font-semibold whitespace-nowrap"
                >
                  Tìm nâng cao
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
