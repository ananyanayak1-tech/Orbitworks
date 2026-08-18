import React from 'react';
import { Bell, Check, BellRing } from 'lucide-react';
import { markNotificationRead } from '../../services/api';

const EmployeeNotifications = ({ notifications, onRefresh }) => {
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n => markNotificationRead(n.id))
      );
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, textTransform: 'lowercase', fontWeight: '600' }}>notifications</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>you have {unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'lowercase' }}>
            <Check size={14} /> mark all read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textTransform: 'lowercase' }}>
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id} 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center', 
                padding: '0.75rem 1rem', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                backgroundColor: n.read ? 'transparent' : 'var(--bg)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ color: n.read ? 'var(--text-secondary)' : 'var(--accent)', display: 'flex', alignItems: 'center' }}>
                {n.read ? <Bell size={18} /> : <BellRing size={18} />}
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: n.read ? '400' : '600', lineHeight: '1.4' }}>
                  {n.text}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {new Date(n.time).toLocaleString()}
                </span>
              </div>

              {!n.read && (
                <button 
                  onClick={() => handleMarkRead(n.id)}
                  className="secondary" 
                  style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  title="mark as read"
                >
                  <Check size={12} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            no notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeNotifications;
