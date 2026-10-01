import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { createAuditLog, requestIp } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const result = await query(
    `SELECT id, name, email, password_hash, role, status
     FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email.trim()]
  );

  const user = result.rows[0];

  if (!user || user.status !== "Active") {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = signToken(user);

  await createAuditLog({
    userId: user.id,
    userName: user.name,
    action: "LOGIN",
    entityType: "auth",
    details: "Successful login",
    ipAddress: requestIp(req)
  });

  res.json({
    message: "Login successful.",
    token,
    user: publicUser(user)
  });
}));

router.get("/me", authenticate, asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
}));

router.post("/logout", authenticate, asyncHandler(async (req, res) => {
  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "LOGOUT",
    entityType: "auth",
    details: "User logged out",
    ipAddress: requestIp(req)
  });

  res.json({ message: "Logout recorded. Remove the JWT on the client." });
}));

export default router;
