const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js'); // Ensure CryptoJS is installed
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST||"localhost",
    port: process.env.DB_PORT||"3306",
    user: process.env.DB_USER||"root",
    password: process.env.DB_PASSWORD||"Apple123@",
    database: process.env.DB_NAME||"titan_factory",
});
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
  const query = 'SELECT * FROM User WHERE email = ? AND password = ?';

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

      const insertQuery = 'INSERT INTO User (first_name, last_name, email, password, role, hire_date, currently_employed, address, phone_number) VALUES (?, ?, ?, ?, ?, NOW(), TRUE, ?, ?)';

      db.query(insertQuery, [firstName, lastName, email, password, role, address, phoneNumber], (err, results) => {
          if (err) {
              console.error('Error adding user:', err); // Log error details
              return res.status(500).json({ error: 'Error adding user', details: err });
          }
          res.json({ message: 'User added successfully' });
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

      // Insert new factory into the Factory table
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

// Serve React app for any unmatched routes
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

