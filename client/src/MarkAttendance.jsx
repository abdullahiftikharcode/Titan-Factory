import React, { useState } from 'react';
import './MarkAttendance.css';  // Import the CSS file

function AttendancePage({ userId }) {
    const [remarks, setRemarks] = useState('');
    const [checkInStatus, setCheckInStatus] = useState('');
    const [checkOutStatus, setCheckOutStatus] = useState('');

    const handleCheckIn = async () => {
        try {
            const response = await fetch('http://localhost:3001/attendance/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ user_id: userId, remarks }), // Include user_id here
            });
            const data = await response.json();
            setCheckInStatus(data.message);
        } catch (error) {
            setCheckInStatus('Error during check-in');
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await fetch('http://localhost:3001/attendance/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ user_id: userId }), // Include user_id here
            });
            const data = await response.json();
            setCheckOutStatus(data.message);
        } catch (error) {
            setCheckOutStatus('Error during check-out');
        }
    };

    return (
        <div className="attendance-container">
            <h2>Attendance</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <textarea
                    placeholder="Add remarks (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows="3"
                    cols="30"
                ></textarea>
            </div>

            <button onClick={handleCheckIn}>
                Check In
            </button>
            <button onClick={handleCheckOut}>
                Check Out
            </button>

            <div className="status-message">
                {checkInStatus && <p className={checkInStatus.includes('Error') ? 'error' : ''}>{checkInStatus}</p>}
                {checkOutStatus && <p className={checkOutStatus.includes('Error') ? 'error' : ''}>{checkOutStatus}</p>}
            </div>
        </div>
    );
}

export default AttendancePage;
