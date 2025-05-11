const express = require('express');
const db = require('./db');
const json2csv = require('json2csv').parse;
const router = express.Router();

// Fetch Filtered Students with Pagination
router.get('/', (req, res) => {
  const { name, class: studentClass, vaccinated, vaccine, page = 1, limit = 10 } = req.query;
  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (studentClass) {
    query += ' AND class LIKE ?';
    params.push(`%${studentClass}%`);
  }
  if (vaccinated !== undefined) {
    query += ' AND vaccinated = ?';
    params.push(vaccinated === 'true' ? 1 : 0);
  }
  if (vaccine) {
    query += ' AND vaccine LIKE ?';
    params.push(`%${vaccine}%`);
  }

  // Pagination logic
  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  try {
    const students = db.prepare(query).all(params);

    const totalQuery = query.replace('LIMIT ? OFFSET ?', '');
    const totalRecords = db.prepare(totalQuery).all(params.slice(0, -2)).length;

    res.json({
      data: students,
      metadata: {
        totalRecords,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalRecords / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports.', error });
  }
});

// Download Filtered Students as CSV
router.get('/download/csv', (req, res) => {
  const { name, class: studentClass, vaccinated, vaccine } = req.query;
  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (studentClass) {
    query += ' AND class LIKE ?';
    params.push(`%${studentClass}%`);
  }
  if (vaccinated !== undefined) {
    query += ' AND vaccinated = ?';
    params.push(vaccinated === 'true' ? 1 : 0);
  }
  if (vaccine) {
    query += ' AND vaccine LIKE ?';
    params.push(`%${vaccine}%`);
  }

  const students = db.prepare(query).all(params);
  const csv = json2csv(students);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
  res.send(csv);
});

module.exports = router;