import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudentForm from './components/AddStudentForm';
import Report from './pages/Report'; 
import ManageDrives from './pages/ManageDrives';
import './styles/global.css'; 
import SchoolIcon from '@mui/icons-material/School';


const App = () => {
  return (
    <>
    <Router>

    <div style={{ padding: '20px' }}>
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <SchoolIcon style={{ fontSize: '2rem', marginRight: '10px', color: '#06402b' }} />
          <h1 style={{ margin: 0 }}>School Vaccination Portal</h1>
        </header>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/add-student" element={<AddStudentForm />} />
        <Route path="/reports" element={<Report />} /> 
        <Route path="/drives" element={<ManageDrives />} />
      </Routes>
      </div>
    </Router>
    </>
    
  );
};

export default App;