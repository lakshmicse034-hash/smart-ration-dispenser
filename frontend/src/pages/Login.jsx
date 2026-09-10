import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('user1@smartration.com');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/customer');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="flex-center" style={{ flex: 1 }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Smart Ration Dispenser</h2>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#3b82f6', fontWeight: '600' }}>Register</Link>
          </p>

          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '6px', fontSize: '12px', color: '#1e40af' }}>
            <p><strong>Demo Credentials:</strong></p>
            <p>User: user1@smartration.com / user123</p>
            <p>Admin: admin@smartration.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
