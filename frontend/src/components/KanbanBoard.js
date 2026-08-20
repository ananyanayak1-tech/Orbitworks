import React, { useState } from 'react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks = [], onTaskClick, onTaskStatusChange }) => {
  const [dragOverCol, setDragOverCol] = useState(null);

  const columns = [
    { id: 'not started', title: 'Not Started' },
    { id: 'in progress', title: 'In Progress' },
    { id: 'blocked', title: 'Blocked' },
    { id: 'under review', title: 'Under Review' },
    { id: 'completed', title: 'Completed' }
  ];

  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem', 
        alignItems: 'start', 
        overflowX: 'auto', 
        paddingBottom: '1rem' 
      }}
    >
      {columns.map((col) => {
        const colTasks = tasks.filter(t => String(t.status || '').toLowerCase() === col.id);
        const isOver = dragOverCol === col.id;

        return (
          <div 
            key={col.id} 
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverCol !== col.id) {
                setDragOverCol(col.id);
              }
            }}
            onDragLeave={() => {
              setDragOverCol(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverCol(null);
              const taskId = e.dataTransfer.getData('text/plain');
              if (onTaskStatusChange && taskId) {
                onTaskStatusChange(taskId, col.id);
              }
            }}
            style={{ 
              backgroundColor: isOver ? 'rgba(8, 126, 139, 0.04)' : 'var(--surface)', 
              border: isOver ? '2px dashed #087E8B' : '1.5px solid var(--card-border)', 
              borderRadius: '16px', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minHeight: '450px',
              transition: 'all 0.25s ease',
              boxShadow: isOver ? '0 10px 25px rgba(8, 126, 139, 0.06)' : 'var(--card-shadow)'
            }}
          >
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.5rem', 
                borderBottom: '1px solid var(--border)', 
                paddingBottom: '0.5rem' 
              }}
            >
              <h5 style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {col.title}
              </h5>
              <span 
                style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: 'var(--border)', 
                  color: 'var(--text-secondary)', 
                  padding: '0.15rem 0.5rem', 
                  borderRadius: '99px',
                  fontWeight: '600'
                }}
              >
                {colTasks.length}
              </span>
            </div>
            
            <div 
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '500px', minHeight: '300px', padding: '0.25rem' }}
            >
              {colTasks.map((task) => (
                <div 
                  key={task._id || task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task._id || task.id);
                  }}
                  style={{ cursor: 'grab' }}
                >
                  <TaskCard 
                    task={task} 
                    onClick={() => onTaskClick(task)} 
                  />
                </div>
              ))}
              {colTasks.length === 0 && (
                <div 
                  style={{ 
                    textAlign: 'center', 
                    padding: '2rem 0', 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.8rem', 
                    border: '1px dashed var(--border)', 
                    borderRadius: '8px'
                  }}
                >
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
