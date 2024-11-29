import React, { useState, useEffect } from 'react';

function AddMaintenance({ token }) {
  const [machineId, setMachineId] = useState('');
  const [validMachines, setValidMachines] = useState([]); // Stores valid machine objects
  const [description, setDescription] = useState('');
  const maintenanceTypes = ['scheduled', 'unscheduled', 'emergency'];
  const [maintenanceType, setMaintenanceType] = useState('');
  const [status, setStatus] = useState('active'); // Track selected machine status
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
          setValidMachines(data.machines); // No filtering by status here anymore
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
  
    // Convert machineId input to a number
    const selectedMachine = validMachines.find(machine => machine.machine_id === Number(machineId));
  
    if (!selectedMachine) {
      setError('Machine ID not found');
      return;
    }
  
    // Check if the machine is active and ensure status can be changed
    if (selectedMachine.status !== 'active' && status !== selectedMachine.status) {
      setError('Status can only be changed if the machine is active.');
      return;
    }
  
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    
    // Prepare the request body
    const requestBody = {
      machine_id: machineId,
      description,
      maintenance_date: currentDate,
      maintenance_type: maintenanceType,
      status, // Always include the selected status
    };
  
    // Log the request body and status being sent to the server
    console.log("Status being sent to server:", status);
    console.log("Request body:", requestBody);
  
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
        // Do not reset status here, it should remain the same as selected
        setMachineId('');
        setDescription('');
        setMaintenanceType('');
        setError(null); // Clear error message
      } else {
        alert(`Failed to add maintenance record: ${data.message}`);
      }
    } catch (err) {
      alert('Error adding maintenance record: ' + err.message);
    }
  };
  
  
  return (
    <div>
      <h1>Add Maintenance Record</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddMaintenance}>
        <div>
          <label>Machine ID:</label>
          <input
            type="text"
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Maintenance Type:</label>
          <select
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
