import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Invoice.css';

const Invoice = () => {
  const { orderId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/order/invoice/${orderId}`);
        setInvoice(response.data.invoice);
      } catch (error) {
        console.error('Error fetching invoice', error);
      }
    };
    fetchInvoice();
  }, [orderId]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="invoice-container">
      <h2>Invoice Details</h2>
      <p><strong>Invoice ID:</strong> {invoice.InvoiceID}</p>
      <p><strong>Order ID:</strong> {invoice.OrderId}</p>
      <p><strong>Vendor Name:</strong> {invoice.VendorName}</p> {/* Added VendorName */}
      <p><strong>Invoice Date:</strong> {new Date(invoice.InvoiceDate).toLocaleDateString()}</p>
      <p><strong>Due Date:</strong> {new Date(invoice.DueDate).toLocaleDateString()}</p>
      <p><strong>Subtotal:</strong> <span className="green-text">{formatRupiah(invoice.Subtotal)}</span></p>
      <p><strong>Tax:</strong> {formatRupiah(invoice.Tax)}</p>
      <p><strong>Discount:</strong> {formatRupiah(invoice.Discount)}</p>
      <p><strong>Total Amount:</strong> <span className="green-text">{formatRupiah(invoice.TotalAmount)}</span></p>
      <p><strong>Notes:</strong> {invoice.Notes}</p>
      <h3>Order Details</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.orderDetails.map((detail, index) => (
            <tr key={index}>
              <td>{detail.VendorMaterial.MaterialName}</td>
              <td>{detail.VendorMaterial.Description}</td>
              <td>{detail.Quantity}</td>
              <td>{formatRupiah(detail.VendorMaterial.Price)}</td>
              <td className="green-text">{formatRupiah(detail.Quantity * detail.VendorMaterial.Price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoice;
