# LabTrack API Examples

## Equipment

### Create

```http
POST /api/equipment
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "pH Meter",
  "serialNumber": "PH-2026-001",
  "condition": "Good",
  "quantity": 3,
  "location": "Chemistry Lab, Cabinet 5",
  "category": "Measurement",
  "description": "Digital laboratory pH meter"
}
```

### Update

```http
PUT /api/equipment/1
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Olympus Compound Microscope",
  "serialNumber": "MIC-2024-001",
  "condition": "Good",
  "quantity": 12,
  "location": "Biology Lab, Shelf A",
  "category": "Microscope",
  "description": "Updated description"
}
```

## Borrowing

```http
POST /api/borrowing
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "equipmentId": 1,
  "borrowerId": 2,
  "quantity": 2,
  "dueDate": "2026-10-15",
  "notes": "For biology practical activity"
}
```

Return:

```http
PATCH /api/borrowing/1/return
Authorization: Bearer TOKEN
```

## Maintenance

```http
POST /api/maintenance
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "equipmentId": 4,
  "issue": "Motor makes unusual noise",
  "technician": "Laboratory Technician",
  "maintenanceDate": "2026-10-02",
  "status": "Scheduled",
  "notes": "Inspect motor and belt"
}
```

Complete:

```http
PATCH /api/maintenance/1/status
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "Completed"
}
```

## Users

```http
POST /api/users
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "New Technician",
  "email": "newtech@labtrack.edu",
  "password": "ChangeMe123!",
  "role": "Technician",
  "status": "Active"
}
```

## Reports

```http
GET /api/reports/summary
Authorization: Bearer TOKEN
```

```http
GET /api/reports/overdue
Authorization: Bearer TOKEN
```

```http
GET /api/reports/export/equipment
Authorization: Bearer TOKEN
```

The export endpoint returns a CSV file.
