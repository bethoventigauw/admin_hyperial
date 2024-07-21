import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { notification } from "antd";
import './LoginAdmin.css';

function Login() {
  const [values, setValues] = useState({
    Email: '',
    Password: '',
  });
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const openNotification = (type, message) => {
    notification[type]({
      message: type === 'success' ? 'Login Successful' : 'Login Failed',
      description: message,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values); // Print values to ensure data is being sent

    axios.post('https://admin.hyperial.my.id/loginAdmin', values) // Updated URL for admin login
      .then(res => {
        console.log(res.data); // Print response from server
        if (res.data.valid) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role); // Store user role

          if (res.data.role === 'admin') {
            openNotification('success', 'Welcome Back!');
            setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
          } else {
            openNotification('error', "Not authorized as admin.");
          }
        } else {
          openNotification('error', "Invalid credentials. Please try again.");
        }
      })
      .catch(err => {
        openNotification('error', "Input a valid email and password!");
        console.log(err);
      });
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Admin Login</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              placeholder="Enter your email"
              value={values.Email}
              onChange={handleInput}
              required
            />
            <FaUser className="icon"/>

          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Enter your password"
              value={values.Password}
              onChange={handleInput}
              required
            />
            <FaLock className="icon"/>

          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">
         <Link to="https://hyperial.my.id">Back to Landing Page</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
