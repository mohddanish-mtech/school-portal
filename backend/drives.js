const express = require('express');
const db = require('./db'); // Import the database
const router = express.Router();

// Fetch All Upcoming Drives
router.get('/', (req, res) => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const drives = db
    .prepare('SELECT * FROM drives WHERE date >= ? ORDER BY date ASC')
    .all(today);
  res.json(drives);
});

// Create a New Vaccination Drive
router.post('/', (req, res) => {
  const { vaccineName, date, dosesAvailable, applicableClasses } = req.body;

  // Validate inputs
  if (!vaccineName || !date || !dosesAvailable || !applicableClasses) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const today = new Date();
  const scheduledDate = new Date(date);
  const fifteenDaysLater = new Date();
  fifteenDaysLater.setDate(today.getDate() + 15);

  // Ensure the drive is scheduled at least 15 days in advance
  if (scheduledDate < fifteenDaysLater) {
    return res.status(400).json({
      message: 'Vaccination drives must be scheduled at least 15 days in advance.',
    });
  }

  // Check for overlapping drives
  const overlappingDrives = db
    .prepare('SELECT * FROM drives WHERE date = ? AND applicableClasses = ?')
    .get(date, applicableClasses);
  if (overlappingDrives) {
    return res.status(400).json({
      message: 'A vaccination drive already exists for the selected date and classes.',
    });
  }

  // Insert the new drive into the database
  const insertDrive = db.prepare(
    'INSERT INTO drives (id, vaccineName, date, dosesAvailable, applicableClasses) VALUES (?, ?, ?, ?, ?)'
  );
  const id = Math.random().toString(36).substr(2, 9); // Generate a random ID
  insertDrive.run(id, vaccineName, date, dosesAvailable, applicableClasses);
  res.status(201).json({ message: 'Vaccination drive created successfully.', id });
});

// Update an Existing Vaccination Drive
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { vaccineName, date, dosesAvailable, applicableClasses } = req.body;

  // Fetch the existing drive
  const drive = db.prepare('SELECT * FROM drives WHERE id = ?').get(id);
  if (!drive) {
    return res.status(404).json({ message: 'Vaccination drive not found.' });
  }

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Disallow editing past drives
  if (drive.date < today) {
    return res.status(400).json({
      message: 'Editing is not allowed for completed or past vaccination drives.',
    });
  }

  // Validate inputs
  if (!vaccineName || !date || !dosesAvailable || !applicableClasses) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check for overlapping drives
  const overlappingDrives = db
    .prepare('SELECT * FROM drives WHERE date = ? AND applicableClasses = ? AND id != ?')
    .get(date, applicableClasses, id);
  if (overlappingDrives) {
    return res.status(400).json({
      message: 'A vaccination drive already exists for the selected date and classes.',
    });
  }

  // Update the drive in the database
  const updateDrive = db.prepare(
    'UPDATE drives SET vaccineName = ?, date = ?, dosesAvailable = ?, applicableClasses = ? WHERE id = ?'
  );
  updateDrive.run(vaccineName, date, dosesAvailable, applicableClasses, id);
  res.json({ message: 'Vaccination drive updated successfully.' });
});

// Delete a Vaccination Drive
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    // Check if the drive exists
    const drive = db.prepare('SELECT * FROM drives WHERE id = ?').get(id);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found.' });
    }

    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Disallow deleting past drives
    if (drive.date < today) {
      return res.status(400).json({
        message: 'Deleting is not allowed for completed or past vaccination drives.',
      });
    }

    // Delete the drive from the database
    db.prepare('DELETE FROM drives WHERE id = ?').run(id);

    res.json({ message: 'Vaccination drive deleted successfully.' });
  } catch (error) {
    console.error('Error deleting vaccination drive:', error);
    res.status(500).json({ message: 'Error deleting vaccination drive.', error });
  }
});

module.exports = router;