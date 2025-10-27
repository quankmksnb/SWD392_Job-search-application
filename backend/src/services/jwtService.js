// src/services/jwtService.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET || "change_me";
const EXPIRES = process.env.JWT_EXPIRES || "7d";

export const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
export const verify = (token) => jwt.verify(token, SECRET);
