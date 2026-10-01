import express from "express";
import { query, withTransaction } from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createAuditLog, requestIp } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate);

const selectMaintenance = `
  SELECT
    m.id,
    m.equipment_id AS "equipmentId",
    e.name AS "equipmentName",
    e.serial_number AS "serialNumber",
    m.issue,
    m.technician,
    m.maintenance_date AS "maintenanceDate",
    m.status,
    m.notes,
    m.created_at AS "createdAt"
  FROM maintenance m
  JOIN equipment e ON e.id = m.equipment_id
`;

router.get("/", asyncHandler(async (req, res) => {
  const { status, equipmentId } = req.query;
  const values = [];
  const filters = [];

  if (status) {
    values.push(status);
    filters.push(`m.status = $${values.length}`);
  }

  if (equipmentId) {
    values.push(equipmentId);
    filters.push(`m.equipment_id = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `${selectMaintenance} ${where} ORDER BY m.id DESC`,
    values
  );

  res.json(result.rows);
}));

router.post("/", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const {
    equipmentId,
    issue,
    technician = req.user.name,
    maintenanceDate,
    status = "Scheduled",
    notes = ""
  } = req.body;

  if (!equipmentId || !issue || !maintenanceDate) {
    return res.status(400).json({
      message: "Equipment, issue, and maintenance date are required."
    });
  }

  const id = await withTransaction(async (client) => {
    const equipment = await client.query(
      `SELECT id FROM equipment WHERE id=$1`,
      [equipmentId]
    );

    if (!equipment.rows[0]) {
      const error = new Error("Equipment not found.");
      error.status = 404;
      throw error;
    }

    const result = await client.query(
      `INSERT INTO maintenance
        (equipment_id, issue, technician, maintenance_date, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id`,
      [equipmentId, issue, technician, maintenanceDate, status, notes]
    );

    if (status === "In Progress" || status === "Scheduled") {
      await client.query(
        `UPDATE equipment
         SET condition='Needs Repair',
             updated_at=CURRENT_TIMESTAMP
         WHERE id=$1`,
        [equipmentId]
      );
    }

    return result.rows[0].id;
  });

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "CREATE_MAINTENANCE",
    entityType: "maintenance",
    entityId: id,
    details: `Created maintenance record for equipment ${equipmentId}`,
    ipAddress: requestIp(req)
  });

  const result = await query(`${selectMaintenance} WHERE m.id=$1`, [id]);
  res.status(201).json(result.rows[0]);
}));

router.patch("/:id/status", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Scheduled", "In Progress", "Completed", "Cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${allowed.join(", ")}`
    });
  }

  const result = await query(
    `UPDATE maintenance
     SET status=$1
     WHERE id=$2
     RETURNING id, equipment_id AS "equipmentId"`,
    [status, req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Maintenance record not found." });
  }

  if (status === "Completed") {
    await query(
      `UPDATE equipment
       SET condition='Good',
           last_maintenance=CURRENT_DATE,
           updated_at=CURRENT_TIMESTAMP
       WHERE id=$1`,
      [result.rows[0].equipmentId]
    );
  }

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "UPDATE_MAINTENANCE_STATUS",
    entityType: "maintenance",
    entityId: Number(req.params.id),
    details: `Maintenance status changed to ${status}`,
    ipAddress: requestIp(req)
  });

  const updated = await query(`${selectMaintenance} WHERE m.id=$1`, [req.params.id]);
  res.json(updated.rows[0]);
}));

router.delete("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  const result = await query(
    `DELETE FROM maintenance WHERE id=$1 RETURNING id`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Maintenance record not found." });
  }

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "DELETE_MAINTENANCE",
    entityType: "maintenance",
    entityId: Number(req.params.id),
    details: "Deleted maintenance record",
    ipAddress: requestIp(req)
  });

  res.json({ message: "Maintenance record deleted successfully." });
}));

export default router;
