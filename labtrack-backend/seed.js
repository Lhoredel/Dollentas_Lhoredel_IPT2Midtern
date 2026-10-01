import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { query, pool } from "./db.js";

dotenv.config();

async function seed() {
  try {
    const adminPassword = await bcrypt.hash("admin123", 12);
    const technicianPassword = await bcrypt.hash("tech123", 12);

    const admin = await query(
      `INSERT INTO users (name,email,password_hash,role,status)
       VALUES ('LabTrack Administrator','admin@labtrack.edu', $1, 'Admin', 'Active')
       ON CONFLICT (email)
       DO UPDATE SET password_hash=EXCLUDED.password_hash,
                     role='Admin',
                     status='Active'
       RETURNING id`,
      [adminPassword]
    );

    const technician = await query(
      `INSERT INTO users (name,email,password_hash,role,status)
       VALUES ('Laboratory Technician','technician@labtrack.edu', $1, 'Technician', 'Active')
       ON CONFLICT (email)
       DO UPDATE SET password_hash=EXCLUDED.password_hash,
                     role='Technician',
                     status='Active'
       RETURNING id`,
      [technicianPassword]
    );

    await query(`
      INSERT INTO equipment
        (name, serial_number, condition, quantity, available_quantity, location, category, description)
      VALUES
        ('Olympus Compound Microscope', 'MIC-2024-001', 'Good', 12, 12, 'Biology Lab, Shelf A', 'Microscope', 'Compound microscope for biology laboratory use.'),
        ('Digital Analytical Balance', 'BAL-2023-014', 'Good', 4, 4, 'Chemistry Lab, Bench 2', 'Balance', 'High precision digital analytical balance.'),
        ('Bunsen Burner', 'BUR-2021-107', 'Fair', 20, 20, 'Chemistry Lab, Cabinet 1', 'Heating', 'Laboratory gas burner.'),
        ('Centrifuge 6-Place', 'CEN-2022-003', 'Needs Repair', 2, 2, 'Storage Room B', 'Centrifuge', 'Six-place laboratory centrifuge.'),
        ('Glass Beaker Set (250 mL)', 'BKR-2024-056', 'Good', 35, 35, 'Chemistry Lab, Cabinet 3', 'Glassware', '250 mL glass beaker set.'),
        ('Digital Multimeter', 'DMM-2020-022', 'Fair', 8, 8, 'Physics Lab, Drawer 4', 'Electronics', 'Digital electrical measurement device.')
      ON CONFLICT (serial_number) DO NOTHING
    `);

    console.log("Seed complete.");
    console.log("Admin: admin@labtrack.edu / admin123");
    console.log("Technician: technician@labtrack.edu / tech123");
    console.log(`Admin ID: ${admin.rows[0]?.id}, Technician ID: ${technician.rows[0]?.id}`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
