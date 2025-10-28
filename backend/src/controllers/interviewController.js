// src/controllers/interviewController.js
import { InterviewModel } from "../models/interviewModel.js";

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await InterviewModel.getAll();
    res.status(200).json(interviews);
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
