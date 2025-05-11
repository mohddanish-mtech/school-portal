const students = [
    { id: '1', name: 'John Doe', class: 'Grade 5', vaccinated: true, vaccine: 'Vaccine A' },
    { id: '2', name: 'Jane Smith', class: 'Grade 6', vaccinated: false, vaccine: null },
    // Add more mock students here
  ];
  
  const drives = [
    { id: '1', vaccineName: 'Vaccine A', date: '2024-11-15', dosesAvailable: 50, applicableClasses: ['Grade 5', 'Grade 6'] },
    { id: '2', vaccineName: 'Vaccine B', date: '2024-12-01', dosesAvailable: 30, applicableClasses: ['Grade 7', 'Grade 8'] },
    // Add more mock drives here
  ];
  
module.exports = { students, drives };

