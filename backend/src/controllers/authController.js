import bcrypt from "bcryptjs";
import crypto from "crypto";
import pool from "../../config/db.js";
import { sign } from "../services/jwtService.js";
import { sendMail } from "../services/mailService.js";
import { UserModel } from "../models/userModel.js";

const BCRYPT_SALT = 10;
const DEFAULT_ROLE_ID = 3; // user

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, isRecruiter } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email và mật khẩu là bắt buộc." });

    const exist = await UserModel.findByEmail(email);
    if (exist) return res.status(409).json({ message: "Email đã tồn tại." });

    const hash = await bcrypt.hash(password, BCRYPT_SALT);

    const roleId = isRecruiter ? 2 : DEFAULT_ROLE_ID;

    const user = await UserModel.create({
      email,
      password_hash: hash,
      first_name,
      last_name,
      role_id: roleId,
      status: "pending",
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    const verifyLink = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/register/verify-email?token=${token}`;

    const accountType = isRecruiter ? "nhà tuyển dụng" : "ứng viên";

    sendMail({
      to: email,
      subject: "Xác thực email",
      html: `<p>Xin chào ${first_name || email},</p>
             <p>Cảm ơn bạn đã đăng ký tài khoản ${accountType}.</p>
             <p>Nhấn <a href="${verifyLink}">vào đây</a> để xác thực email. Link có hiệu lực trong 24h.</p>`,
    }).catch(console.error);

    res.status(201).json({
      message: "Đăng ký thành công, vui lòng kiểm tra email để xác thực.",
      user: {
        id: user.id,
        email: user.email,
        role_id: roleId,
        isRecruiter: isRecruiter || false,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ message: "Thiếu token." });

    const [rows] = await pool.query(
      "SELECT * FROM password_resets WHERE token = ?",
      [token]
    );
    if (!rows.length)
      return res.status(400).json({ message: "Token không hợp lệ." });

    const record = rows[0];
    if (new Date(record.expires_at) < new Date())
      return res.status(400).json({ message: "Token đã hết hạn." });

    await pool.query("UPDATE users SET status = 'active' WHERE id = ?", [
      record.user_id,
    ]);
    await pool.query("DELETE FROM password_resets WHERE id = ?", [record.id]);

    res.json({ message: "Xác thực email thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu." });

    const user = await UserModel.findByEmail(email);
    if (!user)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu." });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu." });

    if (user.status !== "active")
      return res
        .status(403)
        .json({ message: "Vui lòng xác thực email trước khi đăng nhập." });

    const token = sign({
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email." });

    const user = await UserModel.findByEmail(email);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng." });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expiresAt]
    );

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login/forgot-password?token=${token}`;

    await sendMail({
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Nhấn <a href="${resetLink}">vào đây</a> để đặt lại mật khẩu (hiệu lực 15 phút).</p>`,
    });

    res.json({ message: "Đã gửi email đặt lại mật khẩu." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res
        .status(400)
        .json({ message: "Thiếu token hoặc mật khẩu mới." });

    const [rows] = await pool.query(
      "SELECT * FROM password_resets WHERE token = ?",
      [token]
    );
    if (!rows.length)
      return res.status(400).json({ message: "Token không hợp lệ." });

    const rec = rows[0];
    if (new Date(rec.expires_at) < new Date())
      return res.status(400).json({ message: "Token đã hết hạn." });

    const hash = await bcrypt.hash(newPassword, BCRYPT_SALT);
    await pool.query(
      "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
      [hash, rec.user_id]
    );
    await pool.query("DELETE FROM password_resets WHERE id = ?", [rec.id]);

    res.json({ message: "Đặt lại mật khẩu thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới." });

    const user = await UserModel.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng." });

    const ok = await bcrypt.compare(oldPassword, user.password_hash);
    if (!ok)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng." });

    const hash = await bcrypt.hash(newPassword, BCRYPT_SALT);
    await pool.query(
      "UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?",
      [hash, userId]
    );

    res.json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

export const logout = async (req, res) => {
  try {
    // Lấy thông tin user từ token (đã được xác thực bởi middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Người dùng chưa đăng nhập." });
    }

    res.json({
      message: "Đăng xuất thành công.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
