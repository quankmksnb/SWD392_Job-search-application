// src/controllers/interviewController.js
import pool from "../../config/db.js";
import { InterviewModel } from "../models/interviewModel.js";

export const getAllInterviews = async (req, res) => {
  try {
    const recruiterId = req.query.recruiter_id;
    const { job_id, interview_type, status, start_date, end_date } = req.query;

    let whereClause = `WHERE cr.recruiter_id = ?`;
    const params = [recruiterId];

    if (job_id) {
      whereClause += ` AND j.id = ?`;
      params.push(job_id);
    }

    if (interview_type) {
      whereClause += ` AND i.interview_type = ?`;
      params.push(interview_type);
    }

    if (status) {
      whereClause += ` AND i.status = ?`;
      params.push(status);
    }

    if (start_date && end_date) {
      whereClause += ` AND i.scheduled_date BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    const [rows] = await pool.query(
      `
      SELECT 
        i.*, 
        j.title AS job_title, 
        j.id AS job_id,
        u.first_name AS interviewer_first_name, 
        u.last_name AS interviewer_last_name
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN job_postings j ON a.job_posting_id = j.id
      JOIN companies c ON j.company_id = c.id
      JOIN company_recruiters cr ON c.id = cr.company_id
      JOIN users u ON i.interviewer_id = u.id
      ${whereClause}
      ORDER BY i.scheduled_date DESC
      `,
      params
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch interviews" });
  }
};


export const getInterviewById = async (req, res) => {
  try {
    const interview = await InterviewModel.getById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch interview" });
  }
};

export const createInterview = async (req, res) => {
  try {
    const insertId = await InterviewModel.create(req.body);
    res.status(201).json({ message: "Interview created successfully", id: insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create interview" });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const result = await InterviewModel.update(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Interview not found" });
    res.status(200).json({ message: "Interview updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update interview" });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const result = await InterviewModel.delete(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Interview not found" });
    res.status(200).json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete interview" });
  }
};
