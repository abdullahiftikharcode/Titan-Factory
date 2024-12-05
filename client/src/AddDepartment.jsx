import React, { useState, useEffect } from 'react';
import './AddDepartment.css';

const AddDepartment = ({ token }) => {
  const [departmentName, setDepartmentName] = useState('');
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-managers', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setManagers(data);
        } else {
          setMessage(data.error || 'Failed to load managers');
        }
      } catch (error) {
        setMessage('Error fetching managers: ' + error.message);
      }
    };

    fetchManagers();
  }, [token]);

  const handleAddDepartment = async () => {
    if (!departmentName || !managerId) {
      setMessage('Please fill in all fields.');
      return;
    }

    const isValidManager = managers.some((manager) => manager.user_id.toString() === managerId);
    if (!isValidManager) {
      setMessage('Incorrect manager ID');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/add-department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ departmentName, managerId }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Department added successfully!');
        setDepartmentName('');
        setManagerId('');
      } else {
        setMessage(result.error || 'Failed to add department');
      }
    } catch (error) {
      setMessage('Error adding department: ' + error.message);
    }
  };

  return (
    <div className="add-department-container">
      <h2>Add New Department</h2>
      {message && <p className="message">{message}</p>}

      <div className="form-group">
        <label htmlFor="departmentName">Department Name:</label>
        <input
          type="text"
          id="departmentName"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="managerId">Assign Manager (User ID):</label>
        <select
          id="managerId"
          value={managerId}
          onChange={(e) => setManagerId(e.target.value)}
        >
          <option value="">Select a manager</option>
          {managers.map((manager) => (
            <option key={manager.user_id} value={manager.user_id}>
              {manager.user_id}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAddDepartment} className="button">
        Add Department
      </button>
    </div>
  );
};

export default AddDepartment;
