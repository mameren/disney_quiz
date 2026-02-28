import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, signOut } from '../lib/auth-client';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'クイズ', path: '/quiz' },
    { label: 'ルーレット', path: '/roulette' },
    { label: 'プラン作成', path: '/plan' },
    ...(session?.user ? [{ label: '成績', path: '/stats' }] : []),
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-logo" onClick={() => navigate('/')}>
          <span className="header-logo-icon">✨</span>
          <span className="header-logo-text">Pocket Jiminy</span>
        </div>

        <nav className="header-nav">
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              className={`nav-link${location.pathname === path ? ' nav-link-active' : ''}`}
              onClick={() => navigate(path)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          {session?.user ? (
            <>
              <span className="header-user">👤 {session.user.name || session.user.email}</span>
              <button className="header-btn-ghost" onClick={() => signOut()}>ログアウト</button>
            </>
          ) : (
            <button className="header-btn-primary" onClick={() => navigate('/auth')}>
              ログイン
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(v => !v)}>
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ label, path }) => (
            <button
              key={path}
              className="mobile-nav-link"
              onClick={() => { navigate(path); setMenuOpen(false); }}
            >
              {label}
            </button>
          ))}
          <div className="mobile-menu-divider" />
          {session?.user ? (
            <button className="mobile-nav-link" onClick={() => { signOut(); setMenuOpen(false); }}>
              ログアウト
            </button>
          ) : (
            <button className="mobile-nav-link mobile-login" onClick={() => { navigate('/auth'); setMenuOpen(false); }}>
              ログイン
            </button>
          )}
        </div>
      )}
    </header>
  );
}
