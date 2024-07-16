import React from "react";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { Modal } from 'antd';
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      onOk: () => {
        axios.get('https://backend.hyperial.my.id/logout')
          .then(response => {
            if (response.status === 200) {
              localStorage.removeItem('token'); // Clear token from local storage
              localStorage.removeItem('role');  // Clear role from local storage
              navigate('/loginAdmin', { replace: true }); // Redirect to login page and replace history
            }
          })
          .catch(error => {
            console.error('Error logging out:', error);
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <div className="navbar">
      <div className="navbarContainer">
        <div className="items">
          <div className="item">
            <HomeIcon className="icon" />
            <span className="welcome-text">Welcome back user, admin!</span>
          </div>
        </div>
        <div className="logout" onClick={handleLogout}>
          <LogoutIcon className="icon logoutIcon" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
