import React, { useEffect, useState } from 'react';
import './PendingMaintenance.css'; 

const PendingMaintenance = () => {
  const [pendingMaintenances, setPendingMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingMaintenance = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetching the token from localStorage
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:3001/pending-maintenance', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending maintenance tasks');
        }

        const data = await response.json();

        // Log the data received from the server
        console.log('Data received from server:', data);

        // Ensure data is an array before setting it
        if (Array.isArray(data.pendingMaintenances)) {
          setPendingMaintenances(data.pendingMaintenances); // Assuming response contains the list of pending maintenance tasks
        } else {
          setPendingMaintenances([]); // Default to an empty array if data isn't an array
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching pending maintenance:', err);
        setError('Failed to load pending maintenance tasks');
        setLoading(false);
      }
    };

    fetchPendingMaintenance();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Pending Maintenance</h1>
      {pendingMaintenances.length === 0 ? (
        <p>No pending maintenance tasks.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Machine ID</th>
              <th>Maintenance Date</th>
              <th>Description</th>
              <th>Maintenance Type</th>
            </tr>
          </thead>
          <tbody>
            {pendingMaintenances.map((maintenance, index) => (
              <tr key={`${maintenance.machine_id}-${index}`}>
                <td>{maintenance.machine_id}</td>
                <td>{maintenance.maintenance_date}</td>
                <td>{maintenance.maintenance_details}</td>
                <td>{maintenance.maintenance_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingMaintenance;

