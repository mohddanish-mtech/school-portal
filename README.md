# School Vaccination Portal

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)

---

## Introduction
A full-stack web application for schools to manage student vaccination records, schedule drives, and generate reports. Built with React.js (frontend), Node.js/Express.js (backend), and SQLite (database).

---

## Features
- **Authentication**: Simulated login for school coordinators (username: `admin`, password: `password`).
- **Dashboard**: Displays key metrics (total students, vaccinated students, upcoming drives).
- **Student Management**: Add/edit/delete students, bulk upload via CSV.
- **Vaccination Drives**: Schedule, update, and delete drives with validations (15-day advance, no overlaps).
- **Reports**: Filter students by vaccination status, download reports (CSV/Excel/PDF).

---

## Installation
### Prerequisites
- Node.js (v16+)
- npm
- SQLite

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohddanish-mtech/school-portal.git
   cd school-portal
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   node app.js
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Usage
1. **Access the app**:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

2. **Login**:
   - Use credentials: `admin` / `password`.

3. **Key Functionalities**:
   - Add students individually or via CSV.
   - Schedule vaccination drives (must be 15+ days in advance).
   - Generate reports with filters and pagination.

---

## API Endpoints
### Authentication
- `POST /api/login`: Simulated login.

### Dashboard
- `GET /api/dashboard`: Fetch aggregated metrics.

### Students
- `GET /api/students`: Fetch students with filters.
- `POST /api/students`: Add a student.
- `PUT /api/students/:id`: Update a student.
- `DELETE /api/students/:id`: Delete a student.
- `POST /api/students/bulk-upload`: Upload CSV.

### Vaccination Drives
- `GET /api/drives`: Fetch upcoming drives.
- `POST /api/drives`: Create a drive.
- `PUT /api/drives/:id`: Update a drive.
- `DELETE /api/drives/:id`: Delete a drive.

### Reports
- `GET /api/reports`: Fetch filtered students with pagination.
- `GET /api/reports/download/csv`: Download CSV report.

---

## Database Schema
### Students Table
| Column       | Type    | Description                     |
|--------------|---------|---------------------------------|
| `id`         | TEXT    | Unique student ID               |
| `name`       | TEXT    | Student name                    |
| `class`      | TEXT    | Student class                   |
| `vaccinated` | INTEGER | Vaccination status (0/1)        |
| `vaccine`    | TEXT    | Vaccine name (if vaccinated)    |

### Drives Table
| Column             | Type    | Description                     |
|--------------------|---------|---------------------------------|
| `id`               | TEXT    | Unique drive ID                 |
| `vaccineName`      | TEXT    | Name of the vaccine             |
| `date`             | TEXT    | Drive date (YYYY-MM-DD)         |
| `dosesAvailable`   | INTEGER | Number of doses                 |
| `applicableClasses`| TEXT    | Classes eligible (e.g., "5-7")  |
