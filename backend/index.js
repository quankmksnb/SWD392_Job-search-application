// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js";
import permissionRoutes from "./src/routes/permissionRoutes.js";
import jobRouter from "./src/routes/jobRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";
import recruiterRoutes from "./src/routes/recruiterRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/job", jobRouter);
app.use("/api/interviews", interviewRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/applications", applicationRoutes);


// test
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

app.listen(PORT, () => {
  console.log("✅ Server started successfully!");
  console.log(`🚀 Backend API running on: http://localhost:${PORT}`);
});
