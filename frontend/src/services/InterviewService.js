import api from "./api";

const InterviewService = {
  getAll: () => api.get("/interviews").then(res => res.data),
  getById: (id) => api.get(`/interviews/${id}`).then(res => res.data),
  create: (data) => api.post("/interviews", data).then(res => res.data),
  update: (id, data) => api.put(`/interviews/${id}`, data).then(res => res.data),
  remove: (id) => api.delete(`/interviews/${id}`).then(res => res.data),
};

export default InterviewService;
