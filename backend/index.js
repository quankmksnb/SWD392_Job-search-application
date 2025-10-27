// index.js
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import pool from "./config/db.js"; // ✅ import default, không có {}

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // ✅ kiểm tra kết nối (không dùng .promise())
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected");
    app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
}

start();
