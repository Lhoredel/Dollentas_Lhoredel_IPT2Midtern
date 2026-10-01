import express from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createAuditLog, requestIp } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate);

const selectUser = `
  SELECT
    id,
    name,
    email,
    role,
    status,
    created_at AS "createdAt"
  FROM users
`;

router.get("/", authorize("Admin"), asyncHandler(async (req, res) => {
  const result = await query(`${selectUser} ORDER BY id DESC`);
  res.json(result.rows);
}));

router.get("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  const result = await query(`${selectUser} WHERE id=$1`, [req.params.id]);

  if (!result.rows[0]) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json(result.rows[0]);
}));

router.post("/", authorize("Admin"), asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = "Technician",
    status = "Active"
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email, and password are required."
    });
  }

  if (!["Admin", "Technician", "Viewer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await query(
    `INSERT INTO users (name,email,password_hash,role,status)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id`,
    [name, email.toLowerCase().trim(), passwordHash, role, status]
  );

  const id = result.rows[0].id;

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "CREATE_USER",
    entityType: "user",
    entityId: id,
    details: `Created user ${email}`,
    ipAddress: requestIp(req)
  });

  const user = await query(`${selectUser} WHERE id=$1`, [id]);
  res.status(201).json(user.rows[0]);
}));

router.put("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  const {
    name,
    email,
    role,
    status,
    password
  } = req.body;

  if (role && !["Admin", "Technician", "Viewer"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  if (status && !["Active", "Inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const existing = await query(`SELECT id FROM users WHERE id=$1`, [req.params.id]);

  if (!existing.rows[0]) {
    return res.status(404).json({ message: "User not found." });
  }

  if (password) {
    const passwordHash = await bcrypt.hash(password, 12);

    await query(
      `UPDATE users
       SET name=COALESCE($1,name),
           email=COALESCE($2,email),
           role=COALESCE($3,role),
           status=COALESCE($4,status),
           password_hash=$5
       WHERE id=$6`,
      [name || null, email?.toLowerCase().trim() || null, role || null, status || null, passwordHash, req.params.id]
    );
  } else {
    await query(
      `UPDATE users
       SET name=COALESCE($1,name),
           email=COALESCE($2,email),
           role=COALESCE($3,role),
           status=COALESCE($4,status)
       WHERE id=$5`,
      [name || null, email?.toLowerCase().trim() || null, role || null, status || null, req.params.id]
    );
  }

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "UPDATE_USER",
    entityType: "user",
    entityId: Number(req.params.id),
    details: "Updated user account",
    ipAddress: requestIp(req)
  });

  const updated = await query(`${selectUser} WHERE id=$1`, [req.params.id]);
  res.json(updated.rows[0]);
}));

router.delete("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  const result = await query(
    `DELETE FROM users WHERE id=$1 RETURNING id`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "User not found." });
  }

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "DELETE_USER",
    entityType: "user",
    entityId: Number(req.params.id),
    details: "Deleted user account",
    ipAddress: requestIp(req)
  });

  res.json({ message: "User deleted successfully." });
}));

export default router;
