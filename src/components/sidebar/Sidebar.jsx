import React, { useState } from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineInventory2 } from "react-icons/md";
import { PiUsersThree } from "react-icons/pi";
import { AiOutlineFundProjectionScreen, AiOutlineDashboard, AiOutlineShoppingCart } from "react-icons/ai";
// Import your logo image
import logo from '../../assets/images/hyperial_logo_only.png';
import toggleLogo from '../../assets/images/hyperial_logo_only.png'; // Adjust this path to your image

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="container">
      <div style={{ width: isOpen ? "250px" : "80px" }} className="Sidebar">
        <div className="top_section">
          <div className="sidebarHeader" onClick={toggle}>
            <img src={logo} alt="Hyperial Logo" className="logo" style={{ display: isOpen ? "block" : "none" }} />
            <div className="title" style={{ display: isOpen ? "block" : "none" }}>  
              Hyperial
            </div>
            <div className="bars" onClick={toggle}>
              {!isOpen && <img src={toggleLogo} alt="Toggle Logo" className="toggleLogo" />} {/* Display toggle logo when sidebar is closed */}
            </div>
          </div>
        </div>
        <div className="sidebarItems">
          
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div
              className={`sidebarItem ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => handleItemClick('dashboard')}
            >
              <AiOutlineDashboard className="icon" />
              <span style={{ display: isOpen ? "block" : "none" }}>Dashboard</span>
            </div>
          </Link>
          <Link to="/request" style={{ textDecoration: "none" }}>
            <div
              className={`sidebarItem ${location.pathname === '/request' ? 'active' : ''}`}
              onClick={() => handleItemClick('request')}
            >
              <AiOutlineShoppingCart className="icon" />
              <span style={{ display: isOpen ? "block" : "none" }}>Request</span>
            </div>
          </Link>
          <Link to="/inventory" style={{ textDecoration: "none" }}>
            <div
              className={`sidebarItem ${location.pathname === '/inventory' ? 'active' : ''}`}
              onClick={() => handleItemClick('inventory')}
            >
              <MdOutlineInventory2 className="icon" />
              <span style={{ display: isOpen ? "block" : "none" }}>Inventory</span>
            </div>
          </Link>
          <Link to="/project" style={{ textDecoration: "none" }}>
            <div
              className={`sidebarItem ${location.pathname === '/project' ? 'active' : ''}`}
              onClick={() => handleItemClick('project')}
            >
              <AiOutlineFundProjectionScreen className="icon" />
              <span style={{ display: isOpen ? "block" : "none" }}>Project</span>
            </div>
          </Link>
          <Link to="/userManagement" style={{ textDecoration: "none" }}>
            <div
              className={`sidebarItem ${location.pathname === '/userManagement' ? 'active' : ''}`}
              onClick={() => handleItemClick('userManagement')}
            >
              <PiUsersThree className="icon" />
              <span style={{ display: isOpen ? "block" : "none" }}>User Management</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
