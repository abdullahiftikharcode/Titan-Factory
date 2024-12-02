// import React, { useState, useEffect } from 'react';
// const AddDepartment = ({ token }) => {
//     const [departmentName, setDepartmentName] = useState('');
//     const [managerId, setManagerId] = useState('');
//     const [managers, setManagers] = useState([]);
//     const [message, setMessage] = useState('');
    
//     useEffect(() => {
//         // Fetch list of all users who are managers
//         const fetchManagers = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/get-managers', {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 const data = await response.json();
//                 if (response.ok) {
//                     setManagers(data); // Set managers data directly as the response is already the list of manager IDs
//                 } else {
//                     setMessage(data.error || 'Failed to load managers');
//                 }
//             } catch (error) {
//                 setMessage('Error fetching managers: ' + error.message);
//             }
//         };

//         fetchManagers();
//     }, [token]);

//     const handleAddDepartment = async () => {
//         if (!departmentName || !managerId) {
//             setMessage('Please fill in all fields.');
//             return;
//         }

//         // Check if the entered managerId is valid
//         const isValidManager = managers.some((manager) => manager.user_id.toString() === managerId);

//         if (!isValidManager) {
//             setMessage('Incorrect manager ID');
//             return;
//         }

//         // Proceed with adding department if the manager ID is valid
//         try {
//             const response = await fetch('http://localhost:3001/add-department', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ departmentName, managerId }),
//             });

//             const result = await response.json();
//             if (response.ok) {
//                 setMessage('Department added successfully!');
//                 setDepartmentName('');
//                 setManagerId('');
//             } else {
//                 setMessage(result.error || 'Failed to add department');
//             }
//         } catch (error) {
//             setMessage('Error adding department: ' + error.message);
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h2>Add New Department</h2>
//             {message && <p style={styles.message}>{message}</p>}

//             <div style={styles.formGroup}>
//                 <label htmlFor="departmentName">Department Name:</label>
//                 <input
//                     type="text"
//                     id="departmentName"
//                     value={departmentName}
//                     onChange={(e) => setDepartmentName(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="managerId">Assign Manager (User ID):</label>
//                 <select
//                     id="managerId"
//                     value={managerId}
//                     onChange={(e) => setManagerId(e.target.value)}
//                     style={styles.select}
//                 >
//                     <option value="">Select a manager</option>
//                     {managers.map((manager) => (
//                         <option key={manager.user_id} value={manager.user_id}>
//                             {manager.user_id}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <button onClick={handleAddDepartment} style={styles.button}>
//                 Add Department
//             </button>
//         </div>
//     );
// };

// const styles = {
//     container: { padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
//     formGroup: { marginBottom: '15px' },
//     input: { padding: '10px', width: '100%', fontSize: '16px', marginTop: '5px' },
//     select: { padding: '10px', width: '100%', fontSize: '16px', marginTop: '5px' },
//     button: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' },
//     message: { color: '#d9534f' },
// };

//export default AddDepartment;

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
