import express from "express";
import { query, withTransaction } from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createAuditLog, requestIp } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authenticate);

const selectEquipment = `
  SELECT
    id,
    name,
    serial_number AS "serialNumber",
    condition,
    quantity,
    available_quantity AS "availableQuantity",
    location,
    category,
    description,
    last_maintenance AS "lastMaintenance",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM equipment
`;

router.get("/", asyncHandler(async (req, res) => {
  const { search = "", condition, category, location } = req.query;
  const values = [];
  const filters = [];

  if (search) {
    values.push(`%${search}%`);
    filters.push(`(name ILIKE $${values.length} OR serial_number ILIKE $${values.length})`);
  }

  if (condition && condition !== "All") {
    values.push(condition);
    filters.push(`condition = $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }

  if (location) {
    values.push(location);
    filters.push(`location = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `${selectEquipment} ${where} ORDER BY id DESC`,
    values
  );

  res.json(result.rows);
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const result = await query(
    `${selectEquipment} WHERE id = $1`,
    [req.params.id]
  );

  if (!result.rows[0]) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  res.json(result.rows[0]);
}));

router.post("/", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const {
    name,
    serialNumber,
    condition = "Good",
    quantity = 1,
    location,
    category = "General",
    description = "",
    lastMaintenance = null
  } = req.body;

  if (!name || !serialNumber || !location) {
    return res.status(400).json({
      message: "Name, serial number, and location are required."
    });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 0) {
    return res.status(400).json({ message: "Quantity must be a non-negative integer." });
  }

  const result = await query(
    `INSERT INTO equipment
      (name, serial_number, condition, quantity, available_quantity,
       location, category, description, last_maintenance)
     VALUES ($1,$2,$3,$4,$4,$5,$6,$7,$8)
     RETURNING id`,
    [name, serialNumber, condition, qty, location, category, description, lastMaintenance]
  );

  const id = result.rows[0].id;

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "CREATE_EQUIPMENT",
    entityType: "equipment",
    entityId: id,
    details: `Created equipment: ${name}`,
    ipAddress: requestIp(req)
  });

  const equipment = await query(`${selectEquipment} WHERE id = $1`, [id]);

  res.status(201).json(equipment.rows[0]);
}));

router.put("/:id", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const {
    name,
    serialNumber,
    condition,
    quantity,
    location,
    category,
    description,
    lastMaintenance
  } = req.body;

  const existing = await query(
    `SELECT quantity, available_quantity FROM equipment WHERE id = $1`,
    [req.params.id]
  );

  if (!existing.rows[0]) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  const old = existing.rows[0];
  const newQty = Number(quantity);

  if (!Number.isInteger(newQty) || newQty < 0) {
    return res.status(400).json({ message: "Quantity must be a non-negative integer." });
  }

  const borrowed = old.quantity - old.available_quantity;

  if (newQty < borrowed) {
    return res.status(400).json({
      message: `Quantity cannot be lower than currently borrowed quantity (${borrowed}).`
    });
  }

  const newAvailable = newQty - borrowed;

  await query(
    `UPDATE equipment
     SET name=$1,
         serial_number=$2,
         condition=$3,
         quantity=$4,
         available_quantity=$5,
         location=$6,
         category=$7,
         description=$8,
         last_maintenance=$9,
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$10`,
    [
      name,
      serialNumber,
      condition,
      newQty,
      newAvailable,
      location,
      category,
      description,
      lastMaintenance || null,
      req.params.id
    ]
  );

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "UPDATE_EQUIPMENT",
    entityType: "equipment",
    entityId: Number(req.params.id),
    details: `Updated equipment: ${name}`,
    ipAddress: requestIp(req)
  });

  const result = await query(`${selectEquipment} WHERE id = $1`, [req.params.id]);
  res.json(result.rows[0]);
}));

router.delete("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  const existing = await query(
    `SELECT name FROM equipment WHERE id = $1`,
    [req.params.id]
  );

  if (!existing.rows[0]) {
    return res.status(404).json({ message: "Equipment not found." });
  }

  await query(`DELETE FROM equipment WHERE id = $1`, [req.params.id]);

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "DELETE_EQUIPMENT",
    entityType: "equipment",
    entityId: Number(req.params.id),
    details: `Deleted equipment: ${existing.rows[0].name}`,
    ipAddress: requestIp(req)
  });

  res.json({ message: "Equipment deleted successfully." });
}));

export default router;
