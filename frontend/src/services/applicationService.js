// fontend/src/services/applicationService.js
import axios from "axios";

const API_URL = "http://localhost:9999/api";

export const getApplications = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token;
  console.log("token", token)
  const res = await axios.get(`${API_URL}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.data;
};

export const createApplication = async (data) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token;

  const res = await axios.post(`${API_URL}/applications`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateApplicationStatus = async (id, status) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token;

  const res = await axios.put(
    `${API_URL}/applications/${id}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const deleteApplication = async (id) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = storedUser?.token;

  const res = await axios.delete(`${API_URL}/applications/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
