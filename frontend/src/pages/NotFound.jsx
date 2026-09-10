import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '20px' }}>
      <AlertCircle size={64} color="#ef4444" />
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          background: '#3b82f6',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
