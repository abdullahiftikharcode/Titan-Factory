import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import ShowNotification from './ShowNotification';
import './Home.css';

function Home({ email, loggedIn, setLoggedIn, role }) {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem('token'));
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        setLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

                if (decodedToken.exp < currentTime) {
                    // Token has expired
                    handleLogout();
                } else {
                    // Set a timer to log out the user when the token expires
                    const timeUntilExpiry = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds
                    const timer = setTimeout(() => {
                        handleLogout();
                    }, timeUntilExpiry);

                    return () => clearTimeout(timer); // Clear timeout on component unmount
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                handleLogout(); // Log out if there's an issue with the token
            }
        }
    }, [token]); // Add token as a dependency

    const navigationHandlers = {
        addUser: () => navigate('/add-user'),
        assignDepartment: () => navigate('/assign-department'),
        terminateEmployee: () => navigate('/terminate-employee'),
        addDepartment: () => navigate('/add-department'),
        viewAttendance: () => navigate('/attendance-history'),
        markAttendance: () => navigate('/mark-attendance'),
        addFactory: () => navigate('/add-factory'),
        addMachine: () => navigate('/add-machine'),
        addNotification: () => navigate('/add-notification'),
        addMaintenance: () => navigate('/add-maintenance'),
        updateMaintenance: () => navigate('/update-maintenance'),
        pendingApprovals: () => navigate('/pending-approvals'),
        pendingMaintenance: () => navigate('/pending-maintenance'),
        showPayroll: () => navigate('/show-payroll'), // Added navigation for ShowPayroll page
    };

    const handleToggleNotifications = () => setShowNotifications((prev) => !prev);

    const renderButtons = (buttons) =>
        buttons.map(({ label, action, className }) => (
            <button key={label} className={`button ${className}`} onClick={action}>
                {label}
            </button>
        ));

    const adminButtons = [
        { label: 'Add User', action: navigationHandlers.addUser, className: 'adminButton' },
        { label: 'Add Department', action: navigationHandlers.addDepartment, className: 'adminButton' },
        { label: 'Assign Department', action: navigationHandlers.assignDepartment, className: 'adminButton' },
        { label: 'Terminate Employee', action: navigationHandlers.terminateEmployee, className: 'adminButton' },
        { label: 'View Attendance', action: navigationHandlers.viewAttendance, className: 'adminButton' },
        { label: 'Add Factory', action: navigationHandlers.addFactory, className: 'adminButton' },
        { label: 'Add Machine', action: navigationHandlers.addMachine, className: 'adminButton' },
        { label: 'Add Notification', action: navigationHandlers.addNotification, className: 'notificationButton' },
        { label: 'Pending Approvals', action: navigationHandlers.pendingApprovals, className: 'adminButton' },
        { label: 'Add Maintenance', action: navigationHandlers.addMaintenance, className: 'roleButton' },
        { label: 'Update Maintenance', action: navigationHandlers.updateMaintenance, className: 'roleButton' },
        { label: 'Pending Maintenance', action: navigationHandlers.pendingMaintenance, className: 'roleButton' },
    ];

    const managerButtons = [
        { label: 'Assign Department', action: navigationHandlers.assignDepartment, className: 'adminButton' },
        { label: 'View Attendance', action: navigationHandlers.viewAttendance, className: 'adminButton' },
        { label: 'Add Machine', action: navigationHandlers.addMachine, className: 'adminButton' },
        { label: 'Add Notification', action: navigationHandlers.addNotification, className: 'notificationButton' },
        { label: 'Pending Approvals', action: navigationHandlers.pendingApprovals, className: 'adminButton' },
        { label: 'Add Maintenance', action: navigationHandlers.addMaintenance, className: 'roleButton' },
        { label: 'Update Maintenance', action: navigationHandlers.updateMaintenance, className: 'roleButton' },
        { label: 'Pending Maintenance', action: navigationHandlers.pendingMaintenance, className: 'roleButton' },
    ];

    const maintenanceButtons = [
        { label: 'Add Maintenance', action: navigationHandlers.addMaintenance, className: 'roleButton' },
        { label: 'Update Maintenance', action: navigationHandlers.updateMaintenance, className: 'roleButton' },
        { label: 'Pending Maintenance', action: navigationHandlers.pendingMaintenance, className: 'roleButton' },
    ];

    const markAttendanceButton = (
        <button className="button roleButton" onClick={navigationHandlers.markAttendance}>
            Mark Attendance
        </button>
    );

    const payrollButton = (
        <button className="button roleButton" onClick={navigationHandlers.showPayroll}>
            Show Payroll
        </button>
    );

    return (
        <div className="container">
            <h1 className="title">Welcome {loggedIn ? email : 'Guest'}</h1>

            {loggedIn ? (
                <div className="adminPanel">
                    {role === 'admin' && (
                        <div className="adminControls">
                            <h2>Admin Controls</h2>
                            <div className="buttonGroup">{renderButtons(adminButtons)}</div>
                        </div>
                    )}

                    {role === 'manager' && (
                        <div className="adminControls">
                            <h2>Manager Controls</h2>
                            <div className="buttonGroup">{renderButtons(managerButtons)}</div>
                        </div>
                    )}

                    {role === 'maintenance_staff' && (
                        <div className="adminControls">
                            <h2>Maintenance Staff Controls</h2>
                            <div className="buttonGroup">{renderButtons(maintenanceButtons)}</div>
                        </div>
                    )}

                    {['admin', 'manager', 'sales', 'employee', 'maintenance_staff'].includes(role) && (
                        <div className="adminControls">
                         {markAttendanceButton}
                            {payrollButton} {/* Added the Show Payroll button */}
                        </div>
                    )}

                    <div className="adminControls">
                        <button className="button notificationButton" onClick={handleToggleNotifications}>
                            {showNotifications ? 'Hide Notifications' : 'Show Notifications'}
                        </button>
                    </div>

                    {showNotifications && (
                        <ShowNotification token={token} isVisible={showNotifications} onClose={handleToggleNotifications} />
                    )}

                    <button className="button logoutButton" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            ) : (
                <button className="button loginButton" onClick={() => navigate('/login')}>
                    Login
                </button>
            )}
        </div>
    );
}

export default Home;
