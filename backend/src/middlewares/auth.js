// src/middlewares/auth.js
import { verify } from "../services/jwtService.js";

export const protect = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });
    const token = auth.split(" ")[1];
    const payload = verify(token);
    req.user = payload; // payload should include id and role_id
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// assuming role_id = 1 => admin. Adjust if your roles differ.
export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role_id !== 1) return res.status(403).json({ message: "Require admin role" });
  next();
};
