import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AssignDepartment({ token }) {
  const [departments, setDepartments] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [jobTitle, setJobTitle] = useState(''); // New state for job title
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3001/departments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setDepartments(data);
        }
      })
      .catch(error => {
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId, departmentId: selectedDepartment, jobTitle }) // Include jobTitle
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setUserId('');
          setSelectedDepartment('');
          setJobTitle(''); // Reset job title input
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Failed to assign department and job title');
      });
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    input: {
      padding: '10px',
      fontSize: '16px',
    },
    select: {
      padding: '10px',
      fontSize: '16px',
    },
    button: {
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    },
    message: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#f2f2f2',
      borderRadius: '5px',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Assign Department</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          required
          style={styles.input}
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
          style={styles.select}
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
          onChange={(e) => setJobTitle(e.target.value)} // Update job title state
          placeholder="Enter Job Title"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Assign Department</button>
      </form>
      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
}

export default AssignDepartment;
