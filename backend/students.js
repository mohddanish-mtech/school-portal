const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const db = require('./db');
const router = express.Router();

// Add Student API
router.post('/', (req, res) => {
  const { name, class: studentClass, vaccinated, vaccine } = req.body;

  if (!name || !studentClass) {
    return res.status(400).json({ message: 'Name and class are required fields.' });
  }

  try {
    const insertStudent = db.prepare(
      'INSERT INTO students (id, name, class, vaccinated, vaccine) VALUES (?, ?, ?, ?, ?)'
    );
    const newId = Math.random().toString(36).substr(2, 9); // Generate a random ID
    insertStudent.run(newId, name, studentClass, vaccinated ? 1 : 0, vaccine || null);

    res.status(201).json({ message: 'Student added successfully.', id: newId });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Error adding student.', error });
  }
});


// Update Student API
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, class: studentClass, vaccinated, vaccine } = req.body;

  if (!name || !studentClass) {
    return res.status(400).json({ message: 'Name and class are required fields.' });
  }

  try {
    const existingStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    db.prepare(
      'UPDATE students SET name = ?, class = ?, vaccinated = ?, vaccine = ? WHERE id = ?'
    ).run(name, studentClass, vaccinated ? 1 : 0, vaccine || null, id);

    res.json({ message: 'Student updated successfully.' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student.', error });
  }
});

// Delete Student API
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    // Check if the student exists
    const existingStudent = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Delete the student
    db.prepare('DELETE FROM students WHERE id = ?').run(id);

    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student.', error });
  }
});
// Multer Configuration for File Uploads
const upload = multer({ dest: 'uploads/' });


// Fetch All Students with Filters
router.get('/', (req, res) => {
  const { name, class: studentClass, vaccinated, id } = req.query;
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
  if (id) {
    query += ' AND id LIKE ?';
    params.push(`%${id}%`);
  }

  const students = db.prepare(query).all(params);
  res.json(students);
});

// Bulk Upload Students
router.post('/bulk-upload', upload.single('file'), (req, res) => {
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const insertStudent = db.prepare(
        'INSERT INTO students (id, name, class, vaccinated, vaccine) VALUES (?, ?, ?, ?, ?)'
      );
      const insertMany = db.transaction((students) => {
        for (const student of students) {
          insertStudent.run(
            Math.random().toString(36).substr(2, 9), // Generate a random ID
            student.name,
            student.class,
            student.vaccinated === 'true' ? 1 : 0,
            student.vaccine || null
          );
        }
      });
      insertMany(results);
      fs.unlinkSync(filePath); // Delete the temporary file
      res.status(201).json({ message: `${results.length} students added successfully.` });
    })
    .on('error', (error) => {
      res.status(500).json({ message: 'Error processing the file.', error });
    });
});

module.exports = router;