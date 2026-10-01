import { query } from "../db.js";

export async function createAuditLog({
  userId = null,
  userName = "System",
  action,
  entityType = null,
  entityId = null,
  details = null,
  ipAddress = null
}) {
  await query(
    `INSERT INTO audit_logs
      (user_id, user_name, action, entity_type, entity_id, details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, userName, action, entityType, entityId, details, ipAddress]
  );
}

export function requestIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    null;
}
