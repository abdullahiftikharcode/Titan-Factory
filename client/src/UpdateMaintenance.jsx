import React, { useState } from 'react';

const UpdateMaintenance = () => {
  const [machineId, setMachineId] = useState('');
  const [status, setStatus] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    if (!machineId || !status || !maintenanceCost) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare the data to send in the request body
      const response = await fetch('http://localhost:3001/update-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          machine_id: machineId,
          status: status,
          maintenance_cost: maintenanceCost,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Maintenance updated successfully!');
      } else {
        setMessage(data.error || 'Error updating maintenance');
      }
    } catch (err) {
      console.error('Error during update:', err);
      setMessage('Failed to update maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Maintenance</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="machineId">Machine ID</label>
          <input
            type="text"
            id="machineId"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="decommissioned">Decommissioned</option>
          </select>
        </div>

        <div>
          <label htmlFor="maintenanceCost">Maintenance Cost</label>
          <input
            type="number"
            id="maintenanceCost"
            value={maintenanceCost}
            onChange={(e) => setMaintenanceCost(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Maintenance'}
          </button>
        </div>

        {message && <div>{message}</div>}
      </form>
    </div>
  );
};

export default UpdateMaintenance;
