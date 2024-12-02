// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function AddFactory({ token }) {
//     const [factory_name, setFactoryName] = useState('');
//     const [location, setLocation] = useState('');
//     const [manager_id, setManagerId] = useState('');
//     const [established_date, setEstablishedDate] = useState('');
//     const [capacity, setCapacity] = useState('');
//     const [description, setDescription] = useState('');  // New state for description
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Build the data object for the API
//         const factoryData = {
//             factory_name,
//             location,
//             manager_id,
//             established_date,
//             capacity,
//             description,  // Add description to the data
//         };

//         try {
//             const response = await fetch('http://localhost:3001/add-factory', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`, // Pass the token for authentication
//                 },
//                 body: JSON.stringify(factoryData),
//             });

//             const result = await response.json();
//             if (response.ok) {
//                 alert(result.message || 'Factory added successfully');
//                 navigate('/'); // Redirect to Home after successful addition
//             } else {
//                 alert(result.error || 'Failed to add factory');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('An error occurred while adding the factory.');
//         }
//     };

//     return (
//         <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
//             <h2>Add New Factory</h2>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Factory Name:</label>
//                     <input
//                         type="text"
//                         value={factory_name}
//                         onChange={(e) => setFactoryName(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Location:</label>
//                     <input
//                         type="text"
//                         value={location}
//                         onChange={(e) => setLocation(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Manager ID:</label>
//                     <input
//                         type="number"
//                         value={manager_id}
//                         onChange={(e) => setManagerId(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Established Date:</label>
//                     <input
//                         type="date"
//                         value={established_date}
//                         onChange={(e) => setEstablishedDate(e.target.value)}
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Capacity:</label>
//                     <input
//                         type="number"
//                         value={capacity}
//                         onChange={(e) => setCapacity(e.target.value)}
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '15px' }}>
//                     <label>Description:</label>
//                     <textarea
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         style={{ width: '100%', padding: '8px' }}
//                     />
//                 </div>
//                 <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//                     Add Factory
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default AddFactory;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddFactory.css'; // Import the enhanced CSS file

function AddFactory({ token }) {
    const [factory_name, setFactoryName] = useState('');
    const [location, setLocation] = useState('');
    const [manager_id, setManagerId] = useState('');
    const [established_date, setEstablishedDate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(''); // To display success or error messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build the data object for the API
        const factoryData = {
            factory_name,
            location,
            manager_id,
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
                    <label>Manager ID:</label>
                    <input
                        type="number"
                        value={manager_id}
                        onChange={(e) => setManagerId(e.target.value)}
                        required
                    />
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
