import React, { useState } from 'react';
import axios from 'axios';

const BulkUploadForm = ({ onUploadSuccess }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/students/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);

      // Trigger the callback to refetch data
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setMessage('Error uploading the file.');
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Bulk Upload Students</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ margin: '10px', padding: '8px 16px' }}>
        Submit
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BulkUploadForm;