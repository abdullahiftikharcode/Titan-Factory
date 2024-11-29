import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home.jsx';
import Login from './Login.jsx';
import AddUser from './AddUser.jsx';
import AddFactory from './AddFactory.jsx';
import AddMachine from './AddMachine.jsx';
import AssignDepartment from './AssignDepartment.jsx';
import TerminateEmployee from './TerminateEmployee';
import AttendanceHistory from './AttendanceHistory';
import MarkAttendance from './MarkAttendance.jsx';
import AddDepartment from './AddDepartment.jsx';
import AddNotification from './AddNotification.jsx';
import ShowNotifications from './ShowNotification.jsx';
import PendingApproval from './PendingApproval.jsx';
import AddMaintenance from './AddMaintenance.jsx';
import PendingMaintenance from './PendingMaintenance.jsx'; // Import the PendingMaintenance component
import UpdateMaintenance from './UpdateMaintenance.jsx'; // Import the UpdateMaintenance component
import ShowPayroll from './ShowPayroll.jsx'; // Import the new ShowPayroll component
import CryptoJS from 'crypto-js';
import './App.css';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');
        const storedRole = localStorage.getItem('role');

        if (token) {
            setLoggedIn(true);
            setEmail(storedEmail || '');
            setRole(storedRole || '');
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        setLoggedIn(false);
        setEmail('');
        setRole('');
    };

    const encryptData = (data, key) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    };

    const addUser = async (firstName, lastName, email, password, role, address, phoneNumber) => {
        const key = 'your-secret-key';
        const data = { firstName, lastName, email, password, role, address, phoneNumber };
        const encryptedData = encryptData(data, key);

        try {
            const response = await fetch('http://localhost:3001/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ encryptedData, key }),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result.message);
            } else {
                console.error('Error adding user:', result.error);
                console.error('Error details:', result.details);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const ProtectedRoute = ({ children, allowedRoles }) => {
        return allowedRoles.includes(role) ? children : <Navigate to="/" />;
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} role={role} />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} setRole={setRole} />} />

                    <Route path="/add-user" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddUser token={localStorage.getItem('token')} addUser={addUser} />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-factory" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddFactory token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-machine" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <AddMachine token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/assign-department" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AssignDepartment token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-department" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AddDepartment token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/terminate-employee" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <TerminateEmployee token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/attendance-history" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <AttendanceHistory token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/mark-attendance" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'sales', 'maintenance_staff', 'employee']}>
                            <MarkAttendance token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-notification" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <AddNotification token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/show-notifications" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'employee', 'sales', 'maintenance_staff']}>
                            <ShowNotifications token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/pending-approvals" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager']}>
                            <PendingApproval token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/add-maintenance" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'maintenance_staff']}>
                            <AddMaintenance token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/pending-maintenance" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'maintenance_staff']}>
                            <PendingMaintenance token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    <Route path="/update-maintenance" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'maintenance_staff']}>
                            <UpdateMaintenance token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />

                    {/* New route for ShowPayroll page */}
                    <Route path="/show-payroll" element={
                        <ProtectedRoute allowedRoles={['admin', 'manager', 'sales', 'employee', 'maintenance_staff']}>
                            <ShowPayroll token={localStorage.getItem('token')} />
                        </ProtectedRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
