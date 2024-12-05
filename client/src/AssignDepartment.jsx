import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssignDepartment.css'; // Import the CSS file

function AssignDepartment({ token }) {
  const [departments, setDepartments] = useState([]);
  const [email, setEmail] = useState(''); // Use email instead of userId
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3001/departments', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setDepartments(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Failed to fetch departments');
      });
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/assign-department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, departmentId: selectedDepartment, jobTitle }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setEmail('');
          setSelectedDepartment('');
          setJobTitle('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Failed to assign department and job title');
      });
  };

  return (
    <div className="assign-department-container">
      <h2>Assign Department</h2>
      <form onSubmit={handleSubmit} className="assign-department-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter User Email"
          required
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
        >
          <option value="">Select a department</option>
          {departments.map((dept) => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.department_name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter Job Title"
          required
        />
        <button type="submit">Assign Department</button>
      </form>
      {message && <div className="assign-department-message">{message}</div>}
    </div>
  );
}

export default AssignDepartment;
