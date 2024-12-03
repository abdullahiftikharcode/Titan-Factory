// import React, { useState } from 'react';

// function AddNotification({ token }) {
//   const [message, setMessage] = useState('');
//   const [targetRole, setTargetRole] = useState('');
//   const [notificationType, setNotificationType] = useState('');
//   const [roles] = useState(['admin', 'manager', 'employee', 'maintenance_staff', 'sales', 'all']); // Predefined roles for selection
//   const [notificationTypes] = useState(['alert', 'reminder', 'info', 'warning']); // Predefined notification types

//   // Handle notification addition
//   const handleAddNotification = async (e) => {
//     e.preventDefault();

//     const response = await fetch('http://localhost:3001/add-notification', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         message,
//         targetRole,
//         notificationType,
//       }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//       alert('Notification added successfully');
//       setMessage('');
//       setTargetRole('');
//       setNotificationType('');
//     } else {
//       alert(`Failed to add notification: ${data.error}`);
//     }
//   };

//   return (
//     <div>
//       <h1>Add Notification</h1>
//       <form onSubmit={handleAddNotification}>
//         <div>
//           <label>Message:</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Target Role:</label>
//           <select
//             value={targetRole}
//             onChange={(e) => setTargetRole(e.target.value)}
//             required
//           >
//             <option value="">Select Target Role</option>
//             {roles.map((role) => (
//               <option key={role} value={role}>
//                 {role}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label>Notification Type:</label>
//           <select
//             value={notificationType}
//             onChange={(e) => setNotificationType(e.target.value)}
//             required
//           >
//             <option value="">Select Notification Type</option>
//             {notificationTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button type="submit">Add Notification</button>
//       </form>
//     </div>
//   );
// }

// export default AddNotification;

import React, { useState } from 'react';
import './AddNotification.css'; // Import the CSS file

function AddNotification({ token }) {
  const [message, setMessage] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [roles] = useState(['admin', 'manager', 'employee', 'maintenance_staff', 'sales', 'all']); // Predefined roles for selection
  const [notificationTypes] = useState(['alert', 'reminder', 'info', 'warning']); // Predefined notification types

  // Handle notification addition
  const handleAddNotification = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/add-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        targetRole,
        notificationType,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Notification added successfully');
      setMessage('');
      setTargetRole('');
      setNotificationType('');
    } else {
      alert(`Failed to add notification: ${data.error}`);
    }
  };

  return (
    <div className="add-notification-container">
      <h1>Add Notification</h1>
      <form onSubmit={handleAddNotification} className="add-notification-form">
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Target Role:</label>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            required
          >
            <option value="">Select Target Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Notification Type:</label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            required
          >
            <option value="">Select Notification Type</option>
            {notificationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Notification</button>
      </form>
    </div>
  );
}

export default AddNotification;

