import React from 'react';
import Badge from './Badge';
import { Calendar, AlignLeft } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';

const TaskCard = ({ task, onClick }) => {
  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{ 
        cursor: 'pointer', 
        padding: '1.15rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        border: '1.5px solid var(--card-border)',
        borderRadius: '16px',
        backgroundColor: 'var(--surface)',
        boxShadow: 'var(--card-shadow)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.borderColor = 'rgba(137, 225, 247, 0.6)'; 
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.borderColor = 'var(--card-border)'; 
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--card-shadow)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge text={task.priority} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
          {task.projectName}
        </span>
      </div>
      
      <h4 
        style={{ 
          margin: 0, 
          fontSize: '0.95rem', 
          fontWeight: '600', 
          color: 'var(--text-primary)', 
          textTransform: 'lowercase' 
        }}
      >
        {task.title}
      </h4>
      
      <p 
        style={{ 
          margin: 0, 
          fontSize: '0.8rem', 
          color: 'var(--text-secondary)', 
          textTransform: 'lowercase', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4'
        }}
      >
        {task.description}
      </p>

      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginTop: '0.5rem', 
          borderTop: '1px solid var(--card-border)', 
          paddingTop: '0.5rem' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          <Calendar size={12} />
          <span>{formatDate(task.deadline)}</span>
        </div>
        {task.comments && task.comments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <AlignLeft size={12} />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
