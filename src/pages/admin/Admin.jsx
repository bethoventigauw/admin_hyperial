import React from 'react';
import './Admin.css';
import Sidebar from './../../components/sidebar/Sidebar';
import {Routes, Route, useLocation} from 'react-router-dom';
import Dashboard from './../../components/dashboard/Dashboard';
import Inventory from './../../components/inventory/Inventory';
import UserManagement from './../../components/userManagement/UserManagement';
import Report from './../../components/report/Report';
import Project from './../../components/project/Project';
import Request from './../../components/request/Request';
import Invoice from '../../components/invoice/Invoice';
import Navbar from '../../components/navbar/Navbar';
import LoginAdmin from '../../components/login/LoginAdmin';

const Admin = () => {
  const location = useLocation();

  const isLoginPage = location.pathname === '/loginAdmin';

  return (
    <div className='Admin'>
      {!isLoginPage && <Sidebar />}
      <div className={`mainContent ${isLoginPage ? 'fullWidth' : ''}`}>
        {!isLoginPage && <Navbar />}
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/userManagement' element={<UserManagement />} />
          <Route path='/request' element={<Request />} />
          <Route path='/report' element={<Report />} />
          <Route path='/project' element={<Project />} />
          <Route path='/loginAdmin' element={<LoginAdmin />} />
          <Route path="/request/invoice/:orderId" element={<Invoice />} />
        </Routes>
      </div>
    </div>
  )
}

export default Admin;
