import React, { useState } from 'react';

function AddUser({ token, addUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Role field for new user
  const [address, setAddress] = useState(''); // New state for address
  const [phoneNumber, setPhoneNumber] = useState(''); // New state for phone number

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Call the addUser function from App component
    await addUser(firstName, lastName, email, password, role, address, phoneNumber); // Include phoneNumber
    
    // Clear the form after submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('');
    setAddress(''); // Clear address
    setPhoneNumber(''); // Clear phone number
  };

  return (
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleAddUser}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="sales">Sales Team</option>
            <option value="maintenance_staff">Maintenance Staff</option>
            <option value="employee">Employee</option>
          </select>
        </div>
        <div>
          <label>Address:</label> {/* New address field */}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label> {/* New phone number field */}
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}

export default AddUser;
