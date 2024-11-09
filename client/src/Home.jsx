import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ email, loggedIn, setLoggedIn, role }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        setLoggedIn(false);
        navigate('/login');
    };

    const handleAddUser = () => {
        navigate('/add-user');
    };

    const handleAssignDepartment = () => {
        navigate('/assign-department');
    };

    const handleTerminateEmployee = () => {
        navigate('/terminate-employee');
    };

    const handleViewAttendance = () => {
        navigate('/attendance-history');
    };

    const handleMarkAttendance = () => {
        navigate('/mark-attendance');
    };

    const styles = {
        container: { padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
        title: { color: '#333', marginBottom: '30px' },
        adminPanel: { marginTop: '20px' },
        adminControls: { backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' },
        buttonGroup: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' },
        button: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s' },
        adminButton: { backgroundColor: '#4CAF50', color: 'white' },
        logoutButton: { backgroundColor: '#f44336', color: 'white' },
        loginButton: { backgroundColor: '#2196F3', color: 'white' },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome {loggedIn ? email : 'Guest'}</h1>
            
            {loggedIn ? (
                <div style={styles.panel}>
                    {role === 'admin' && (
                        <div style={styles.controls}>
                            <h2>Admin Controls</h2>
                            <div style={styles.buttonGroup}>
                                <button style={styles.button} onClick={handleAddUser}>Add User</button>
                                <button style={styles.button} onClick={handleAssignDepartment}>Assign Department</button>
                                <button style={styles.button} onClick={handleTerminateEmployee}>Terminate Employee</button>
                                <button style={styles.button} onClick={handleViewAttendance}>View Attendance</button>
                            </div>
                        </div>
                    )}

                    {role === 'manager' && (
                        <div style={styles.controls}>
                            <h2>Manager Controls</h2>
                            <div style={styles.buttonGroup}>
                                <button style={styles.button} onClick={handleAssignDepartment}>Assign Department</button>
                                <button style={styles.button} onClick={handleViewAttendance}>View Attendance</button>
                            </div>
                        </div>
                    )}

                    {/* Display "Mark Attendance" button for roles that can mark attendance */}
                    {['admin', 'manager', 'sales', 'employee', 'maintenance_staff'].includes(role) && (
                        <div style={styles.controls}>
                            <button style={styles.button} onClick={handleMarkAttendance}>Mark Attendance</button>
                        </div>
                    )}

                    <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button style={{ ...styles.button, backgroundColor: '#2196F3', color: 'white' }} onClick={() => navigate('/login')}>
                    Login
                </button>
            )}
        </div>
    );
}

export default Home;
