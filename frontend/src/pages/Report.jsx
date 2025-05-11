import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
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
} from '@mui/material';

const Report = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    class: '',
    vaccinated: '',
    vaccine: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  // Fetch students with filters
  const fetchStudents = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      const response = await axios.get(`http://localhost:5000/api/reports?${queryParams.toString()}`);
      setStudents(response.data.data);
      setPagination((prev) => ({
        ...prev,
        totalRecords: response.data.metadata.totalRecords,
        totalPages: response.data.metadata.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const downloadCSV = () => {
    if (students.length === 0) {
      alert('No data available to download.');
      return;
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['ID', 'Name', 'Class', 'Vaccinated', 'Vaccine'],
        ...students.map((student) => [
          student.id,
          student.name,
          student.class,
          student.vaccinated ? 'Yes' : 'No',
          student.vaccine || 'N/A',
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link);
    link.click();
  };

  const downloadExcel = () => {
    if (students.length === 0) {
      alert('No data available to download.');
      return;
    }

    const worksheetData = [
      ['ID', 'Name', 'Class', 'Vaccinated', 'Vaccine'],
      ...students.map((student) => [
        student.id,
        student.name,
        student.class,
        student.vaccinated ? 'Yes' : 'No',
        student.vaccine || 'N/A',
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  const downloadPDF = () => {
    if (students.length === 0) {
      alert('No data available to download.');
      return;
    }

    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'Name', 'Class', 'Vaccinated', 'Vaccine']],
      body: students.map((student) => [
        student.id,
        student.name,
        student.class,
        student.vaccinated ? 'Yes' : 'No',
        student.vaccine || 'N/A',
      ]),
    });
    doc.save('report.pdf');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Generate Report
      </Typography>

      {/* Filters */}
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />
        <TextField
          label="Class"
          name="class"
          value={filters.class}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />
        <TextField
          label="Vaccinated"
          name="vaccinated"
          select
          value={filters.vaccinated}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        >
          <option value="">All</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </TextField>
        <TextField
          label="Vaccine"
          name="vaccine"
          value={filters.vaccine}
          onChange={handleFilterChange}
          sx={{ flexGrow: 1, maxWidth: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={fetchStudents}>
          Apply Filters
        </Button>
      </Box>

      {/* Student Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2, marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Vaccinated</TableCell>
              <TableCell>Vaccine</TableCell>
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {students.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <Typography>
            Page {pagination.page} of {pagination.totalPages}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </Box>
      )}

      {/* Download Buttons */}
      <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Button variant="contained" color="success" onClick={downloadCSV}>
          Download CSV
        </Button>
        <Button variant="contained" color="secondary" onClick={downloadExcel}>
          Download Excel
        </Button>
        <Button variant="contained" color="info" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Report;