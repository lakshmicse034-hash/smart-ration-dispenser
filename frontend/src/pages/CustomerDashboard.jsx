import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { Droplet, History, User as UserIcon, AlertCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await userAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-center" style={{ height: '80vh' }}>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '40px 20px' }}>
        <Routes>
          <Route path="/" element={<DashboardHome dashboard={dashboard} />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
    </>
  );
};

const DashboardHome = ({ dashboard }) => {
  if (!dashboard) return <div>No data available</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Welcome, {dashboard.user?.name}!</h1>

      {/* Ration Card Info */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Droplet size={24} color="#3b82f6" />
          Ration Card Details
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Card Number</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{dashboard.rationCard?.cardNumber}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Household Type</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{dashboard.rationCard?.type}</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Monthly Rice Quota</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{dashboard.rationCard?.monthlyRiceQuota} kg</p>
          </div>
          <div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Monthly Wheat Quota</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{dashboard.rationCard?.monthlyWheatQuota} kg</p>
          </div>
        </div>
      </div>

      {/* Rice Progress */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Rice Quota Usage</h3>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{dashboard.rationCard?.riceUsed} kg used</span>
          <span>{dashboard.rationCard?.monthlyRiceQuota - dashboard.rationCard?.riceUsed} kg remaining</span>
        </div>
        <div style={{
          background: '#e5e7eb',
          height: '20px',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#ef4444',
            height: '100%',
            width: `${(dashboard.rationCard?.riceUsed / dashboard.rationCard?.monthlyRiceQuota) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Wheat Progress */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Wheat Quota Usage</h3>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{dashboard.rationCard?.wheatUsed} kg used</span>
          <span>{dashboard.rationCard?.monthlyWheatQuota - dashboard.rationCard?.wheatUsed} kg remaining</span>
        </div>
        <div style={{
          background: '#e5e7eb',
          height: '20px',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: '#f59e0b',
            height: '100%',
            width: `${(dashboard.rationCard?.wheatUsed / dashboard.rationCard?.monthlyWheatQuota) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} />
          Recent Transactions
        </h3>
        {dashboard.recentTransactions && dashboard.recentTransactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Item</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Quantity</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentTransactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 0' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 0' }}>{tx.item}</td>
                  <td style={{ padding: '10px 0' }}>{tx.quantity} kg</td>
                  <td style={{ padding: '10px 0' }}>
                    <span style={{
                      padding: '4px 8px',
                      background: '#d1fae5',
                      color: '#065f46',
                      borderRadius: '4px',
                      fontSize: '0.85rem'
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#666' }}>No recent transactions</p>
        )}
      </div>
    </div>
  );
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await userAPI.getHistory();
        setTransactions(response.data.transactions || []);
      } catch (err) {
        console.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Transaction History</h1>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {transactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Transaction ID</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Item</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Quantity</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 0' }}>{tx.transactionId}</td>
                  <td style={{ padding: '10px 0' }}>{new Date(tx.date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 0' }}>{tx.item}</td>
                  <td style={{ padding: '10px 0' }}>{tx.quantity} kg</td>
                  <td style={{ padding: '10px 0' }}>{tx.authenticationMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found</p>
        )}
      </div>
    </div>
  );
};

const Profile = ({ user }) => {
  return (
    <div>
      <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <UserIcon size={28} />
        My Profile
      </h1>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '500px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Name</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.name}</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Email</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.email}</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Phone</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.phone}</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Address</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.address}</p>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Family Members</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.familyMembers}</p>
        </div>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Household Type</p>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{user?.householdType}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
