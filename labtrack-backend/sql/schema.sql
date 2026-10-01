CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'Technician'
    CHECK (role IN ('Admin', 'Technician', 'Viewer')),
  status VARCHAR(30) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS equipment (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  condition VARCHAR(30) NOT NULL DEFAULT 'Good'
    CHECK (condition IN ('Good', 'Fair', 'Needs Repair')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  available_quantity INTEGER NOT NULL DEFAULT 1 CHECK (available_quantity >= 0),
  location VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'General',
  description TEXT DEFAULT '',
  last_maintenance DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (available_quantity <= quantity)
);

CREATE TABLE IF NOT EXISTS borrowings (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  borrower_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  borrowed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  returned_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'Borrowed'
    CHECK (status IN ('Borrowed', 'Returned', 'Overdue')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance (
  id SERIAL PRIMARY KEY,
  equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  issue TEXT NOT NULL,
  technician VARCHAR(150),
  maintenance_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Scheduled'
    CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(150),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  details TEXT,
  ip_address VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_condition ON equipment(condition);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON equipment(location);
CREATE INDEX IF NOT EXISTS idx_borrowings_status ON borrowings(status);
CREATE INDEX IF NOT EXISTS idx_borrowings_due_date ON borrowings(due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance(status);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at DESC);

CREATE OR REPLACE FUNCTION mark_overdue_borrowings()
RETURNS INTEGER AS $$
DECLARE
  affected INTEGER;
BEGIN
  UPDATE borrowings
  SET status = 'Overdue'
  WHERE status = 'Borrowed'
    AND due_date < CURRENT_DATE;

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$ LANGUAGE plpgsql;
