import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TerminateEmployee({ token }) {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/terminate-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
          setUserId('');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Failed to terminate employee');
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
    button: {
      padding: '10px',
      fontSize: '16px',
      backgroundColor: '#f44336',
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
      <h2>Terminate Employee</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Terminate Employee</button>
      </form>
      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
}

export default TerminateEmployee;
