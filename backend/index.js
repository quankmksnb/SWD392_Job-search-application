import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import { getJobList, createJob } from "./controllers/jobController.js";
import router from "./routes/routes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

// test database connection
const checkDBConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected!");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
};
checkDBConnection();

// test quẻy
app.get("/test-users", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users LIMIT 10");
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Query failed" });
  }
});


app.use('/job', router);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`📝 Available Job API Routes:`);
  console.log(`   GET  http://localhost:${PORT}/job/job-list - Get all jobs`);
  console.log(`   POST http://localhost:${PORT}/job/create-job - Create new job`);
  console.log(`   GET http://localhost:${PORT}/job/category-name - Cate`);
  console.log(`   GET http://localhost:${PORT}/job/company-name - Cate`);
  console.log(`   PUT  http://localhost:${PORT}/job/update-job/:id`);

  // Test thêm
  console.log("✅ Server started successfully!");
});
