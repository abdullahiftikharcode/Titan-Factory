// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function Login({ setLoggedIn, setEmail, setRole }) {
//   const [emailInput, setEmailInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3001/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: emailInput, password: passwordInput }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setEmail(emailInput);
//         setRole(data.role); // Set role from server response
//         setLoggedIn(true);
//         localStorage.setItem('token', data.token); // Store token in local storage
//         localStorage.setItem('email', emailInput); // Store email in local storage
//         localStorage.setItem('role', data.role); // Store role in local storage
//         alert(data.message);
//         navigate('/'); // Redirect to Home page on successful login
//       } else {
//         const errorData = await response.json();
//         alert(errorData.error); // Show "Verification failed" message
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={emailInput}
//             onChange={(e) => setEmailInput(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={passwordInput}
//             onChange={(e) => setPasswordInput(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Login({ setLoggedIn, setEmail, setRole }) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setEmail(emailInput);
        setRole(data.role);
        setLoggedIn(true);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', emailInput);
        localStorage.setItem('role', data.role);
        alert(data.message);
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;





