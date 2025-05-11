const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const studentRoutes = require('./students');
const driveRoutes = require('./drives');
const reportRoutes = require('./reports');
const db = require('./db');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/reports', reportRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the School Vaccination Portal Backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});