import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Tạo connection pool để quản lý nhiều kết nối cùng lúc
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
