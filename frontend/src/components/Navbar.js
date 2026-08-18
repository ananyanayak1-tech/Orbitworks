import React, { useState, useEffect } from 'react';
import { Menu, Bell, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationRead } from '../services/api';
import Dropdown from './Dropdown';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (user) {
      getNotifications(user.id).then(setNotifications);
      const interval = setInterval(() => {
        getNotifications(user.id).then(setNotifications);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const unreadCount = unreadNotifications.length;

  const notificationItems = unreadNotifications.map(n => ({
    label: (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.1rem', 
          backgroundColor: 'var(--bg)', 
          padding: '0.4rem 0.5rem', 
          borderRadius: '4px',
          borderBottom: '1px solid var(--border)'
        }}
        onClick={() => handleRead(n.id)}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'normal', lineHeight: '1.3' }}>
          {n.text}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
          {new Date(n.time).toLocaleDateString()}
        </span>
      </div>
    ),
    onClick: () => handleRead(n.id)
  }));

  return (
    <div 
      className="navbar" 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleSidebar}
          className="mobile-only"
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-primary)', 
            cursor: 'pointer', 
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Menu size={20} />
        </button>
        <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.2px', color: 'var(--text-primary)' }} className="desktop-only">
          OrbitWorks Portal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 0
          }}
          title="Toggle Dark Mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Bell */}
        {unreadCount > 0 ? (
          <Dropdown 
            trigger={
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title={`${unreadCount} unread notifications`}>
                <Bell size={20} style={{ color: 'var(--text-primary)' }} />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '-3px', 
                    right: '-3px', 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: 'var(--accent)', 
                    borderRadius: '50%' 
                  }} 
                />
              </div>
            }
            items={notificationItems}
          />
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} title="No unread notifications">
            <Bell size={20} style={{ color: 'var(--text-secondary)', opacity: 0.7 }} />
          </div>
        )}

        {/* User initials & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div 
            style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--accent)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '700', 
              fontSize: '0.8rem',
              flexShrink: 0
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }} className="desktop-only">
            {user?.name}
          </span>
          <button 
            onClick={logout}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              fontSize: '0.85rem', 
              padding: 0 
            }}
          >
            <LogOut size={16} style={{ color: 'var(--text-secondary)' }} />
            <span className="desktop-only" style={{ fontWeight: '500' }}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
