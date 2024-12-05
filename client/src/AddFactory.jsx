import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFactory.css'; // Import the enhanced CSS file

function AddFactory({ token }) {
    const [factory_name, setFactoryName] = useState('');
    const [location, setLocation] = useState('');
    const [manager_email, setManagerEmail] = useState(''); // Use manager email instead of manager ID
    const [established_date, setEstablishedDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(''); // To display success or error messages
    const [managers, setManagers] = useState([]); // List of managers fetched from API
    const navigate = useNavigate();

    // Fetch the list of managers on component mount
    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetch('http://localhost:3001/get-managers', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setManagers(data); // Set the list of managers
                } else {
                    setMessage({ type: 'error', text: data.error || 'Failed to fetch managers' });
                }
            } catch (error) {
                console.error('Error fetching managers:', error);
                setMessage({ type: 'error', text: 'An error occurred while fetching managers.' });
            }
        };

        fetchManagers();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build the data object for the API
        const factoryData = {
            factory_name,
            location,
            manager_email, // Send manager email instead of manager ID
            established_date,
            capacity,
            description,
        };

        try {
            const response = await fetch('http://localhost:3001/add-factory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(factoryData),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: result.message || 'Factory added successfully' });
                navigate('/'); // Redirect to Home after successful addition
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to add factory' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'An error occurred while adding the factory.' });
        }
    };

    return (
        <div className="add-factory-container">
            <h2>Add New Factory</h2>
            <form onSubmit={handleSubmit} className="add-factory-form">
                <div>
                    <label>Factory Name:</label>
                    <input
                        type="text"
                        value={factory_name}
                        onChange={(e) => setFactoryName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Manager Email:</label>
                    <select
                        value={manager_email}
                        onChange={(e) => setManagerEmail(e.target.value)}
                        required
                    >
                        <option value="">Select Manager</option>
                        {managers.map((manager) => (
                            <option key={manager.user_id} value={manager.email}>
                                {manager.email}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Established Date:</label>
                    <input
                        type="date"
                        value={established_date}
                        onChange={(e) => setEstablishedDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Capacity:</label>
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Add Factory</button>
            </form>
            {message && (
                <div className={`add-factory-message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default AddFactory;
