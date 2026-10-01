import jwt from "jsonwebtoken";
import { query } from "../db.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = header.substring(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query(
      `SELECT id, name, email, role, status
       FROM users
       WHERE id = $1 AND status = 'Active'`,
      [payload.userId]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ message: "User account is inactive or no longer exists." });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }

    next();
  };
}
