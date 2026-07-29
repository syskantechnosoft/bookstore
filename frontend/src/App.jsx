import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BookList } from './components/BookList';
import { LoginForm } from './components/LoginForm';

function AppContent() {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main style={{ flex: 1 }}>
        {!user ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div className="glass-panel animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Secure Enterprise Bookstore
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '28px', lineHeight: '1.6' }}>
                Built with <strong>Spring Boot 4.1.0</strong> (Java 25), <strong>React 19.2.8</strong>, <strong>Redis Caching</strong>, <strong>Liquibase</strong>, and <strong>Prometheus/Grafana</strong>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ color: '#f43f5e', fontWeight: 700, fontSize: '0.9rem' }}>ADMIN</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Full CRUD + User Management</div>
                </div>
                <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>LIBRARIAN</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Write / Update Books</div>
                </div>
                <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>USER</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Read-Only Book Search</div>
                </div>
              </div>

              <button
                onClick={() => setIsAuthOpen(true)}
                style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#0f172a', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(56, 189, 248, 0.3)' }}
              >
                Sign In to Demo Application
              </button>
            </div>
          </div>
        ) : (
          <BookList />
        )}
      </main>

      {isAuthOpen && <LoginForm onClose={() => setIsAuthOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
