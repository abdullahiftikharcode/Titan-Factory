import React, { useState } from 'react';
import './AttendanceHistory.css';  

const AttendanceHistory = () => {
    const [userId, setUserId] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [error, setError] = useState('');

    const fetchAttendance = async () => {
        try {
            const response = await fetch(`http://localhost:3001/attendance/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }

            const data = await response.json();
            setAttendanceData(data);
            setError('');
        } catch (error) {
            setError(error.message);
            setAttendanceData([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchAttendance();
    };

    return (
        <div className="attendance-container">
            <h2>Attendance History</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID"
                    required
                />
                <button type="submit">Fetch Attendance</button>
            </form>

            {error && <p>{error}</p>}

            {attendanceData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Attendance ID</th>
                            <th>User ID</th>
                            <th>Date</th>
                            <th>Check In Time</th>
                            <th>Check Out Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((record) => (
                            <tr key={record.attendance_id}>
                                <td>{record.attendance_id}</td>
                                <td>{record.user_id}</td>
                                <td>{record.date}</td>
                                <td>{record.check_in_time}</td>
                                <td>{record.check_out_time}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AttendanceHistory;
