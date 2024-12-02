import React, { useState, useEffect } from 'react';
import './PendingApproval.css'; 

const PendingApproval = ({ token }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Decode the token to get the user ID (assuming the token contains the user's ID)
    useEffect(() => {
        const decodeToken = (token) => {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1]));
                return decoded.userId; // Assuming the user ID is stored in the "id" field
            } catch (err) {
                return null;
            }
        };

        const currentUserId = decodeToken(token);
        setUserId(currentUserId);
    }, [token]);

    // Fetch pending maintenance requests when the component mounts
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:3001/get-pending-maintenance', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();

                if (response.ok) {
                    setRequests(data.requests);
                } else {
                    setError(data.message || 'Failed to fetch requests');
                }
            } catch (err) {
                setError('Error fetching requests: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    // Handle the approval of a maintenance request
    const handleApprove = async (history_id) => {
        if (!userId) {
            alert('Error: Unable to retrieve user ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/approve-maintenance/${history_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ manager_approval_id: userId }), // Use the decoded user ID for approval
            });

            const data = await response.json();

            if (response.ok) {
                // If the approval is successful, update the requests list
                setRequests(requests.filter(request => request.history_id !== history_id));
                alert('Maintenance request approved successfully!');
            } else {
                alert('Failed to approve request: ' + data.message);
            }
        } catch (err) {
            alert('Error approving request: ' + err.message);
        }
    };

    // Handle loading and error states
    if (loading) {
        return <div className="loading">Loading pending requests...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="pending-approval-container">
            <h2>Pending Maintenance Requests</h2>
            <ul>
                {requests.length === 0 ? (
                    <li className="no-requests">No pending requests</li>
                ) : (
                    requests.map((request) => (
                        <li key={request.history_id}>
                            <strong>{request.machine_name}</strong>: {request.maintenance_type} <br />
                            <small><strong>Requested by:</strong> {request.performed_by}</small> <br />
                            <small><strong>Maintenance Details:</strong> {request.maintenance_details}</small> <br />
                            <button onClick={() => handleApprove(request.history_id)}>
                                Approve
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default PendingApproval;
