const express = require('express');
const db = require('./db');
const router = express.Router();

// Dashboard API
router.get('/', (req, res) => {
  const totalStudents = db.prepare('SELECT COUNT(*) AS count FROM students').get().count;
  const vaccinatedStudents = db
    .prepare('SELECT COUNT(*) AS count FROM students WHERE vaccinated = 1')
    .get().count;
  const vaccinationPercentage =
    totalStudents > 0 ? ((vaccinatedStudents / totalStudents) * 100).toFixed(2) : '0.00';

  const today = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  const upcomingDrives = db
    .prepare('SELECT COUNT(*) AS count FROM drives WHERE date >= ? AND date <= ?')
    .get(
      today.toISOString().split('T')[0],
      thirtyDaysLater.toISOString().split('T')[0]
    ).count;

  res.json({
    totalStudents,
    vaccinatedStudents,
    vaccinationPercentage,
    upcomingDrives,
  });
});

module.exports = router;