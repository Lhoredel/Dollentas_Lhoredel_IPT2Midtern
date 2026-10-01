# Dollentas_Lhoredel_IPT2Midtern

# Laboratory Equipment Inventory System

## Description

The Laboratory Equipment Inventory System is a full-stack web application designed to help laboratories manage and monitor their equipment records.

The system allows administrators to:

* View laboratory equipment
* Add new equipment
* Edit equipment information
* Delete equipment
* Search equipment
* Monitor equipment condition
* Monitor equipment availability
* View inventory statistics through a dashboard

## Technologies Used

### Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React

### Backend

* Node.js
* Express.js
* REST API
* CORS
* dotenv

### Database

* MySQL

## System Architecture

```text
React + Vite
     |
     | HTTP REST API
     v
Node.js + Express
     |
     | SQL Queries
     v
MySQL Database
```

## Project Structure

```text
laboratory-equipment-inventory/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── equipmentController.js
│   ├── routes/
│   │   └── equipmentRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql
│
└── README.md
```

# Installation

## Requirements

Install the following before running the application:

* Node.js
* npm
* MySQL
* XAMPP or another MySQL server

## 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd laboratory-equipment-inventory
```

# Database Setup

Open MySQL/phpMyAdmin.

Run the SQL file:

```text
database/schema.sql
```

This creates:

```text
laboratory_inventory
```

and the:

```text
equipment
```

table.

# Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=laboratory_inventory
DB_PORT=3306
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

You can test it by opening:

```text
http://localhost:5000
```

Expected response:

```json
{
  "message": "Laboratory Equipment Inventory API is running."
}
```

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

# API Documentation

## Equipment API

### Get All Equipment

```http
GET /api/equipment
```

Returns all laboratory equipment.

### Get Equipment by ID

```http
GET /api/equipment/:id
```

Returns one equipment record.

Example:

```http
GET /api/equipment/1
```

### Create Equipment

```http
POST /api/equipment
```

Creates a new equipment record.

Example request:

```json
{
  "equipment_code": "LAB-005",
  "equipment_name": "Centrifuge",
  "category": "Laboratory Equipment",
  "description": "Laboratory centrifuge",
  "quantity": 3,
  "location": "Laboratory 1",
  "condition_status": "Good",
  "availability_status": "Available",
  "purchase_date": "2026-01-15"
}
```

### Update Equipment

```http
PUT /api/equipment/:id
```

Updates an existing equipment record.

Example:

```http
PUT /api/equipment/1
```

### Delete Equipment

```http
DELETE /api/equipment/:id
```

Deletes an equipment record.

Example:

```http
DELETE /api/equipment/1
```

# Dashboard API

### Get Dashboard Statistics

```http
GET /api/dashboard
```

Returns:

* Total equipment types
* Total equipment quantity
* Available equipment
* Equipment needing repair
* Damaged equipment

# Available API Routes

| Method | Endpoint             | Purpose                  |
| ------ | -------------------- | ------------------------ |
| GET    | `/`                  | Check API status         |
| GET    | `/api/equipment`     | Get all equipment        |
| GET    | `/api/equipment/:id` | Get equipment by ID      |
| POST   | `/api/equipment`     | Create equipment         |
| PUT    | `/api/equipment/:id` | Update equipment         |
| DELETE | `/api/equipment/:id` | Delete equipment         |
| GET    | `/api/dashboard`     | Get dashboard statistics |

# Code Documentation

The source code contains comments explaining the purpose of major parts of the application.

Comments are included for:

* Database connection
* API routes
* Controllers
* React components
* React state
* API services
* Dashboard functionality
* Equipment CRUD operations

# Code Quality

The project follows a clear folder structure separating:

* Frontend
* Backend
* Database
* API routes
* Controllers
* React components
* React pages
* API services

Descriptive variable and function names are used throughout the application.

Examples:

```text
getAllEquipment()
getEquipmentById()
createEquipment()
updateEquipment()
deleteEquipment()
getDashboardStatistics()
```

# Running the Complete Application

You need two terminals.

## Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

## Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

The React frontend communicates with:

```text
http://localhost:5000/api
```

# Examination Documentation Checklist

Before submitting the project, verify:

* [x] Database connection has comments
* [x] API routes have comments
* [x] Controllers have comments
* [x] Main React components have comments
* [x] React state is explained
* [x] README explains the application
* [x] README explains installation
* [x] README explains frontend startup
* [x] README explains backend startup
* [x] README lists API routes
* [x] Variables have descriptive names
* [x] Functions have descriptive names
* [x] Indentation is consistent
* [x] Frontend and backend are separated
* [x] Database script is included

## Author

Laboratory Equipment Inventory System

Developed as a full-stack web application examination project.
