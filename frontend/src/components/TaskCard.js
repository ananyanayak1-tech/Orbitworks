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
        padding: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.75rem',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        backgroundColor: 'var(--surface)',
        transition: 'border-color 0.2s ease',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
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
          borderTop: '1px solid var(--border)', 
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
