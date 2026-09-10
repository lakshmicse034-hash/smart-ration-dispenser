import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { BarChart3, Users, Package, Zap, Truck, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === `/admin${path}`;

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{
          background: '#1e293b',
          color: 'white',
          width: '250px',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/admin"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/') ? 'white' : '#cbd5e1',
                background: isActive('/') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <BarChart3 size={18} /> Dashboard
            </Link>
            <Link
              to="/admin/users"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/users') ? 'white' : '#cbd5e1',
                background: isActive('/users') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <Users size={18} /> Users
            </Link>
            <Link
              to="/admin/inventory"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/inventory') ? 'white' : '#cbd5e1',
                background: isActive('/inventory') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <Package size={18} /> Inventory
            </Link>
            <Link
              to="/admin/devices"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/devices') ? 'white' : '#cbd5e1',
                background: isActive('/devices') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <Zap size={18} /> Devices
            </Link>
            <Link
              to="/admin/refills"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/refills') ? 'white' : '#cbd5e1',
                background: isActive('/refills') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <Truck size={18} /> Refills
            </Link>
            <Link
              to="/admin/notifications"
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                color: isActive('/notifications') ? 'white' : '#cbd5e1',
                background: isActive('/notifications') ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.95rem'
              }}
            >
              <Bell size={18} /> Notifications
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ padding: '30px' }}>
            <Routes>
              <Route path="/" element={<OverviewDashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/devices" element={<DeviceManagement />} />
              <Route path="/refills" element={<RefillManagement />} />
              <Route path="/notifications" element={<NotificationManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

const OverviewDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminAPI.getDashboard();
        setDashboard(response.data);
      } catch (err) {
        console.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard label="Total Users" value={dashboard?.totalUsers || 0} icon="👥" />
        <StatCard label="Active Transactions" value={dashboard?.activeTransactions || 0} icon="💳" />
        <StatCard label="Low Stock Items" value={dashboard?.lowStockItems || 0} icon="📦" />
        <StatCard label="Device Status" value={dashboard?.deviceStatus?.online || 0} icon="🔌" />
      </div>

      {/* Inventory Overview */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Inventory Overview</h2>
        {dashboard?.inventory?.map((item) => (
          <div key={item._id} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{item.item}</span>
              <span>{item.currentStock} kg</span>
            </div>
            <div style={{
              background: '#e5e7eb',
              height: '10px',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: item.status === 'low' ? '#ef4444' : '#10b981',
                height: '100%',
                width: `${Math.min((item.currentStock / 500) * 100, 100)}%`
              }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
              Status: <span style={{ color: item.status === 'low' ? '#ef4444' : '#10b981', fontWeight: '600' }}>{item.status.toUpperCase()}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Recent Transactions</h2>
        {dashboard?.recentTransactions?.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>User</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Item</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Quantity</th>
                <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentTransactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 0' }}>{tx.userName}</td>
                  <td style={{ padding: '10px 0' }}>{tx.item}</td>
                  <td style={{ padding: '10px 0' }}>{tx.quantity} kg</td>
                  <td style={{ padding: '10px 0' }}>{new Date(tx.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions yet</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div style={{
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{icon}</div>
    <p style={{ color: '#666', fontSize: '0.9rem' }}>{label}</p>
    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3b82f6' }}>{value}</p>
  </div>
);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPI.getUsers({ limit: 20 });
        setUsers(response.data.users || []);
      } catch (err) {
        console.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>User Management</h1>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Phone</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 0' }}>{user.name}</td>
                <td style={{ padding: '10px 0' }}>{user.email}</td>
                <td style={{ padding: '10px 0' }}>{user.phone}</td>
                <td style={{ padding: '10px 0' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: user.role === 'admin' ? '#dbeafe' : '#dcfce7',
                    color: user.role === 'admin' ? '#1e40af' : '#166534',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '10px 0' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await adminAPI.getInventory();
        setInventory(response.data.inventory || []);
      } catch (err) {
        console.error('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const simulateLowStock = async (itemId) => {
    try {
      await adminAPI.simulateLowStock({ itemId });
      alert('Low stock simulated');
    } catch (err) {
      alert('Failed to simulate');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Inventory Management</h1>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {inventory.map((item) => (
          <div key={item._id} style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ marginBottom: '10px', textTransform: 'capitalize' }}>{item.item}</h3>
              <p style={{ color: '#666', marginBottom: '5px' }}>Current Stock: {item.currentStock} kg</p>
              <p style={{ color: '#666' }}>Minimum Stock: {item.minimumStock} kg</p>
              <p style={{
                color: item.status === 'low' ? '#ef4444' : '#10b981',
                fontWeight: '600',
                marginTop: '5px'
              }}>
                Status: {item.status.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => simulateLowStock(item._id)}
              style={{
                padding: '8px 16px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Simulate Low Stock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await adminAPI.getDevices();
        setDevices(response.data.devices || []);
      } catch (err) {
        console.error('Failed to load devices');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const simulateAction = async (deviceId, action) => {
    try {
      if (action === 'solar') await adminAPI.simulateSolarCharging(deviceId);
      else if (action === 'drain') await adminAPI.simulateBatteryDrain(deviceId);
      else if (action === 'offline') await adminAPI.simulateDeviceOffline(deviceId);
      else if (action === 'online') await adminAPI.simulateDeviceOnline(deviceId);
      alert(`Action ${action} simulated`);
    } catch (err) {
      alert('Failed to simulate action');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Device Management</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {devices.map((device) => (
          <div key={device._id} style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '15px' }}>{device.deviceId}</h3>
            <p style={{ marginBottom: '8px' }}>
              Status: <span style={{
                color: device.status === 'online' ? '#10b981' : '#ef4444',
                fontWeight: '600'
              }}>{device.status.toUpperCase()}</span>
            </p>
            <p style={{ marginBottom: '8px' }}>Battery: {device.battery}%</p>
            <p style={{ marginBottom: '8px' }}>Temperature: {device.temperature}°C</p>
            <p style={{ marginBottom: '15px' }}>Solar Charging: {device.solarCharging ? 'Active' : 'Inactive'}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => simulateAction(device._id, 'solar')}
                style={{
                  padding: '8px 12px',
                  background: '#fbbf24',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Solar
              </button>
              <button
                onClick={() => simulateAction(device._id, 'drain')}
                style={{
                  padding: '8px 12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Drain
              </button>
              <button
                onClick={() => simulateAction(device._id, device.status === 'online' ? 'offline' : 'online')}
                style={{
                  padding: '8px 12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {device.status === 'online' ? 'Offline' : 'Online'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RefillManagement = () => {
  const [refills, setRefills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ item: 'rice', quantity: 100 });

  useEffect(() => {
    fetchRefills();
  }, []);

  const fetchRefills = async () => {
    try {
      const response = await adminAPI.getRefills();
      setRefills(response.data.refills || []);
    } catch (err) {
      console.error('Failed to load refills');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRefill = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createRefill(formData);
      setShowForm(false);
      setFormData({ item: 'rice', quantity: 100 });
      fetchRefills();
    } catch (err) {
      alert('Failed to create refill');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Refill Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'New Refill'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <form onSubmit={handleCreateRefill}>
            <div style={{ marginBottom: '15px' }}>
              <label>Item</label>
              <select
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
              >
                <option>rice</option>
                <option>wheat</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Quantity (kg)</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                min="1"
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Refill
            </button>
          </form>
        </div>
      )}

      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Item</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Quantity</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '10px 0' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {refills.map((refill) => (
              <tr key={refill._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 0', textTransform: 'capitalize' }}>{refill.item}</td>
                <td style={{ padding: '10px 0' }}>{refill.quantity} kg</td>
                <td style={{ padding: '10px 0' }}>{new Date(refill.date).toLocaleDateString()}</td>
                <td style={{ padding: '10px 0' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: refill.status === 'completed' ? '#d1fae5' : '#fef3c7',
                    color: refill.status === 'completed' ? '#065f46' : '#92400e',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    textTransform: 'capitalize'
                  }}>
                    {refill.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await adminAPI.getNotifications();
        setNotifications(response.data.notifications || []);
      } catch (err) {
        console.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Notifications</h1>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif._id} style={{
              padding: '15px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ marginBottom: '5px' }}>{notif.title}</h3>
                <p style={{ color: '#666' }}>{notif.message}</p>
                <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <span style={{
                padding: '4px 12px',
                background: notif.read ? '#e5e7eb' : '#dbeafe',
                color: notif.read ? '#666' : '#1e40af',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                {notif.read ? 'Read' : 'Unread'}
              </span>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
