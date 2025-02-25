# TitanFactory: Industrial Management Reinvented with Technology

## Project Overview

TitanFactory is a comprehensive industrial management system designed to optimize factory operations through AI and automation. The platform enhances efficiency, decision-making, and automation across departments, covering:

- **Factory operations**
- **Employee management**
- **Machine maintenance**
- **Attendance tracking**
- **Sales reporting**
- **Payroll automation**

## Key Technologies

- **Backend:** Node.js (Express.js)
- **Frontend:** React (Vite)
- **Database:** MySQL
- **AI Integration:** Python-based predictive models & chatbot

## Core Features

### 🔹 User Management & Authentication
- Secure, role-based access control

### 🔹 Machine Management
- Monitor machine status, maintenance schedules, and log activity

### 🔹 Attendance Tracking
- Automated employee check-ins/outs & attendance status updates

### 🔹 Sales Reporting
- AI-driven sales reports, trend forecasting, and performance tracking

### 🔹 AI Chatbot
- Assists users in system navigation and task execution

### 🔹 Notifications System
- Real-time alerts for task assignments, maintenance, and approvals

### 🔹 Payroll Management
- Automates payroll calculations based on work hours, overtime, bonuses, and deductions

### 🔹 Role Management
- Define user access levels for different roles (admin, factory manager, IT team, sales staff, etc.)

## System Roles

### Primary Users (Direct System Users)

- **Admin:** Manages configurations, user roles, and high-level reports
- **Factory Manager:** Oversees operations, approves maintenance, and generates reports
- **Employees:** Logs attendance and interacts with the chatbot
- **Sales Team:** Tracks sales data, generates reports, and uses AI for predictions
- **IT Team:** Manages system configurations and technical support

### Secondary Users (Indirect Interactions)

- **HR Department:** Accesses attendance and payroll data
- **Senior Management:** Receives reports and forecasts for decision-making
- **Maintenance Staff:** Logs machine maintenance tasks assigned by the factory manager

### System Administrators

- **Database Administrators:** Manages database security, backups, and optimization
- **System Maintenance Team:** Ensures uptime, handles updates, and monitors system performance

## Setup Instructions

### Backend (Node.js)

```sh
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Set up environment variables in a `.env` file
cat <<EOT >> .env
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=titanfactory_db
EOT

# Start the backend server
npm start
```

### Frontend (React)

```sh
# Navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Database (MySQL)

```sh
# Import the database schema
mysql -u root -p < schema.sql

# Ensure database credentials match the backend `.env` file settings
```

## Future Scope

- Integration with real-time IoT for machine monitoring
- Advanced AI features for comprehensive automation
- Third-party integration with financial and HR systems


