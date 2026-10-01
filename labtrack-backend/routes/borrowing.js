import express from "express";
import { query, withTransaction } from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createAuditLog, requestIp } from "../utils/audit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authenticate);

const baseSelect = `
  SELECT
    b.id,
    b.equipment_id AS "equipmentId",
    e.name AS "equipmentName",
    e.serial_number AS "serialNumber",
    b.borrower_id AS "borrowerId",
    u.name AS "borrowerName",
    u.email AS "borrowerEmail",
    b.quantity,
    b.borrowed_date AS "borrowedDate",
    b.due_date AS "dueDate",
    b.returned_date AS "returnedDate",
    b.status,
    b.notes,
    b.created_at AS "createdAt"
  FROM borrowings b
  JOIN equipment e ON e.id = b.equipment_id
  LEFT JOIN users u ON u.id = b.borrower_id
`;

router.get("/", asyncHandler(async (req, res) => {
  const { status, borrowerId } = req.query;
  const values = [];
  const filters = [];

  if (status) {
    values.push(status);
    filters.push(`b.status = $${values.length}`);
  }

  if (borrowerId) {
    values.push(borrowerId);
    filters.push(`b.borrower_id = $${values.length}`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const result = await query(
    `${baseSelect} ${where} ORDER BY b.id DESC`,
    values
  );

  res.json(result.rows);
}));

router.post("/", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const {
    equipmentId,
    borrowerId,
    quantity,
    dueDate,
    notes = ""
  } = req.body;

  const qty = Number(quantity);

  if (!equipmentId || !borrowerId || !Number.isInteger(qty) || qty <= 0 || !dueDate) {
    return res.status(400).json({
      message: "Equipment, borrower, positive quantity, and due date are required."
    });
  }

  const borrowing = await withTransaction(async (client) => {
    const equipmentResult = await client.query(
      `SELECT id, name, available_quantity
       FROM equipment
       WHERE id = $1
       FOR UPDATE`,
      [equipmentId]
    );

    const equipment = equipmentResult.rows[0];

    if (!equipment) {
      const error = new Error("Equipment not found.");
      error.status = 404;
      throw error;
    }

    if (equipment.available_quantity < qty) {
      const error = new Error(
        `Only ${equipment.available_quantity} unit(s) are available.`
      );
      error.status = 400;
      throw error;
    }

    const borrowerResult = await client.query(
      `SELECT id, name, status FROM users WHERE id = $1`,
      [borrowerId]
    );

    if (!borrowerResult.rows[0] || borrowerResult.rows[0].status !== "Active") {
      const error = new Error("Borrower is not an active user.");
      error.status = 400;
      throw error;
    }

    const insert = await client.query(
      `INSERT INTO borrowings
        (equipment_id, borrower_id, quantity, due_date, notes, status)
       VALUES ($1,$2,$3,$4,$5,'Borrowed')
       RETURNING id`,
      [equipmentId, borrowerId, qty, dueDate, notes]
    );

    await client.query(
      `UPDATE equipment
       SET available_quantity = available_quantity - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [qty, equipmentId]
    );

    return insert.rows[0].id;
  });

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "CREATE_BORROWING",
    entityType: "borrowing",
    entityId: borrowing,
    details: `Borrowed equipment ID ${equipmentId}, quantity ${qty}`,
    ipAddress: requestIp(req)
  });

  const result = await query(`${baseSelect} WHERE b.id = $1`, [borrowing]);
  res.status(201).json(result.rows[0]);
}));

router.patch("/:id/return", authorize("Admin", "Technician"), asyncHandler(async (req, res) => {
  const borrowingId = Number(req.params.id);

  const returnedId = await withTransaction(async (client) => {
    const result = await client.query(
      `SELECT id, equipment_id, quantity, status
       FROM borrowings
       WHERE id = $1
       FOR UPDATE`,
      [borrowingId]
    );

    const borrowing = result.rows[0];

    if (!borrowing) {
      const error = new Error("Borrowing record not found.");
      error.status = 404;
      throw error;
    }

    if (borrowing.status === "Returned") {
      const error = new Error("This borrowing has already been returned.");
      error.status = 400;
      throw error;
    }

    await client.query(
      `UPDATE borrowings
       SET status='Returned', returned_date=CURRENT_DATE
       WHERE id=$1`,
      [borrowingId]
    );

    await client.query(
      `UPDATE equipment
       SET available_quantity = available_quantity + $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id=$2`,
      [borrowing.quantity, borrowing.equipment_id]
    );

    return borrowingId;
  });

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "RETURN_BORROWING",
    entityType: "borrowing",
    entityId: returnedId,
    details: "Equipment returned",
    ipAddress: requestIp(req)
  });

  const result = await query(`${baseSelect} WHERE b.id = $1`, [returnedId]);
  res.json(result.rows[0]);
}));

router.delete("/:id", authorize("Admin"), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const result = await query(
    `SELECT id, equipment_id, quantity, status FROM borrowings WHERE id = $1`,
    [id]
  );

  const borrowing = result.rows[0];

  if (!borrowing) {
    return res.status(404).json({ message: "Borrowing record not found." });
  }

  await withTransaction(async (client) => {
    if (borrowing.status !== "Returned") {
      await client.query(
        `UPDATE equipment
         SET available_quantity = available_quantity + $1
         WHERE id = $2`,
        [borrowing.quantity, borrowing.equipment_id]
      );
    }

    await client.query(`DELETE FROM borrowings WHERE id = $1`, [id]);
  });

  await createAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    action: "DELETE_BORROWING",
    entityType: "borrowing",
    entityId: id,
    details: "Deleted borrowing record",
    ipAddress: requestIp(req)
  });

  res.json({ message: "Borrowing deleted successfully." });
}));

export default router;
