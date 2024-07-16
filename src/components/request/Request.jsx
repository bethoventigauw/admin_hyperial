import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Tag, Button, message, Popconfirm, Tooltip, Input, Modal, Form, InputNumber } from 'antd';
import { CheckCircleTwoTone, FileTextTwoTone, SearchOutlined } from '@ant-design/icons';
import './Request.css';

const Request = () => {
  const [materials, setMaterials] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchMaterialText, setSearchMaterialText] = useState('');
  const [searchOrderText, setSearchOrderText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialResponse = await axios.get('https://backend.hyperial.my.id/order/materials');
        setMaterials(materialResponse.data.materials);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  const handleAddToOrder = (material) => {
    setSelectedMaterial(material);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      setOrderItems([...orderItems, { ...selectedMaterial, Quantity: values.quantity }]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      message.error('Tambahkan barang ke keranjang belanja terlebih dahulu.');
      return;
    }

    confirmSubmit();
  };

  const confirmSubmit = () => {
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin mengirimkan pesanan ini?',
      onOk: () => submitOrder(),
      onCancel: () => console.log('Cancel'),
      okText: 'Ya',
      cancelText: 'Tidak',
    });
  };

  const submitOrder = async () => {
    const items = orderItems.map(item => ({
      VendorMaterialID: item.VendorMaterialId,
      Quantity: item.Quantity,
      VendorID: item.VendorId,
    }));

    const groupedItems = items.reduce((acc, item) => {
      const { VendorID, ...rest } = item;
      if (!acc[VendorID]) {
        acc[VendorID] = [];
      }
      acc[VendorID].push(rest);
      return acc;
    }, {});

    try {
      for (const vendorID in groupedItems) {
        const orderData = {
          VendorID: vendorID,
          items: groupedItems[vendorID],
        };

        const response = await axios.post('https://backend.hyperial.my.id/order/newOrder', orderData);
        message.success(response.data.message);
        fetchOrders();
      }
    } catch (error) {
      message.error(error.response ? error.response.data.message : 'Gagal membuat order.');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('https://backend.hyperial.my.id/order/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders', error);
    }
  };

  const handleViewInvoice = (orderId) => {
    navigate(`/request/invoice/${orderId}`);
  };

  const handleReceiveOrder = async (orderId) => {
    try {
      const response = await axios.post(`https://backend.hyperial.my.id/order/orders/${orderId}/receive`);
      message.success(response.data.message);
      fetchOrders();
    } catch (error) {
      message.error(error.response ? error.response.data.message : 'Gagal menerima order.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchMaterialChange = (e) => {
    setSearchMaterialText(e.target.value);
  };

  const handleSearchOrderChange = (e) => {
    setSearchOrderText(e.target.value);
  };

  const filteredMaterials = materials.filter((material) =>
    material.MaterialName.toLowerCase().includes(searchMaterialText.toLowerCase())
  );

  const filteredOrders = orders.filter((order) =>
    order.OrderID.toString().includes(searchOrderText)
  );

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const materialColumns = [
    {
      title: 'Material',
      dataIndex: 'MaterialName',
      key: 'MaterialName',
    },
    {
      title: 'Vendor',
      dataIndex: ['Vendor', 'VendorName'],
      key: 'VendorName',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'Description',
      key: 'Description',
    },
    {
      title: 'Unit',
      dataIndex: 'Unit',
      key: 'Unit',
    },
    {
      title: 'Harga',
      dataIndex: 'Price',
      key: 'Price',
      render: (text) => formatRupiah(text),
    },
    {
      title: 'Status',
      key: 'Status',
      render: (text, record) => (
        <Tag color={record.Quantity > 0 ? 'green' : 'red'}>
          {record.Quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </Tag>
      ),
    },
    {
      title: 'Aksi',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAddToOrder(record)} disabled={record.Quantity < 1}>
          Buy
        </Button>
      ),
    },
  ];

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderID',
      key: 'OrderID',
    },
    {
      title: 'Vendor ID',
      dataIndex: 'VendorID',
      key: 'VendorID',
    },
    {
      title: 'Total Amount',
      dataIndex: 'TotalAmount',
      key: 'TotalAmount',
      render: (text) => formatRupiah(text),
    },
    {
      title: 'Shipping',
      dataIndex: 'Shipping',
      key: 'Shipping',
      render: (text) => (
        <Tag color={text === 'Delivered' ? 'blue' : text === 'Received' ? 'green' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Tooltip title="View Invoice">
            <Button
              type="link"
              icon={<FileTextTwoTone twoToneColor="#0066ff" style={{ fontSize: '25px' }} />}
              onClick={() => handleViewInvoice(record.OrderID)}
            />
          </Tooltip>
          {record.Shipping === 'Delivered' && (
            <Popconfirm
              title="Already receive this order?"
              onConfirm={() => handleReceiveOrder(record.OrderID)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '25px' }} />} />
            </Popconfirm>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="request-container">
      <h1>Request Order</h1>
      <Input
        placeholder="Search Materials"
        prefix={<SearchOutlined />}
        value={searchMaterialText}
        onChange={handleSearchMaterialChange}
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={materialColumns}
        dataSource={filteredMaterials}
        rowKey="VendorMaterialId"
        pagination={{ pageSize: 5 }}
      />
      <h3>Checkout</h3>
      {orderItems.length > 0 ? (
        <div>
          <Table
            columns={[
              { title: 'Material', dataIndex: 'MaterialName', key: 'MaterialName' },
              { title: 'Quantity', dataIndex: 'Quantity', key: 'Quantity' },
              { title: 'Unit', dataIndex: 'Unit', key: 'Unit' },
              { title: 'Price', dataIndex: 'Price', key: 'Price', render: (text) => formatRupiah(text) },
              { title: 'Total', key: 'Total', render: (text, record) => formatRupiah(record.Price * record.Quantity) },
            ]}
            dataSource={orderItems}
            rowKey="VendorMaterialId"
            pagination={false}
          />
          <Popconfirm
            title="Are you sure you want to submit this order?"
            onConfirm={submitOrder}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary">Submit Order</Button>
          </Popconfirm>
        </div>
      ) : (
        <p>Belum ada item yang ditambahkan.</p>
      )}
      <h3>Order List</h3>
      <Input
        placeholder="Search Orders"
        prefix={<SearchOutlined />}
        value={searchOrderText}
        onChange={handleSearchOrderChange}
        style={{ marginBottom: 20 }}
      />
      <Table
        columns={orderColumns}
        dataSource={filteredOrders}
        rowKey="OrderID"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={`Add ${selectedMaterial?.MaterialName} to Order`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Request;
