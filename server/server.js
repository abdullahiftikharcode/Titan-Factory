const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js'); 
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const util = require('util');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const queryAsync = util.promisify(db.query).bind(db);
const publicKey = fs.readFileSync(path.join(__dirname, 'public-key.pem'), 'utf8');
const privateKey = fs.readFileSync(path.join(__dirname, 'private-key.pem'), 'utf8');

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.code, err.sqlMessage);
        return;
    }
    console.log('Connected to MySQL');
});

// Encryption and Decryption Functions
function encrypt(data, key) {
    return CryptoJS.AES.encrypt(data, key).toString();
}

function decrypt(cipherText, key) {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        if (bytes.sigBytes > 0) {
            return bytes.toString(CryptoJS.enc.Utf8);
        } else {
            throw new Error('Decryption Failed Invalid Key');
        }
    } catch (error) {
        throw new Error('Decryption Failed Invalid Key');
    }
}

// Define API endpoint for login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Query to fetch the user and their role
  const query = `
    SELECT u.user_id, u.email, u.password, r.role_name AS role 
    FROM User u 
    JOIN roles r ON u.role_id = r.role_id 
    WHERE u.email = ? AND u.password = ?
  `;

  db.query(query, [email, password], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Server error' });
      }

      if (results.length > 0) {
          const user = results[0];
          const token = jwt.sign(
              { userId: user.user_id, role: user.role },
              privateKey,
              { algorithm: 'RS256', expiresIn: '1h' }
          );

          res.json({
              message: 'Successfully logged in',
              token,
              role: user.role,
              userId: user.user_id
          });
      } else {
          res.status(401).json({ error: 'Verification failed' });
      }
  });
});


// Define API endpoint for adding a user
app.post('/add-user', (req, res) => {
  const { encryptedData, key } = req.body; // Accept encrypted data
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token and get user role
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      if (userRole !== 'admin') {
          return res.status(403).json({ error: 'Forbidden: Only admins can add users' });
      }
     
      // Decrypt the incoming data
      const decryptedData = decrypt(encryptedData, key);
      const { firstName, lastName, email, password, role, address, phoneNumber } = JSON.parse(decryptedData); // Parse decrypted data
      
      const getRoleIdQuery = 'SELECT role_id FROM roles WHERE role_name = ?';
      
      db.query(getRoleIdQuery, [role], (err, results) => {
          if (err) {
              console.error('Error fetching role_id:', err);
              return res.status(500).json({ error: 'Error fetching role_id' });
          }
          
          if (results.length === 0) {
              return res.status(400).json({ error: 'Invalid role name' });
          }

          const roleId = results[0].role_id;

      const insertQuery = 'INSERT INTO User (first_name, last_name, email, password, role_id, hire_date, currently_employed, address, phone_number) VALUES (?, ?, ?, ?, ?, NOW(), TRUE, ?, ?)';

      db.query(insertQuery, [firstName, lastName, email, password, roleId, address, phoneNumber], (err, results) => {
          if (err) {
              console.error('Error adding user:', err); // Log error details
              return res.status(500).json({ error: 'Error adding user', details: err });
          }
          res.json({ message: 'User added successfully' });
      });
    });
  });
});
// Add these endpoints to your server.js file

// Fetch employees without departments
app.get('/employees-without-department', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can access this information' });
    }

    const query = 'SELECT id, first_name, last_name, email FROM User WHERE department_id IS NULL';

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    });
  });
});
// Fetch all departments
app.get('/departments', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can access this information' });
    }

    const query = 'SELECT department_id, department_name FROM Department';

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    });
  });
});

// Update the assign-department endpoint
// Update the assign-department endpoint to handle job_title
app.post('/assign-department', (req, res) => {
  const { userId, departmentId, jobTitle } = req.body; // Add jobTitle to request body
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can assign departments' });
    }

    // Update query to set both department_id and job_title
    const query = 'UPDATE User SET department_id = ?, job_title = ? WHERE user_id = ?';

    db.query(query, [departmentId, jobTitle, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Department and job title assigned successfully' });
    });
  });
});
// Define API endpoint for terminating an employee
app.post('/terminate-employee', (req, res) => {
  const { userId } = req.body; // Assuming you will send userId in the request body
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Only admins can terminate employees' });
    }

    const query = 'UPDATE User SET currently_employed = 0, termination_date = NOW() WHERE user_id = ?';

    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee terminated successfully' });
    });
  });
});

// Fetch attendance records for a specific user ID
app.get('/attendance/:userId', (req, res) => {
  const userId = req.params.userId;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      // Check if the user role is either 'admin' or 'manager'
      if (userRole !== 'admin' && userRole !== 'manager') {
          return res.status(403).json({ error: 'Forbidden: Only admins and managers can access attendance records' });
      }

      // Query to fetch attendance records for the specified user ID
      const query = 'SELECT * FROM Attendance WHERE user_id = ?';

      db.query(query, [userId], (err, results) => {
          if (err) {
              return res.status(500).json({ error: 'Server error' });
          }
          if (results.length === 0) {
              return res.status(404).json({ error: 'No attendance records found for this user' });
          }
          res.json(results);
      });
  });
});

// Define API endpoint for employee check-in
app.post('/attendance/checkin', (req, res) => {
  const { remarks } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;
      const userId = decoded.userId; // Extract userId from the decoded token

      // Allow only specific roles to check in
      const allowedRoles = ['sales', 'maintenance_staff', 'admin', 'manager', 'employee'];
      if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ error: 'Forbidden: Only authorized roles can mark attendance' });
      }

      // Insert attendance record with user_id
      const query = 'INSERT INTO Attendance (user_id, date, check_in_time, status, remarks) VALUES (?, NOW(), NOW(), "present", ?)';

      db.query(query, [userId, remarks], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Server error' });
          }
          res.json({ message: 'Checked in successfully' });
      });
  });
});

// Endpoint for check-out
app.post('/attendance/checkout', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;
      const userId = decoded.userId; // Extract userId from the decoded token

      // Allow only specific roles to check out
      const allowedRoles = ['sales', 'maintenance_staff', 'admin', 'manager', 'employee'];
      if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({ error: 'Forbidden: Only authorized roles can mark attendance' });
      }

      // Update attendance record with user_id for the current day
      const query = 'UPDATE Attendance SET check_out_time = NOW() WHERE user_id = ? AND date = CURDATE() AND check_out_time IS NULL';

      db.query(query, [userId], (err, result) => {
          if (err) {
              return res.status(500).json({ error: 'Server error' });
          }
          if (result.affectedRows === 0) {
              return res.status(404).json({ error: 'No check-in record found for today' });
          }
          res.json({ message: 'Checked out successfully' });
      });
  });
});




// Define API endpoint to add a new factory
app.post('/add-factory', (req, res) => {
  const { factory_name, location, manager_id, established_date, capacity, description } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token and get user role
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      // Only allow admins to add factories
      if (userRole !== 'admin') {
          return res.status(403).json({ error: 'Forbidden: Only admins can add factories' });
      }

      // Check if the manager_id corresponds to a manager
      const checkManagerQuery = `SELECT role FROM User WHERE user_id = ?`;

      db.query(checkManagerQuery, [manager_id], (err, result) => {
          if (err) {
              console.error('Error checking manager role:', err);
              return res.status(500).json({ error: 'Error checking manager role', details: err });
          }

          if (result.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }

          const managerRole = result[0].role;

          if (managerRole !== 'manager') {
              return res.status(400).json({ error: 'Only users with the "manager" role can be assigned as factory managers' });
          }

          // Proceed to insert the new factory into the Factory table
          const insertQuery = `
              INSERT INTO Factory (factory_name, location, manager_id, established_date, capacity, description)
              VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.query(insertQuery, [factory_name, location, manager_id, established_date, capacity, description], (err, result) => {
              if (err) {
                  console.error('Error adding factory:', err); // Log error details
                  return res.status(500).json({ error: 'Error adding factory', details: err });
              }
              res.json({ message: 'Factory added successfully' });
          });
      });
  });
});


// Define API endpoint for adding a department
app.post('/add-department', (req, res) => {
  const { departmentName, location, description } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (!departmentName || !location || !description) {
      return res.status(400).json({ error: 'Department name, location, and description are required' });
  }

  // Verify the JWT token to ensure the user is authorized
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    // Check if the user is an admin
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Only admins can add departments' });
    }

    // Proceed with adding the department without manager_id
    const insertQuery = 'INSERT INTO Department (department_name, location, description) VALUES (?, ?, ?)';

    db.query(insertQuery, [departmentName, location, description], (err, results) => {
        if (err) {
            console.error('Error adding department:', err);
            return res.status(500).json({ error: 'Error adding department' });
        }
        res.json({ message: 'Department added successfully' });
    });
  });
});

app.get('/get-factories', (req, res) => {
  const query = 'SELECT factory_id, factory_name FROM Factory'; // Assuming Factory table has factory_id and factory_name

  db.query(query, (err, result) => {
      if (err) {
          console.error('Error fetching factories: ', err);
          return res.status(500).json({ error: 'Failed to fetch factories' });
      }
      res.status(200).json(result); // Send back the factories as a JSON response
  });
});

app.post('/add-machine', (req, res) => {
  const {
    machineName, model, serialNumber, status,
    lastMaintenanceDate, purchaseDate, warrantyExpiry, factoryId, location
  } = req.body;

  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    // Check if the user is an admin or manager
    if (userRole !== 'admin' && userRole !== 'manager') {
        return res.status(403).json({ error: 'Forbidden: Only admins and managers can add machines' });
    }

    // Calculate the next maintenance due date (30 days after lastMaintenanceDate)
    const lastMaintenance = new Date(lastMaintenanceDate);
    const nextMaintenanceDue = new Date(lastMaintenance);
    nextMaintenanceDue.setDate(lastMaintenance.getDate() + 30); // Add 30 days to lastMaintenanceDate

    const query = `
      INSERT INTO Machine (machine_name, model, serial_number, status,
                           last_maintenance_date, next_maintenance_due, purchase_date,
                           warranty_expiry, factory_id, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      machineName, model, serialNumber, status,
      lastMaintenanceDate, nextMaintenanceDue, purchaseDate,
      warrantyExpiry, factoryId, location
    ], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to add machine' });
      }
      res.status(200).json({ message: 'Machine added successfully' });
    });
  });
});


app.get('/get-managers', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      if (userRole !== 'admin') {
          return res.status(403).json({ error: 'Forbidden: Only admins can access this information' });
      }

      const query = `
          SELECT u.user_id
          FROM User u
          JOIN Roles r ON u.role_id = r.role_id
          WHERE r.role_name = 'manager'
      `;

      db.query(query, (err, results) => {
          if (err) {
              console.error('Error fetching manager IDs:', err);
              return res.status(500).json({ error: 'Internal server error' });
          }

          // Send the list of manager IDs as a response
          res.status(200).json(results);
      });
  });
});



app.get('/api/roles', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      if (userRole !== 'admin') {
          return res.status(403).json({ error: 'Forbidden: Only admins can access this information' });
      }

      const query = 'SELECT role_id, role_name FROM Roles';

      db.query(query, (err, results) => {
          if (err) {
              console.error('Error fetching roles:', err);
              return res.status(500).json({ error: 'Server error' });
          }
          res.json(results);
      });
  });
});
app.post('/add-notification', (req, res) => {
  const { message, targetRole, notificationType } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      // Check if the user is an admin or manager
      if (userRole !== 'admin' && userRole !== 'manager') {
          return res.status(403).json({ error: 'Forbidden: Only admins and managers can add notifications' });
      }

      // Add notification
      const userId = decoded.userId; // Assuming the user ID is in the decoded JWT payload
      const createdAt = new Date(); // Set current date and time for creation

      // Validate targetRole and notificationType
      const validTargetRoles = ['admin', 'manager', 'employee', 'maintenance_staff', 'sales', 'all'];
      const validNotificationTypes = ['alert', 'reminder', 'info', 'warning'];

      if (!validTargetRoles.includes(targetRole)) {
          return res.status(400).json({ error: 'Invalid target role' });
      }

      if (!validNotificationTypes.includes(notificationType)) {
          return res.status(400).json({ error: 'Invalid notification type' });
      }

      // Insert the notification into the database
      const query = `
          INSERT INTO Notification (user_id, message, created_at, target_role, notification_type)
          VALUES (?, ?, ?, ?, ?)
      `;

      db.query(query, [
          userId, message, createdAt, targetRole, notificationType
      ], (err, result) => {
          if (err) {
              console.error('Error inserting notification:', err);
              return res.status(500).json({ error: 'Failed to add notification' });
          }
          res.status(200).json({ message: 'Notification added successfully' });
      });
  });
});

app.get('/get-notifications', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify the JWT token
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      // Fetch notifications based on user role
      const query = `
          SELECT * FROM notification
          WHERE target_role = ? OR target_role = 'all'
          ORDER BY created_at DESC
      `;

      db.query(query, [userRole], (err, results) => {
          if (err) {
              console.error('Error fetching notifications:', err);
              return res.status(500).json({ error: 'Failed to fetch notifications' });
          }

          if (results.length === 0) {
              return res.status(404).json({ message: 'No notifications found' });
          }

          res.status(200).json({
              notifications: results
          });
      });
  });
});

// Get all pending maintenance requests (where manager_approval_id is NULL)
app.get('/get-pending-maintenance', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;

      // Only allow access to managers and admins
      if (userRole !== 'manager' && userRole !== 'admin') {
          return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
      }

      const sql = `
          SELECT m.maintenance_id as history_id, m.machine_id, m.performed_by, m.maintenance_date, m.maintenance_details,
                 m.maintenance_type, m.maintenance_cost, m.manager_approval_id, mc.machine_name
          FROM Machine_Maintenance_History m
          JOIN Machine mc ON mc.machine_id = m.machine_id
          WHERE m.manager_approval_id IS NULL
      `;

      db.query(sql, (err, results) => {
          if (err) {
              console.error('Error fetching maintenance requests:', err);
              return res.status(500).json({ error: 'Failed to fetch maintenance requests' });
          }

          if (results.length === 0) {
              return res.status(404).json({ message: 'No pending maintenance requests found' });
          }

          res.status(200).json({ requests: results });
      });
  });
});
app.get('/get-machines', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    // Allow access only to managers and admins
    if (userRole !== 'manager' && userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    const sql = `
      SELECT machine_id,status
      FROM Machine
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching machine list:', err);
        return res.status(500).json({ error: 'Failed to fetch machine list' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No machines found' });
      }

      res.status(200).json({ machines: results });
    });
  });
});
app.get('/pending-maintenance', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify JWT token
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    const userRole = decoded.role;

    // Allow access only to admins, managers, and maintenance staff
    if (!['admin', 'manager', 'maintenance_staff'].includes(userRole)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    // SQL query to select pending maintenance tasks
    const sql = `
      SELECT machine_id, maintenance_date, maintenance_details, maintenance_type
      FROM  Machine_Maintenance_History
      WHERE next_maintenance_date IS NULL and manager_approval_id IS NOT NULL;
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching pending maintenance:', err);
        return res.status(500).json({ error: 'Failed to fetch pending maintenance tasks' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No pending maintenance tasks found' });
      }

      res.status(200).json({ pendingMaintenances: results });
    });
  });
});

// Approve a maintenance request (manager or admin approval)
app.put('/approve-maintenance/:history_id', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          console.error('Token verification error:', err);
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userRole = decoded.role;
      const { history_id } = req.params;
      const { manager_approval_id } = req.body; // No need for new_status since we're updating maintenance_date

      // Only allow managers and admins to approve maintenance requests
      if (userRole !== 'manager' && userRole !== 'admin') {
          return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
      }

      // Validate required fields
      if (!manager_approval_id) {
          return res.status(400).json({ message: 'Missing approval information' });
      }

      // Update maintenance_date to NOW() when the request is approved
      const sql = `
          UPDATE Machine_Maintenance_History
          SET manager_approval_id = ?, maintenance_date = NOW()
          WHERE  maintenance_id = ? AND manager_approval_id IS NULL
      `;

      db.query(sql, [manager_approval_id, history_id], (err, result) => {
          if (err) {
              console.error('Error approving maintenance request:', err);
              return res.status(500).json({ error: 'Failed to approve maintenance request' });
          }

          if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'Request not found or already approved' });
          }

          res.status(200).json({ message: 'Maintenance request approved successfully' });
      });
  });
});

app.post('/add-maintenance', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    // Extract user information from the decoded JWT (assuming it contains the user's ID and role)
    const userId  = decoded.userId;
    const { machine_id, description, maintenance_date, maintenance_type, status } = req.body;

    if (status !== 'active') {
      // Insert into maintenance history if machine is not active
      const insertHistoryQuery = `
        INSERT INTO Machine_Maintenance_History 
        (machine_id, maintenance_date, maintenance_details, maintenance_type, performed_by) 
        VALUES (?, ?, ?, ?, ?)
      `;

      const updateMachineQuery = `
        UPDATE Machine 
        SET status = ? 
        WHERE machine_id = ?
      `;
      db.query(
        insertHistoryQuery,
        [machine_id, maintenance_date, description, maintenance_type, userId],
        (err, result) => {
          if (err) {
            console.error('Error adding to maintenance history:', err);
            return res.status(500).json({ error: 'Failed to add maintenance history' });
          }


          // Check if result has affected rows to ensure the insert was successful
          if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'Failed to insert into maintenance history' });
          }

          // Update the machine status if necessary
          db.query(updateMachineQuery, ['maintenance', machine_id], (err, result) => {
            if (err) {
              console.error('Error updating machine status:', err);
              return res.status(500).json({ error: 'Failed to update machine status' });
            }

            res.status(200).json({ message: 'Maintenance record added to history and machine status updated' });
          });
        }
      );
    } else {
      // Update last and next maintenance dates if the machine is active
      const currentDate = new Date().toISOString().split('T')[0];
      const nextMaintenanceDate = new Date(
        new Date(currentDate).setMonth(new Date(currentDate).getMonth() + 1)
      ).toISOString().split('T')[0]; // Assuming 1 month for the next maintenance

      const updateMachineQuery = `
        UPDATE Machine 
        SET last_maintenance_date = ?, next_maintenance_due = ? 
        WHERE machine_id = ?
      `;

      db.query(
        updateMachineQuery,
        [currentDate, nextMaintenanceDate, machine_id],
        (err, result) => {
          if (err) {
            console.error('Error updating maintenance dates:', err);
            return res.status(500).json({ error: 'Failed to update maintenance dates' });
          }

          res.status(200).json({
            message: 'Machine maintenance dates updated successfully',
            last_maintenance_date: currentDate,
            next_maintenance_date: nextMaintenanceDate,
          });
        }
      );
    }
  });
});


app.post('/update-maintenance', (req, res) => { 
  // Extract the JWT token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify the token using JWT
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }

    // Extract user information from the decoded JWT (assuming it contains the user's ID and role)
    const userId = decoded.userId;
    const { machine_id, status, maintenance_cost } = req.body;

    // Check if the required fields are provided
    if (!machine_id || !status || maintenance_cost === undefined) {
      return res.status(400).json({ error: 'Machine ID, status, and maintenance cost are required' });
    }

    // Query the machine table to check the current status of the machine
    db.query('SELECT status FROM machine WHERE machine_id = ?', [machine_id], (err, result) => {
      if (err) {
        console.error('Error checking machine status:', err);
        return res.status(500).json({ error: 'Failed to check machine status' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Machine not found' });
      }

      const currentStatus = result[0].status;

      // Ensure the machine is not already active before proceeding with the update
      if (currentStatus === 'active' && status === 'active') {
        return res.status(400).json({ error: 'Machine is already active, no need to update to active again' });
      }

      const today = new Date().toISOString().split('T')[0]; // Current date for maintenance
      const nextMaintenanceDate = new Date(
        new Date(today).setMonth(new Date(today).getMonth() + 1)
      ).toISOString().split('T')[0]; // Set next maintenance date to 1 month ahead

      // Update the machine status
      let updateMachineQuery = '';
      if (status === 'decommissioned') {
        updateMachineQuery = `
          UPDATE machine
          SET status = ?, next_maintenance_due = NULL
          WHERE machine_id = ?
        `;
      } else if (status === 'active') {
        updateMachineQuery = `
          UPDATE machine
          SET status = ?, last_maintenance_date = ?, next_maintenance_due = ?
          WHERE machine_id = ?
        `;
      } else {
        return res.status(400).json({ error: 'Invalid status value, must be either "active" or "decommissioned"' });
      }

      // Update the machine status and maintenance dates
      db.query(updateMachineQuery, [status, today, nextMaintenanceDate, machine_id], (err, result) => {
        if (err) {
          console.error('Error updating machine status:', err);
          return res.status(500).json({ error: 'Failed to update machine status' });
        }

        // Update the machine maintenance history for the existing machine entry
        const updateHistoryQuery = `
          UPDATE machine_maintenance_history
          SET performed_by = ?, next_maintenance_date =  NOW(), maintenance_cost = ?
          WHERE machine_id = ?
        `;

        db.query(updateHistoryQuery, [userId, maintenance_cost, machine_id], (err, result) => {
          if (err) {
            console.error('Error updating maintenance history:', err);
            return res.status(500).json({ error: 'Failed to update maintenance history' });
          }

          res.status(200).json({ message: 'Machine status and maintenance history updated successfully' });
        });
      });
    });
  });
});

app.get('/payroll', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
          return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }

      const userId = decoded.userId; // Extract user_id from the token

      const query = `
          SELECT payroll_id, basic_salary, overtime_hours, overtime_rate, bonuses, deductions, tax, net_salary, 
                 payment_date, bank_account_number, payment_method, payment_status
          FROM Payroll
          WHERE user_id = ?
      `;

      db.query(query, [userId], (err, results) => {
          if (err) {
              console.error('Error fetching payroll information:', err);
              return res.status(500).json({ error: 'Server error' });
          }

          if (results.length === 0) {
              return res.status(404).json({ error: 'No payroll information found for the current user.' });
          }

          res.status(200).json(results);
      });
  });
});

// Serve React app for any unmatched routes
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

