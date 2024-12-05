import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TerminateEmployee.css'; 

function TerminateEmployee({ token }) {
  const [email, setEmail] = useState(''); // Use email instead of userId
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/terminate-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email }), // Send email in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage({ text: data.error, type: 'error' });
        } else {
          setMessage({ text: data.message, type: 'success' });
          setEmail(''); // Clear the email field
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage({ text: 'Failed to terminate employee', type: 'error' });
      });
  };

  return (
    <div className="terminate-employee-container">
      <h2>Terminate Employee</h2>
      <form onSubmit={handleSubmit} className="terminate-employee-form">
        <input
          type="email" // Updated to email input type
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter User Email"
          required
        />
        <button type="submit">Terminate Employee</button>
      </form>
      {message && (
        <div
          className={`terminate-employee-message ${message.type}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default TerminateEmployee;
