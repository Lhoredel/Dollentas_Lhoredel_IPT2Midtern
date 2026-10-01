import express from "express";
import { query } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate);

router.get("/summary", asyncHandler(async (req, res) => {
  const [
    equipment,
    borrowed,
    maintenance,
    users,
    conditions
  ] = await Promise.all([
    query(`
      SELECT
        COUNT(*)::int AS "equipmentTypes",
        COALESCE(SUM(quantity),0)::int AS "totalUnits",
        COALESCE(SUM(available_quantity),0)::int AS "availableUnits"
      FROM equipment
    `),
    query(`
      SELECT
        COUNT(*) FILTER (WHERE status='Borrowed')::int AS "activeBorrowings",
        COALESCE(SUM(quantity) FILTER (WHERE status='Borrowed'),0)::int AS "borrowedUnits",
        COUNT(*) FILTER (
          WHERE status='Borrowed' AND due_date < CURRENT_DATE
        )::int AS "overdueBorrowings"
      FROM borrowings
    `),
    query(`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('Scheduled','In Progress'))::int AS "openMaintenance",
        COUNT(*) FILTER (WHERE status='Completed')::int AS "completedMaintenance"
      FROM maintenance
    `),
    query(`
      SELECT COUNT(*) FILTER (WHERE status='Active')::int AS "activeUsers"
      FROM users
    `),
    query(`
      SELECT condition, COUNT(*)::int AS count
      FROM equipment
      GROUP BY condition
      ORDER BY count DESC
    `)
  ]);

  res.json({
    equipment: equipment.rows[0],
    borrowing: borrowed.rows[0],
    maintenance: maintenance.rows[0],
    users: users.rows[0],
    conditions: conditions.rows
  });
}));

router.get("/equipment", asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      condition,
      COUNT(*)::int AS "equipmentTypes",
      COALESCE(SUM(quantity),0)::int AS "totalUnits",
      COALESCE(SUM(quantity - available_quantity),0)::int AS "borrowedUnits"
    FROM equipment
    GROUP BY condition
    ORDER BY condition
  `);

  res.json(result.rows);
}));

router.get("/borrowing", asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      DATE_TRUNC('month', borrowed_date)::date AS month,
      COUNT(*)::int AS transactions,
      COALESCE(SUM(quantity),0)::int AS units
    FROM borrowings
    WHERE borrowed_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY 1
    ORDER BY 1
  `);

  res.json(result.rows);
}));

router.get("/overdue", asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      b.id,
      e.name AS "equipmentName",
      u.name AS "borrowerName",
      b.quantity,
      b.due_date AS "dueDate",
      (CURRENT_DATE - b.due_date)::int AS "daysOverdue"
    FROM borrowings b
    JOIN equipment e ON e.id=b.equipment_id
    LEFT JOIN users u ON u.id=b.borrower_id
    WHERE b.status='Borrowed'
      AND b.due_date < CURRENT_DATE
    ORDER BY b.due_date ASC
  `);

  res.json(result.rows);
}));

router.get("/export/equipment", asyncHandler(async (req, res) => {
  const result = await query(`
    SELECT
      name,
      serial_number,
      condition,
      quantity,
      available_quantity,
      location,
      category
    FROM equipment
    ORDER BY name
  `);

  const headers = [
    "name",
    "serial_number",
    "condition",
    "quantity",
    "available_quantity",
    "location",
    "category"
  ];

  const csv = [
    headers.join(","),
    ...result.rows.map(row =>
      headers.map(header => {
        const value = row[header] ?? "";
        return `"${String(value).replaceAll('"', '""')}"`;
      }).join(",")
    )
  ].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="labtrack-equipment.csv"');
  res.send(csv);
}));

export default router;
