import React, { useState, useEffect } from 'react';
import './AddUser.css';

function AddUser({ token, addUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roles, setRoles] = useState([]); // State to store roles from API
  const [message, setMessage] = useState(''); // State to store validation/error messages

  // Fetch roles from API on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setRoles(data); // Set roles from API response
        } else {
          console.error('Failed to fetch roles:', data.error);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [token]);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format.');
      return false;
    }
    if (password.length <= 8) {
      setMessage('Password must be greater than 8 characters.');
      return false;
    }
    setMessage(''); // Clear message if validation passes
    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }
    await addUser(firstName, lastName, email, password, role, address, phoneNumber);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('');
    setAddress('');
    setPhoneNumber('');
    setMessage('User added successfully.');
  };

  return (
    <div className="add-user-container">
      <h1 className="add-user-title">Add User</h1>
      <form onSubmit={handleAddUser}>
        {message && <p className="message">{message}</p>}
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.role_id} value={role.role_name}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button className="submit-button" type="submit">
          Add User
        </button>
      </form>
    </div>
  );
}

export default AddUser;
