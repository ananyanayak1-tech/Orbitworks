import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, highlight }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '200px' }}>
      {Icon && (
        <div 
          style={{ 
            padding: '0.75rem', 
            backgroundColor: highlight ? 'rgba(137, 225, 247, 0.15)' : 'var(--bg)', 
            borderRadius: '12px', 
            border: '1px solid var(--border)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Icon size={20} style={{ color: highlight ? '#087E8B' : 'var(--text-secondary)' }} />
        </div>
      )}
      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '500' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          {value}
        </div>
        {description && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
