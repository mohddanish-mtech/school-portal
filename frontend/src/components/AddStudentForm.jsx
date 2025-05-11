import React, { useState } from 'react';
import axios from 'axios';

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    vaccinated: false,
    vaccine: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students', formData);
      alert('Student added successfully!');
      setFormData({
        name: '',
        class: '',
        vaccinated: false,
        vaccine: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <h2>Add Student</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Class:
        <input
          type="text"
          name="class"
          value={formData.class}
          onChange={handleChange}
          required
        />
      </label>
      <br />
      <label>
        Vaccinated:
        <input
          type="checkbox"
          name="vaccinated"
          checked={formData.vaccinated}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Vaccine Name:
        <input
          type="text"
          name="vaccine"
          value={formData.vaccine}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Add Student</button>
    </form>
  );
};

export default AddStudentForm;