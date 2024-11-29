import React, { useEffect, useState } from 'react';
import './notifications.css';

function ShowNotifications({ token, isVisible, onClose }) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:3001/get-notifications', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setNotifications(data.notifications);
                } else {
                    console.error('Error fetching notifications:', data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (isVisible) {
            fetchNotifications();
        }
    }, [token, isVisible]);

    const formatDate = (dateString) => {
        const isoDateString = dateString.replace(' ', 'T');
        const date = new Date(isoDateString);
        return isNaN(date) ? "Invalid date" : `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className={`notification-panel ${isVisible ? 'visible' : ''}`}>
            <div className="notification-header">
                <h2>Notifications</h2>
                <button className="close-button" onClick={onClose}>✖</button>
            </div>
            <div className="notification-content">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div className="notification-item" key={index}>
                            <p><strong>{notification.message}</strong></p>
                            <span className="notification-date">{formatDate(notification.created_at)}</span>
                        </div>
                    ))
                ) : (
                    <p className="no-notifications">No notifications available.</p>
                )}
            </div>
        </div>
    );
}

export default ShowNotifications;
