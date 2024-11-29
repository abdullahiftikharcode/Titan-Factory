// import React, { useState, useEffect } from 'react';

// const AddMachine = ({ token }) => {
//     const [machineName, setMachineName] = useState('');
//     const [model, setModel] = useState('');
//     const [serialNumber, setSerialNumber] = useState('');
//     const [status, setStatus] = useState('active');
//     const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
//     const [nextMaintenanceDue, setNextMaintenanceDue] = useState('');
//     const [purchaseDate, setPurchaseDate] = useState('');
//     const [warrantyExpiry, setWarrantyExpiry] = useState('');
//     const [factoryId, setFactoryId] = useState('');
//     const [location, setLocation] = useState('');
//     const [factories, setFactories] = useState([]);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         // Fetch list of all factories for the dropdown
//         const fetchFactories = async () => {
//             try {
//                 const response = await fetch('http://localhost:3001/get-factories', {
//                     method: 'GET',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 });

//                 const data = await response.json();
//                 if (response.ok) {
//                     setFactories(data); // Set factories data for the dropdown
//                 } else {
//                     setMessage(data.error || 'Failed to load factories');
//                 }
//             } catch (error) {
//                 setMessage('Error fetching factories: ' + error.message);
//             }
//         };

//         fetchFactories();
//     }, [token]);

//     const handleLastMaintenanceDateChange = (e) => {
//         const newLastMaintenanceDate = e.target.value;
//         setLastMaintenanceDate(newLastMaintenanceDate);

//         // Calculate next maintenance date (30 days after last maintenance date)
//         const lastMaintenance = new Date(newLastMaintenanceDate);
//         const nextMaintenance = new Date(lastMaintenance);
//         nextMaintenance.setDate(lastMaintenance.getDate() + 30); // Add 30 days
//         setNextMaintenanceDue(nextMaintenance.toISOString().split('T')[0]); // Set the new next maintenance date
//     };

//     const handleAddMachine = async () => {
//         if (!machineName || !model || !serialNumber || !status || !purchaseDate || !factoryId || !location) {
//             setMessage('Please fill in all required fields.');
//             return;
//         }

//         // Prepare machine data for the POST request
//         const machineData = {
//             machineName,
//             model,
//             serialNumber,
//             status,
//             lastMaintenanceDate,
//             nextMaintenanceDue,
//             purchaseDate,
//             warrantyExpiry,
//             factoryId,
//             location,
//         };

//         try {
//             const response = await fetch('http://localhost:3001/add-machine', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(machineData),
//             });
//             const result = await response.json();
//             if (response.ok) {
//                 setMessage('Machine added successfully!');
//                 // Clear input fields after successful addition
//                 setMachineName('');
//                 setModel('');
//                 setSerialNumber('');
//                 setStatus('active');
//                 setLastMaintenanceDate('');
//                 setNextMaintenanceDue('');
//                 setPurchaseDate('');
//                 setWarrantyExpiry('');
//                 setFactoryId('');
//                 setLocation('');
//             } else {
//                 setMessage(result.error || 'Failed to add machine');
//             }
//         } catch (error) {
//             setMessage('Error adding machine: ' + error.message);
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h2>Add New Machine</h2>
//             {message && <p style={styles.message}>{message}</p>}

//             <div style={styles.formGroup}>
//                 <label htmlFor="machineName">Machine Name:</label>
//                 <input
//                     type="text"
//                     id="machineName"
//                     value={machineName}
//                     onChange={(e) => setMachineName(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="model">Model:</label>
//                 <input
//                     type="text"
//                     id="model"
//                     value={model}
//                     onChange={(e) => setModel(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="serialNumber">Serial Number:</label>
//                 <input
//                     type="text"
//                     id="serialNumber"
//                     value={serialNumber}
//                     onChange={(e) => setSerialNumber(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="status">Status:</label>
//                 <select
//                     id="status"
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     style={styles.select}
//                 >
//                     <option value="active">Active</option>
//                     <option value="maintenance">Maintenance</option>
//                     <option value="decommissioned">Decommissioned</option>
//                 </select>
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="lastMaintenanceDate">Last Maintenance Date:</label>
//                 <input
//                     type="date"
//                     id="lastMaintenanceDate"
//                     value={lastMaintenanceDate}
//                     onChange={handleLastMaintenanceDateChange}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="nextMaintenanceDue">Next Maintenance Due:</label>
//                 <input
//                     type="date"
//                     id="nextMaintenanceDue"
//                     value={nextMaintenanceDue}
//                     onChange={(e) => setNextMaintenanceDue(e.target.value)}
//                     style={styles.input}
//                     disabled
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="purchaseDate">Purchase Date:</label>
//                 <input
//                     type="date"
//                     id="purchaseDate"
//                     value={purchaseDate}
//                     onChange={(e) => setPurchaseDate(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="warrantyExpiry">Warranty Expiry:</label>
//                 <input
//                     type="date"
//                     id="warrantyExpiry"
//                     value={warrantyExpiry}
//                     onChange={(e) => setWarrantyExpiry(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="factoryId">Factory:</label>
//                 <select
//                     id="factoryId"
//                     value={factoryId}
//                     onChange={(e) => setFactoryId(e.target.value)}
//                     style={styles.select}
//                 >
//                     <option value="">Select a factory</option>
//                     {factories.map((factory) => (
//                         <option key={factory.factory_id} value={factory.factory_id}>
//                             {factory.factory_name}
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             <div style={styles.formGroup}>
//                 <label htmlFor="location">Location:</label>
//                 <input
//                     type="text"
//                     id="location"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     style={styles.input}
//                 />
//             </div>

//             <button onClick={handleAddMachine} style={styles.button}>
//                 Add Machine
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

// export default AddMachine;
import React, { useState, useEffect } from 'react';
import './AddMachine.css'; // Adding a separate CSS file for better styling

const AddMachine = ({ token }) => {
    const [machineName, setMachineName] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [status, setStatus] = useState('active');
    const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
    const [nextMaintenanceDue, setNextMaintenanceDue] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [warrantyExpiry, setWarrantyExpiry] = useState('');
    const [factoryId, setFactoryId] = useState('');
    const [location, setLocation] = useState('');
    const [factories, setFactories] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFactories = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3001/get-factories', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setFactories(data);
                } else {
                    setMessage(data.error || 'Failed to load factories');
                }
            } catch (error) {
                setMessage('Error fetching factories: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFactories();
    }, [token]);

    const handleLastMaintenanceDateChange = (e) => {
        const newLastMaintenanceDate = e.target.value;
        setLastMaintenanceDate(newLastMaintenanceDate);

        const lastMaintenance = new Date(newLastMaintenanceDate);
        const nextMaintenance = new Date(lastMaintenance);
        nextMaintenance.setDate(lastMaintenance.getDate() + 30);
        setNextMaintenanceDue(nextMaintenance.toISOString().split('T')[0]);
    };

    const handleAddMachine = async () => {
        if (!machineName || !model || !serialNumber || !status || !purchaseDate || !factoryId || !location) {
            setMessage('Please fill in all required fields.');
            return;
        }

        const machineData = {
            machineName,
            model,
            serialNumber,
            status,
            lastMaintenanceDate,
            nextMaintenanceDue,
            purchaseDate,
            warrantyExpiry,
            factoryId,
            location,
        };

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/add-machine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(machineData),
            });
            const result = await response.json();
            if (response.ok) {
                setMessage('Machine added successfully!');
                setMachineName('');
                setModel('');
                setSerialNumber('');
                setStatus('active');
                setLastMaintenanceDate('');
                setNextMaintenanceDue('');
                setPurchaseDate('');
                setWarrantyExpiry('');
                setFactoryId('');
                setLocation('');
            } else {
                setMessage(result.error || 'Failed to add machine');
            }
        } catch (error) {
            setMessage('Error adding machine: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-machine-container">
            <h2 className="add-machine-title">Add New Machine</h2>
            {message && <p className="add-machine-message">{message}</p>}
            {loading && <p className="add-machine-loading">Loading...</p>}
            <div className="add-machine-form">
                <div className="form-group">
                    <label htmlFor="machineName">Machine Name:</label>
                    <input
                        type="text"
                        id="machineName"
                        value={machineName}
                        onChange={(e) => setMachineName(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="model">Model:</label>
                    <input
                        type="text"
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="serialNumber">Serial Number:</label>
                    <input
                        type="text"
                        id="serialNumber"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-select"
                    >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="decommissioned">Decommissioned</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="lastMaintenanceDate">Last Maintenance Date:</label>
                    <input
                        type="date"
                        id="lastMaintenanceDate"
                        value={lastMaintenanceDate}
                        onChange={handleLastMaintenanceDateChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nextMaintenanceDue">Next Maintenance Due:</label>
                    <input
                        type="date"
                        id="nextMaintenanceDue"
                        value={nextMaintenanceDue}
                        className="form-input"
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="purchaseDate">Purchase Date:</label>
                    <input
                        type="date"
                        id="purchaseDate"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="warrantyExpiry">Warranty Expiry:</label>
                    <input
                        type="date"
                        id="warrantyExpiry"
                        value={warrantyExpiry}
                        onChange={(e) => setWarrantyExpiry(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="factoryId">Factory:</label>
                    <select
                        id="factoryId"
                        value={factoryId}
                        onChange={(e) => setFactoryId(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Select a factory</option>
                        {factories.map((factory) => (
                            <option key={factory.factory_id} value={factory.factory_id}>
                                {factory.factory_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="form-input"
                    />
                </div>

                <button onClick={handleAddMachine} className="add-button" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Machine'}
                </button>
            </div>
        </div>
    );
};

export default AddMachine;


