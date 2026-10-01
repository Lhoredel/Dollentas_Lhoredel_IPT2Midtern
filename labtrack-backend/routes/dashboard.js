import express from "express";
import { query } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate);

router.get("/stats", asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM equipment) AS "equipmentTypes",
      (SELECT COALESCE(SUM(quantity),0)::int FROM equipment) AS "totalUnits",
      (SELECT COUNT(*)::int FROM borrowings WHERE status='Borrowed') AS "activeBorrowings",
      (SELECT COUNT(*)::int FROM maintenance
       WHERE status IN ('Scheduled','In Progress')) AS "maintenanceOpen",
      (SELECT COUNT(*)::int FROM borrowings
       WHERE status='Borrowed' AND due_date < CURRENT_DATE) AS "overdue"
  `);

  res.json(result.rows[0]);
}));

export default router;
