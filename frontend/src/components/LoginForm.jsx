import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, User, Mail, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export const LoginForm = ({ onClose }) => {
  const { login, register, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'USER',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setToastMsg('');
    try {
      if (isRegister) {
        await register({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName,
          roles: [formData.role],
        });
        setToastMsg('🎉 Account created successfully! Please sign in with your credentials.');
        setIsRegister(false);
      } else {
        await login(formData.username, formData.password);
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication error occurred';
      setErrorMsg(msg);
    }
  };

  const fillDemoAccount = async (roleType) => {
    setErrorMsg('');
    setToastMsg('');
    const creds = {
      admin: { u: 'admin', p: 'Admin@123' },
      librarian: { u: 'librarian', p: 'Librarian@123' },
      user: { u: 'user', p: 'User@123' },
    };
    const c = creds[roleType];
    if (c) {
      try {
        await login(c.u, c.p);
        onClose();
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to login with demo account';
        setErrorMsg(msg);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: '#94a3b8', padding: '4px', cursor: 'pointer', border: 'none' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: '#f8fafc' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
          {isRegister ? 'Sign up to access the bookstore platform' : 'Enter your credentials to manage books'}
        </p>

        {toastMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} style={{ shrink: 0 }} /> {toastMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#f43f5e', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={18} style={{ shrink: 0 }} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. admin"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
            />
          </div>

          {isRegister && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Requested Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
                >
                  <option value="USER">Regular User (Read Only)</option>
                  <option value="LIBRARIAN">Librarian (Write/Update)</option>
                  <option value="ADMIN">Admin (Full Control)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff', padding: '10px 14px', borderRadius: '8px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0f172a', fontWeight: 700, padding: '12px', borderRadius: '8px', marginTop: '8px', cursor: 'pointer' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        {!isRegister && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '10px', textAlign: 'center' }}>Quick Demo Logins:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => fillDemoAccount('admin')} className="badge badge-admin" style={{ flex: 1, padding: '8px', justifyContent: 'center', cursor: 'pointer' }}>
                Admin
              </button>
              <button onClick={() => fillDemoAccount('librarian')} className="badge badge-librarian" style={{ flex: 1, padding: '8px', justifyContent: 'center', cursor: 'pointer' }}>
                Librarian
              </button>
              <button onClick={() => fillDemoAccount('user')} className="badge badge-user" style={{ flex: 1, padding: '8px', justifyContent: 'center', cursor: 'pointer' }}>
                User
              </button>
            </div>
          </div>
        )}

        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setToastMsg(''); }}
            style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}
          >
            {isRegister ? 'Sign In' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};
