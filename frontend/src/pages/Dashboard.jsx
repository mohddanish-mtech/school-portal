// src/pages/Dashboard.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard metrics from the backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Dashboard
        </Typography>
      </Box>

      {/* Metrics Section */}
      <Grid container spacing={3}>
        {/* Total Students */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PeopleIcon sx={{ fontSize: '2rem', color: '#1976d2' }} />
                <Typography variant="h6">Total Students</Typography>
              </Box>
              <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                {metrics?.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Vaccinated Students */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <VaccinesIcon sx={{ fontSize: '2rem', color: '#4caf50' }} />
                <Typography variant="h6">Vaccinated Students</Typography>
              </Box>
              <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                {metrics?.vaccinatedStudents || 0} ({metrics?.vaccinationPercentage || 0}%)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Drives */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarTodayIcon sx={{ fontSize: '2rem', color: '#ff9800' }} />
                <Typography variant="h6">Upcoming Drives</Typography>
              </Box>
              {/* <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                {metrics?.upcomingDrives.length > 0 ? metrics.upcomingDrives.length : 'No upcoming drives'}
              </Typography> */}
              <Typography variant="h6" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                  {metrics?.upcomingDrives > 0 ? metrics.upcomingDrives : 'No upcoming drives'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Links */}
      <Box sx={{ marginTop: '30px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '15px' }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            href="/students"
            sx={{ textTransform: 'none' }}
          >
            Manage Students
          </Button>
          <Button
            variant="contained"
            color="secondary"
            href="/drives"
            sx={{ textTransform: 'none' }}
          >
            Vaccination Drives
          </Button>
          <Button
            variant="contained"
            color="success"
            href="/reports"
            sx={{ textTransform: 'none' }}
          >
            Generate Reports
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;