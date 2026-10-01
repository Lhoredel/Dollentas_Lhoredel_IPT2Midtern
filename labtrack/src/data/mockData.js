export const equipment = [
  {
    id: 1,
    name: "Olympus Compound Microscope",
    serialNumber: "MIC-2024-001",
    condition: "Good",
    quantity: 12,
    location: "Biology Lab, Shelf A",
    category: "Microscopy",
    description: "Compound microscope for routine biology laboratory work.",
    lastMaintenance: "2026-08-14",
  },
  {
    id: 2,
    name: "Digital Analytical Balance",
    serialNumber: "BAL-2023-014",
    condition: "Good",
    quantity: 4,
    location: "Chemistry Lab, Bench 2",
    category: "Measurement",
    description: "Precision digital balance for analytical measurements.",
    lastMaintenance: "2026-07-21",
  },
  {
    id: 3,
    name: "Bunsen Burner",
    serialNumber: "BUR-2021-107",
    condition: "Fair",
    quantity: 20,
    location: "Chemistry Lab, Cabinet 1",
    category: "Heating",
    description: "Adjustable gas burner used for heating and sterilization.",
    lastMaintenance: "2026-06-02",
  },
  {
    id: 4,
    name: "Centrifuge 6-Place",
    serialNumber: "CEN-2022-003",
    condition: "Needs Repair",
    quantity: 2,
    location: "Storage Room B",
    category: "Centrifuge",
    description: "Six-place laboratory centrifuge.",
    lastMaintenance: "2026-05-18",
  },
  {
    id: 5,
    name: "Glass Beaker Set (250 mL)",
    serialNumber: "BKR-2024-056",
    condition: "Good",
    quantity: 35,
    location: "Chemistry Lab, Cabinet 3",
    category: "Glassware",
    description: "Heat-resistant 250 mL glass beaker set.",
    lastMaintenance: "2026-09-01",
  },
  {
    id: 6,
    name: "Digital Multimeter",
    serialNumber: "DMM-2020-022",
    condition: "Fair",
    quantity: 8,
    location: "Physics Lab, Drawer 4",
    category: "Electronics",
    description: "Digital multimeter for electrical measurements.",
    lastMaintenance: "2026-04-29",
  },
];

export const borrowers = [
  { id: 1, name: "Maria Santos", role: "Faculty", department: "Science", email: "maria.santos@school.edu" },
  { id: 2, name: "John Reyes", role: "Student", department: "BS Biology", email: "john.reyes@school.edu" },
  { id: 3, name: "Angela Cruz", role: "Faculty", department: "Chemistry", email: "angela.cruz@school.edu" },
];

export const borrowings = [
  { id: 1, equipment: "Olympus Compound Microscope", borrower: "Maria Santos", quantity: 2, borrowedDate: "2026-09-29", dueDate: "2026-10-03", status: "Borrowed" },
  { id: 2, equipment: "Digital Multimeter", borrower: "John Reyes", quantity: 1, borrowedDate: "2026-09-28", dueDate: "2026-10-02", status: "Borrowed" },
  { id: 3, equipment: "Glass Beaker Set (250 mL)", borrower: "Angela Cruz", quantity: 5, borrowedDate: "2026-09-24", dueDate: "2026-09-30", status: "Overdue" },
];

export const maintenance = [
  { id: 1, equipment: "Centrifuge 6-Place", issue: "Motor vibration", technician: "Lab Technician", date: "2026-09-26", status: "In Progress" },
  { id: 2, equipment: "Bunsen Burner", issue: "Gas valve inspection", technician: "Lab Technician", date: "2026-09-30", status: "Scheduled" },
  { id: 3, equipment: "Digital Multimeter", issue: "Display calibration", technician: "Electronics Technician", date: "2026-09-18", status: "Completed" },
];

export const users = [
  { id: 1, name: "Administrator", email: "admin@labtrack.edu", role: "Administrator", status: "Active" },
  { id: 2, name: "Lab Technician", email: "technician@labtrack.edu", role: "Technician", status: "Active" },
  { id: 3, name: "Science Faculty", email: "faculty@labtrack.edu", role: "Faculty", status: "Active" },
];

export const auditLogs = [
  { id: 1, action: "Added equipment", user: "Administrator", details: "Digital Analytical Balance", date: "2026-10-01 08:15" },
  { id: 2, action: "Updated equipment", user: "Lab Technician", details: "Centrifuge 6-Place", date: "2026-09-30 16:42" },
  { id: 3, action: "Borrowed equipment", user: "Maria Santos", details: "2 × Olympus Compound Microscope", date: "2026-09-29 10:21" },
  { id: 4, action: "Maintenance completed", user: "Electronics Technician", details: "Digital Multimeter", date: "2026-09-18 14:05" },
];