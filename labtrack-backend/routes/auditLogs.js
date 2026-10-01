import express from "express";
import { query } from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate, authorize("Admin"));

router.get("/", asyncHandler(async (req, res) => {
  const {
    action,
    entityType,
    userId,
    limit = 100,
    offset = 0
  } = req.query;

  const values = [];
  const filters = [];

  if (action) {
    values.push(action);
    filters.push(`action = $${values.length}`);
  }

  if (entityType) {
    values.push(entityType);
    filters.push(`entity_type = $${values.length}`);
  }

  if (userId) {
    values.push(userId);
    filters.push(`user_id = $${values.length}`);
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  values.push(safeLimit);
  values.push(safeOffset);

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `SELECT
       id,
       user_id AS "userId",
       user_name AS "userName",
       action,
       entity_type AS "entityType",
       entity_id AS "entityId",
       details,
       ip_address AS "ipAddress",
       created_at AS "createdAt"
     FROM audit_logs
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1}
     OFFSET $${values.length}`,
    values
  );

  res.json(result.rows);
}));

export default router;
