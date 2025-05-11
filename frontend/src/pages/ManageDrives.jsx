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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    dosesAvailable: '',
    applicableClasses: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch vaccination drives
  const fetchDrives = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drives');
      setDrives(response.data);
    } catch (error) {
      console.error('Error fetching drives:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Editing an existing drive
        const driveId = drives.find((d) => d.vaccineName === formData.vaccineName)?.id;
        await axios.put(`http://localhost:5000/api/drives/${driveId}`, formData);
        alert('Drive updated successfully.');
      } else {
        // Creating a new drive
        await axios.post('http://localhost:5000/api/drives', formData);
        alert('Drive created successfully.');
      }

      // Reset form and refresh the list
      setFormData({ vaccineName: '', date: '', dosesAvailable: '', applicableClasses: '' });
      setIsEditMode(false); // Switch back to create mode
      fetchDrives(); // Refresh the list
    } catch (error) {
      console.error('Error creating/updating drive:', error);
      alert('Failed to create/update drive.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this drive?')) {
      try {
        await axios.delete(`http://localhost:5000/api/drives/${id}`);
        alert('Drive deleted successfully.');
        fetchDrives(); // Refresh the list
      } catch (error) {
        console.error('Error deleting drive:', error);
        alert('Failed to delete drive.');
      }
    }
  };

  // Handle Edit Button Click
  const handleEdit = (drive) => {
    setFormData({
      vaccineName: drive.vaccineName,
      date: drive.date,
      dosesAvailable: drive.dosesAvailable,
      applicableClasses: drive.applicableClasses,
    });
    setIsEditMode(true); // Switch to edit mode
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
          Vaccination Drives
        </Typography>
      </Box>

      {/* Create/Edit Drive Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Vaccination Drive' : 'Create New Vaccination Drive'}
        </Typography>
        <TextField
          label="Vaccine Name"
          name="vaccineName"
          value={formData.vaccineName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Doses Available"
          name="dosesAvailable"
          type="number"
          value={formData.dosesAvailable}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Applicable Classes (e.g., Grade 5, Grade 6)"
          name="applicableClasses"
          value={formData.applicableClasses}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            sx={{ marginTop: '10px' }}
          >
            {isEditMode ? 'Update Drive' : 'Create Drive'}
          </Button>
          {isEditMode && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => {
                setFormData({ vaccineName: '', date: '', dosesAvailable: '', applicableClasses: '' });
                setIsEditMode(false); // Switch back to create mode
              }}
              sx={{ marginTop: '10px' }}
            >
              Cancel
            </Button>
          )}
        </Box>
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
          {/* Vaccination Drives Table */}
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vaccine Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Doses Available</TableCell>
                  <TableCell>Applicable Classes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drives.length > 0 ? (
                  drives.map((drive) => (
                    <TableRow key={drive.id}>
                      <TableCell>{drive.vaccineName}</TableCell>
                      <TableCell>{new Date(drive.date).toLocaleDateString()}</TableCell>
                      <TableCell>{drive.dosesAvailable}</TableCell>
                      <TableCell>{drive.applicableClasses}</TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton
                            disabled={new Date(drive.date) < new Date()} // Disable for past drives
                            onClick={() => handleEdit(drive)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(drive.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No upcoming drives.
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

export default Drives;