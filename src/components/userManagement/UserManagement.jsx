import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, message, Modal, Input, Tooltip, Form, Select } from 'antd';
import { MoreOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import './UserManagement.css';

const { Option } = Select;

const UserManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
  const [isSignupModalVisible, setIsSignupModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/get-users');
      const filteredUsers = response.data.users.filter(user => user.Role !== 'admin');
      setData(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/delete-user/${id}`);
      message.success("User deleted successfully");
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        deleteUser(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const fetchVendorDetails = async (vendorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/get-user/${vendorId}`);
      setVendorDetails(response.data.user.vendorDetails);
      setIsVendorModalVisible(true);
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      message.error("Failed to load vendor details");
    }
  };

  const handleMoreClick = (vendorId) => {
    fetchVendorDetails(vendorId);
  };

  const handleVendorModalClose = () => {
    setIsVendorModalVisible(false);
    setVendorDetails(null);
  };

  const handleSignupModalOpen = () => {
    setIsSignupModalVisible(true);
  };

  const handleSignupModalClose = () => {
    setIsSignupModalVisible(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter(user =>
    user.Username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.Email.toLowerCase().includes(searchText.toLowerCase()) ||
    (user.vendorDetails && user.vendorDetails.VendorName.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
      sorter: (a, b) => a.Username.localeCompare(b.Username),
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
      sorter: (a, b) => a.Email.localeCompare(b.Email),
    },
    {
      title: 'Role',
      dataIndex: 'Role',
      key: 'Role',
      render: (role) => (
        <Tag color={role === 'vendor' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Vendor', value: 'vendor' },
        { text: 'ProjectManager', value: 'ProjectManager' },
      ],
      onFilter: (value, record) => record.Role.includes(value),
    },
    {
      title: 'Vendor',
      dataIndex: ['vendorDetails', 'VendorName'],
      key: 'Vendor',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="More">
            <Button type="link" icon={<MoreOutlined />} onClick={() => handleMoreClick(record.UserID)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="link" icon={<DeleteOutlined style={{ color: 'red' }} />} onClick={() => showDeleteConfirm(record.UserID)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-management-container">
      <div className="header">
        <h1>User List</h1>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={handleSignupModalOpen}
          style={{ float: 'right' }}
        >
          Add New User
        </Button>
      </div>
      <Input
        placeholder="Search users"
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ marginBottom: 20, width: 350 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="UserID"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ width: '100%' }}
      />
      <Modal
        title="Vendor Details"
        visible={isVendorModalVisible}
        onCancel={handleVendorModalClose}
        footer={null}
      >
        {vendorDetails ? (
          <div>
            <p><strong>Vendor Name:</strong> {vendorDetails.VendorName}</p>
            <p><strong>Address:</strong> {vendorDetails.Address}</p>
            <p><strong>City:</strong> {vendorDetails.City}</p>
            <p><strong>State:</strong> {vendorDetails.State}</p>
            <p><strong>Zip Code:</strong> {vendorDetails.ZipCode}</p>
            <p><strong>Country:</strong> {vendorDetails.Country}</p>
            <p><strong>Phone Number:</strong> {vendorDetails.PhoneNumber}</p>
            <p><strong>Email:</strong> {vendorDetails.Email}</p>
            <p><strong>Website:</strong> {vendorDetails.Website}</p>
            <p><strong>Contact Person:</strong> {vendorDetails.ContactPerson}</p>
            <p><strong>Goods or Services:</strong> {vendorDetails.GoodsOrServices}</p>
            <p><strong>Payment Method:</strong> {vendorDetails.PaymentMethod}</p>
            <p><strong>Payment Terms:</strong> {vendorDetails.PaymentTerms}</p>
            <p><strong>NPWP:</strong> {vendorDetails.NPWP}</p>
            <p><strong>Bank Details:</strong> {vendorDetails.BankDetails}</p>
            <p><strong>Notes:</strong> {vendorDetails.Notes}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
      <Modal
        title="New User"
        visible={isSignupModalVisible}
        onCancel={handleSignupModalClose}
        footer={null}
      >
        <SignupForm />
      </Modal>
    </div>
  );
};

const SignupForm = () => {
  const [form] = Form.useForm();
  const [role, setRole] = useState('');

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/authen/register', values);
      if (response.status === 201) {
        message.success("Signup successful!");
        form.resetFields();
      } else {
        message.error("Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      message.error("Signup failed!");
    }
  };

  const onRoleChange = (value) => {
    setRole(value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ role: '' }}
    >
      <Form.Item
        name="Username"
        label="Username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="Email"
        label="Email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input type="email" placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="Password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item
        name="Role"
        label="Role"
        rules={[{ required: true, message: 'Please select your role!' }]}
      >
        <Select placeholder="Select role" onChange={onRoleChange}>
          <Option value="vendor">Vendor</Option>
          <Option value="ProjectManager">Project Manager</Option>
          </Select>
      </Form.Item>

      {role === 'vendor' && (
        <>
          <Form.Item
            name="VendorName"
            label="Vendor Name"
            rules={[{ required: true, message: 'Please input your vendor name!' }]}
          >
            <Input placeholder="Vendor Name" />
          </Form.Item>

          <Form.Item
            name="Address"
            label="Address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="PhoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" className="signup-button">
          Confirm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserManagement;
