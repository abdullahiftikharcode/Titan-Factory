import React, { useState, useEffect } from 'react';
import './AddMaintenance.css'; 

function AddMaintenance({ token }) {
  const [machineId, setMachineId] = useState('');
  const [validMachines, setValidMachines] = useState([]);
  const [description, setDescription] = useState('');
  const maintenanceTypes = ['scheduled', 'unscheduled', 'emergency'];
  const [maintenanceType, setMaintenanceType] = useState('');
  const [status, setStatus] = useState('active');
  const [error, setError] = useState(null);

  // Fetch valid machines from backend
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-machines', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setValidMachines(data.machines);
        } else {
          setError(data.message || 'Failed to fetch machines');
        }
      } catch (err) {
        setError('Error fetching machines: ' + err.message);
      }
    };

    fetchMachines();
  }, [token]);

  // Handle maintenance addition
  const handleAddMaintenance = async (e) => {
    e.preventDefault();

    // Validate the machine ID
    const selectedMachine = validMachines.find(
      (machine) => machine.machine_id === Number(machineId)
    );

    if (!selectedMachine) {
      setError('Machine ID not found');
      return;
    }

    // Prepare the request body
    const requestBody = {
      machine_id: machineId,
      description,
      maintenance_date: new Date().toISOString().split('T')[0],
      maintenance_type: maintenanceType,
      status,
    };

    try {
      const response = await fetch('http://localhost:3001/add-maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Maintenance record added successfully');
        setMachineId('');
        setDescription('');
        setMaintenanceType('');
        setStatus('active');
        setError(null);
      } else {
        setError(data.message || 'Failed to add maintenance record');
      }
    } catch (err) {
      setError('Error adding maintenance record: ' + err.message);
    }
  };

  return (
    <div className="add-maintenance-container">
      <h1>Add Maintenance Record</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleAddMaintenance}>
        <div className="form-group">
          <label htmlFor="machineId">Machine ID:</label>
          <input
            type="text"
            id="machineId"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="maintenanceType">Maintenance Type:</label>
          <select
            id="maintenanceType"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
            required
          >
            <option value="">Select Maintenance Type</option>
            {maintenanceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Maintenance</button>
      </form>
    </div>
  );
}

export default AddMaintenance;
