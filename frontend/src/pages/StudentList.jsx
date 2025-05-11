import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Input, 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ name: '', class: '' });
  const [loading, setLoading] = useState(true);
  const [csvFile, setCsvFile] = useState(null);

  // State for the Add/Edit Student Form
  const [newStudent, setNewStudent] = useState({
    id: null, // Used for editing existing students
    name: '',
    class: '',
    vaccinated: false,
    vaccine: '',
  });

  // Fetch students with filters
  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`http://localhost:5000/api/students?${queryParams}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    fetchStudents();
  };

  // Handle CSV file upload
  const handleCsvUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await axios.post('http://localhost:5000/api/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('CSV uploaded successfully.');
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Failed to upload CSV.');
    }
  };

  // Handle Add/Edit Student Form Changes
  const handleAddEditStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Add/Edit Student Form Submission
  const handleAddEditStudentSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (newStudent.id) {
        // Editing an existing student
        await axios.put(`http://localhost:5000/api/students/${newStudent.id}`, newStudent);
        alert('Student updated successfully.');
      } else {
        // Adding a new student
        await axios.post('http://localhost:5000/api/students', newStudent);
        alert('Student added successfully.');
      }
  
      // Reset form and refresh the student list
      setNewStudent({ id: null, name: '', class: '', vaccinated: false, vaccine: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error adding/editing student:', error.response?.data?.message || error.message);
      alert('Failed to add/edit student.');
    }
  };

  // Handle Edit Button Click
  const handleEdit = (student) => {
    setNewStudent({
      id: student.id,
      name: student.name,
      class: student.class,
      vaccinated: student.vaccinated,
      vaccine: student.vaccine || '',
    });
  };

  // Handle Delete Student
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this student?')) {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      alert('Student deleted successfully.');
      fetchStudents(); // Refresh the student list
    } catch (error) {
      console.error('Error deleting student:', error.response?.data?.message || error.message);
      alert('Failed to delete student.');
    }
  }
};

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Student Management
        </Typography>
      </Box>

      {/* Add/Edit Student Form */}
      <Box
        component="form"
        onSubmit={handleAddEditStudentSubmit}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
          {newStudent.id ? 'Edit Student' : 'Add New Student'}
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={newStudent.name}
          onChange={handleAddEditStudentChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Class"
          name="class"
          value={newStudent.class}
          onChange={handleAddEditStudentChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Vaccine Name (Optional)"
          name="vaccine"
          value={newStudent.vaccine}
          onChange={handleAddEditStudentChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Typography sx={{ marginRight: '10px' }}>Vaccinated:</Typography>
          <input
            type="checkbox"
            name="vaccinated"
            checked={newStudent.vaccinated}
            onChange={handleAddEditStudentChange}
          />
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: '10px' }}
        >
          {newStudent.id ? 'Update Student' : 'Add Student'}
        </Button>
      </Box>

      {/* Filters and Bulk Upload */}
      <Box sx={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <TextField
          label="Search by Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />
        <TextField
          label="Search by Class"
          name="class"
          value={filters.class}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />
        <label htmlFor="csv-upload">
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<UploadFileIcon />}
          >
            Upload CSV
          </Button>
        </label>
        <Button variant="contained" color="secondary" onClick={handleCsvUpload}>
          Submit CSV
        </Button>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Student Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Vaccinated</TableCell>
                  <TableCell>Vaccine</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.vaccinated ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{student.vaccine || 'N/A'}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEdit(student)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(student.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default StudentList;