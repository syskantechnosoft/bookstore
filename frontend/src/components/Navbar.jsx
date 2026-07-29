import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Shield, User as UserIcon, BookMarked } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, logout, hasRole } = useAuth();

  return (
    <header className="glass-panel" style={{ margin: '16px 24px', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
          <BookOpen size={24} color="#0f172a" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #f8fafc, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Bookstore<span style={{ color: '#38bdf8' }}>Pro</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Multi-Role Library Inventory Management</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <UserIcon size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName || user.username}</span>
              {hasRole('ADMIN') && <span className="badge badge-admin">ADMIN</span>}
              {hasRole('LIBRARIAN') && <span className="badge badge-librarian">LIBRARIAN</span>}
              {hasRole('USER') && !hasRole('ADMIN') && !hasRole('LIBRARIAN') && <span className="badge badge-user">READ-ONLY</span>}
            </div>

            <a
              href="/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.85rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.1)', padding: '8px 14px', borderRadius: '8px' }}
            >
              <BookMarked size={16} /> API Docs
            </a>

            <button
              onClick={logout}
              style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0f172a', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)' }}
          >
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};
