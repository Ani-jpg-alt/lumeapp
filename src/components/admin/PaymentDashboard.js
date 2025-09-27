import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function PaymentDashboard() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');

  useEffect(() => {
    fetchPaymentsAndOrders();
  }, []);

  const fetchPaymentsAndOrders = async () => {
    try {
      // Fetch orders with payment information
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setOrders(ordersData);

      // Extract payment data from orders
      const paymentsData = ordersData.filter(order => order.paymentDetails).map(order => ({
        orderId: order.id,
        customerEmail: order.customerEmail,
        amount: order.paymentDetails.amount,
        paymentId: order.paymentDetails.paymentId,
        status: order.paymentDetails.status,
        method: order.paymentDetails.method || 'Unknown',
        createdAt: order.createdAt,
        orderStatus: order.status
      }));

      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPayments = () => {
    let filtered = [...payments];

    // Filter by payment status
    if (paymentStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === paymentStatus);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        filtered = filtered.filter(payment => payment.createdAt >= startDate);
      }
    }

    return filtered;
  };

  const calculateStats = () => {
    const filteredPayments = getFilteredPayments();
    const successfulPayments = filteredPayments.filter(p => p.status === 'successful');

    const totalRevenue = successfulPayments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount.replace('R', ''));
      return sum + amount;
    }, 0);

    const totalTransactions = filteredPayments.length;
    const successfulTransactions = successfulPayments.length;
    const failedTransactions = filteredPayments.filter(p => p.status === 'failed').length;
    const pendingTransactions = filteredPayments.filter(p => p.status === 'pending').length;

    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return {
      totalRevenue,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      successRate
    };
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'successful':
        return '#28a745';
      case 'failed':
        return '#dc3545';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') {
      const numAmount = parseFloat(amount.replace('R', ''));
      return `R${numAmount.toFixed(2)}`;
    }
    return `R${amount.toFixed(2)}`;
  };

  const filteredPayments = getFilteredPayments();
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="payment-dashboard">
      <div className="section-header">
        <h2>Payment Dashboard</h2>
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Date Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Payment Status:</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card transactions">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalTransactions}</div>
            <div className="stat-label">Total Transactions</div>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{stats.successRate.toFixed(1)}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>

        <div className="stat-card successful">
          <div className="stat-icon">💚</div>
          <div className="stat-content">
            <div className="stat-number">{stats.successfulTransactions}</div>
            <div className="stat-label">Successful</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{stats.pendingTransactions}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card failed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-number">{stats.failedTransactions}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
      </div>

      <div className="payments-table-container">
        <h3>Recent Payments</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.paymentId}>
                <td>
                  <code>{payment.paymentId.substring(0, 12)}...</code>
                </td>
                <td>
                  <code>{payment.orderId.substring(0, 8)}...</code>
                </td>
                <td>
                  {payment.customerEmail}
                </td>
                <td>
                  <strong>{formatCurrency(payment.amount)}</strong>
                </td>
                <td>
                  {payment.method}
                </td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getPaymentStatusColor(payment.status) }}
                  >
                    {payment.status}
                  </span>
                </td>
                <td>
                  {payment.createdAt ? payment.createdAt.toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <span className="order-status">
                    {payment.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="no-payments">
            <p>No payments found matching your criteria.</p>
          </div>
        )}
      </div>

      <div className="payment-summary">
        <h3>Payment Methods Breakdown</h3>
        <div className="method-stats">
          {['Card', 'EFT', 'Unknown'].map(method => {
            const methodPayments = filteredPayments.filter(p => p.method === method);
            const methodRevenue = methodPayments
              .filter(p => p.status === 'successful')
              .reduce((sum, p) => sum + parseFloat(p.amount.replace('R', '')), 0);

            return (
              <div key={method} className="method-stat">
                <h4>{method}</h4>
                <p>Transactions: {methodPayments.length}</p>
                <p>Revenue: {formatCurrency(methodRevenue)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}