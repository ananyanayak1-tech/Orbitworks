import React from 'react';

const Avatar = ({ name, size = 36, imageUrl }) => {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toLowerCase();
    }
    return n[0].toLowerCase();
  };

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: 'var(--border)',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: `${size * 0.4}px`,
    overflow: 'hidden',
    border: '1px solid var(--border)',
    textTransform: 'lowercase',
    flexShrink: 0
  };

  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={name} 
        style={{ ...style, objectFit: 'cover' }} 
        onError={(e) => { e.target.style.display = 'none'; }}
      />
    );
  }

  return (
    <div style={style}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
