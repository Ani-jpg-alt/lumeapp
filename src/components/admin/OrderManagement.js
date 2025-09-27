import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: '#ffc107' },
    { value: 'processing', label: 'Processing', color: '#17a2b8' },
    { value: 'shipped', label: 'Shipped', color: '#fd7e14' },
    { value: 'delivered', label: 'Delivered', color: '#28a745' },
    { value: 'cancelled', label: 'Cancelled', color: '#dc3545' }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });

      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date() }
          : order
      ));

      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getOrderTotal = (order) => {
    return order.items?.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R', ''));
      return total + (price * item.quantity);
    }, 0) || 0;
  };

  const formatCurrency = (amount) => {
    return `R${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : '#6c757d';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="section-header">
        <h2>Order Management</h2>
        <div className="order-stats">
          <div className="stat-item">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by order ID, email, or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {orderStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <code>{order.id.substring(0, 8)}...</code>
                </td>
                <td>
                  <div>
                    <div className="customer-name">
                      {order.shippingAddress?.name || 'N/A'}
                    </div>
                    <div className="customer-email">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td>
                  {order.createdAt ? order.createdAt.toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <span className="item-count">
                    {order.items?.length || 0} items
                  </span>
                </td>
                <td>
                  <strong>{formatCurrency(getOrderTotal(order))}</strong>
                </td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <div className="order-actions">
                    <button
                      className="admin-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      👁️ View
                    </button>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="status-select"
                    >
                      {orderStatuses.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="order-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Order Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ❌
              </button>
            </div>

            <div className="order-details">
              <div className="detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                <p><strong>Date:</strong> {selectedOrder.createdAt?.toLocaleString()}</p>
                <p><strong>Status:</strong>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Total:</strong> {formatCurrency(getOrderTotal(selectedOrder))}</p>
              </div>

              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
              </div>

              <div className="detail-section">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                <p>{selectedOrder.shippingAddress?.province}</p>
              </div>

              <div className="detail-section">
                <h4>Items Ordered</h4>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h5>{item.name}</h5>
                        <p>Size: {item.size}</p>
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.paymentDetails && (
                <div className="detail-section">
                  <h4>Payment Information</h4>
                  <p><strong>Payment ID:</strong> {selectedOrder.paymentDetails.paymentId}</p>
                  <p><strong>Amount:</strong> {selectedOrder.paymentDetails.amount}</p>
                  <p><strong>Status:</strong> {selectedOrder.paymentDetails.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}