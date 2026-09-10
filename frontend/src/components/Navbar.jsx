import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Home, Settings, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white p-2" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div className="container flex-between">
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Smart Ration Dispenser</h1>
        </div>
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          <span>{user?.name}</span>
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '8px 16px',
              backgroundColor: '#1e40af',
              borderRadius: '4px'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
