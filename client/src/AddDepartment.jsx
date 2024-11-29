import React, { useState } from 'react';

const AddMachine = ({ token }) => {
    const [machineName, setMachineName] = useState('');
    const [machineType, setMachineType] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleAddMachine = async () => {
        if (!machineName || !machineType || !location || !description) {
            setMessage('Please fill in all fields.');
            return;
        }

        // Proceed with adding machine
        try {
            const response = await fetch('http://localhost:3001/add-machine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ machineName, machineType, location, description }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Machine added successfully!');
                setMachineName('');
                setMachineType('');
                setLocation('');
                setDescription('');
            } else {
                setMessage(result.error || 'Failed to add machine');
            }
        } catch (error) {
            setMessage('Error adding machine: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add New Machine</h2>
            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.formGroup}>
                <label htmlFor="machineName">Machine Name:</label>
                <input
                    type="text"
                    id="machineName"
                    value={machineName}
                    onChange={(e) => setMachineName(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="machineType">Machine Type:</label>
                <input
                    type="text"
                    id="machineType"
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="location">Location:</label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.formGroup}>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={styles.textarea}
                />
            </div>

            <button onClick={handleAddMachine} style={styles.button}>
                Add Machine
            </button>
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' },
    formGroup: { marginBottom: '15px' },
    input: { padding: '10px', width: '100%', fontSize: '16px', marginTop: '5px' },
    textarea: { padding: '10px', width: '100%', fontSize: '16px', marginTop: '5px', height: '100px' },
    button: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' },
    message: { color: '#d9534f' },
};

export default AddMachine;
