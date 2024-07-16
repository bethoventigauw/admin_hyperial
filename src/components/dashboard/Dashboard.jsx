import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faShoppingCart, faUsers, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { List, Button } from 'antd';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [showProjectNames, setShowProjectNames] = useState(false);

  useEffect(() => {
    axios.get('https://backend.hyperial.my.id/dashboard')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number).replace(/,00/g, '');
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'delivered':
      case 'in progress':
        return 'status-delivered';
      case 'received':
      case 'completed':
        return 'status-received'
      default:
        return '';
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  // Data for charts
  const lineChartData = {
    labels: showProjectNames ? data.projectDurations.map(item => item.nama_project) : data.projectDurations.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Project Duration (Days)',
        data: data.projectDurations.map(item => item.duration),
        borderColor: '#2C4C61',
        backgroundColor: '#32dfd3',
      },
    ],
  };
  
  const barChartData = {
    labels: data.orderStatusDistribution.map(item => item.Shipping),
    datasets: [
      {
        label: 'Count',
        data: data.orderStatusDistribution.map(item => item.count),
        backgroundColor: ['#2C4C61'],
        borderColor: ['#2C4C61'],
        borderWidth: 0,
      },
    ],
  };

  const pieChartData = {
    labels: data.projectStatusOverview.map(item => item.status),
    datasets: [
      {
        label: 'Count',
        data: data.projectStatusOverview.map(item => item.count),
        backgroundColor: ['#0D2433', '#2C4C61', '#A9BBC7'], // Menambahkan warna ketiga
        hoverBackgroundColor: ['#0D2433', '#2C4C61', '#A9BBC7'],
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="overview">
        <div className="card card-expenditure">
          <FontAwesomeIcon icon={faMoneyBillWave} className="card-icon" />
          <h3>Total Expenditure</h3>
          <p>{formatRupiah(data.totalInvoiceAmount)}</p>
        </div>
        <div className="card card-orders">
          <FontAwesomeIcon icon={faShoppingCart} className="card-icon" />
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>
        <div className="card card-users">
          <FontAwesomeIcon icon={faUsers} className="card-icon" />
          <h3>Total Users</h3>
          <p>{data.totalUsers}</p>
        </div>
        <div className="card card-projects">
          <FontAwesomeIcon icon={faProjectDiagram} className="card-icon" />
          <h3>Total Projects</h3>
          <p>{data.totalProjects}</p>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-row">
          <div className="chart-monthly">
            <h3>Project Durations</h3>
            <Button onClick={() => setShowProjectNames(!showProjectNames)}>
              {showProjectNames ? 'Hide Project Names' : 'Show Project Names'}
            </Button>
            <Line data={lineChartData} />
          </div>
          <div className="chart-project">
            <h3>Project Status Overview</h3>
            <Pie data={pieChartData} />
          </div>
          <div className="recent-order">
            <h3>Recent Orders</h3>
            <List
              dataSource={data.recentOrders}
              renderItem={order => (
                <List.Item>
                  Order ID: {order.OrderID}, Vendor ID: {order.VendorID}, Total Amount: <span className="green-text">{formatRupiah(order.TotalAmount)}</span>, Shipping: <span className={getStatusClass(order.Shipping)}>{order.Shipping}</span>
                </List.Item>
              )}
            />
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-order">
            <h3>Order Status Distribution</h3>
            <Bar data={barChartData} />
          </div>
          <div className="recent-project">
            <h3>Recent Projects</h3>
            <List
              dataSource={data.recentProjects}
              renderItem={project => (
                <List.Item>
                  Project ID: {project.projectID}, Nama Project: {project.nama_project}, Status: <span className={getStatusClass(project.status)}>{project.status}</span>
                </List.Item>
              )}
            />
          </div>
          <div className="recent-invoice">
            <h3>Recent Invoices</h3>
            <List
              dataSource={data.recentInvoices}
              renderItem={invoice => (
                <List.Item>
                  Invoice ID: {invoice.InvoiceID}, Order ID: {invoice.OrderId}, Total Amount: <span className="green-text">{formatRupiah(invoice.TotalAmount)}</span>
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
