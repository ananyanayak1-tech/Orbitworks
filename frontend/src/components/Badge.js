import React from 'react';

const Badge = ({ text }) => {
  let badgeClass = '';
  let isBold = false;
  const val = String(text || '').toLowerCase();

  if (
    val === 'low' || 
    val === 'completed' || 
    val === 'present' || 
    val === 'approved' || 
    val === 'wfh' ||
    val === 'active' ||
    val === 'public'
  ) {
    badgeClass = 'status-success';
  } else if (
    val === 'medium' || 
    val === 'in progress' || 
    val === 'under review' || 
    val === 'pending' || 
    val === 'late entry' ||
    val === 'half day' ||
    val === 'planning' ||
    val === 'optional'
  ) {
    badgeClass = 'status-warning';
  } else if (
    val === 'high' || 
    val === 'critical' || 
    val === 'blocked' || 
    val === 'absent' || 
    val === 'rejected' || 
    val === 'overdue' ||
    val === 'deactivated' ||
    val === 'company'
  ) {
    badgeClass = 'status-danger';
    if (val === 'critical') {
      isBold = true;
    }
  } else {
    badgeClass = 'status-warning';
  }

  return (
    <span 
      className={badgeClass} 
      style={{ 
        fontWeight: isBold ? '700' : '600', 
        display: 'inline-block',
        fontSize: '0.7rem',
        textTransform: 'capitalize',
        letterSpacing: '0.02em'
      }}
    >
      {text}
    </span>
  );
};

export default Badge;
