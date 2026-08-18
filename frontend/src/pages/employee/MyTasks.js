import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard';
import TaskCard from '../../components/TaskCard';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import DiscussionThread from '../../components/DiscussionThread';
import { updateTask, addTaskComment } from '../../services/api';
import { List, Kanban, Calendar, User, Upload } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const MyTasks = ({ tasks, empRecord, onRefresh }) => {
  const [viewType, setViewType] = useState('kanban'); // 'list' or 'kanban'
  const [selectedTask, setSelectedTask] = useState(null);

  // Form updates
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [fileUploadName, setFileUploadName] = useState('');

  const myTasks = tasks.filter(t => t.assignedTo.includes(empRecord.id));

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setStatus(task.status);
    setProgress(task.progress || 0);
    setFileUploadName('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updates = {
      status,
      progress: Number(progress)
    };

    if (fileUploadName) {
      const newAttachment = { name: fileUploadName, size: '2.5 mb' };
      updates.attachments = [...(selectedTask.attachments || []), newAttachment];
    }

    try {
      const updated = await updateTask(selectedTask.id, updates);
      setSelectedTask(updated);
      setFileUploadName('');
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (text) => {
    try {
      const updated = await addTaskComment(selectedTask.id, {
        senderName: empRecord.name,
        text
      });
      setSelectedTask(updated);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, textTransform: 'lowercase', fontWeight: '600' }}>my assigned tasks</h4>
        
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
          <button 
            onClick={() => setViewType('list')}
            className={viewType === 'list' ? 'primary' : 'secondary'}
            style={{ 
              padding: '0.4rem 0.8rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              border: 'none',
              borderRadius: 0,
              fontSize: '0.8rem'
            }}
          >
            <List size={14} />
            <span>list</span>
          </button>
          <button 
            onClick={() => setViewType('kanban')}
            className={viewType === 'kanban' ? 'primary' : 'secondary'}
            style={{ 
              padding: '0.4rem 0.8rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              border: 'none',
              borderRadius: 0,
              fontSize: '0.8rem'
            }}
          >
            <Kanban size={14} />
            <span>kanban</span>
          </button>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <KanbanBoard tasks={myTasks} onTaskClick={handleOpenTask} onTaskStatusChange={handleTaskStatusChange} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {myTasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => handleOpenTask(task)} />
          ))}
          {myTasks.length === 0 && (
            <div 
              className="card" 
              style={{ 
                gridColumn: 'span 3', 
                textAlign: 'center', 
                color: 'var(--text-secondary)', 
                padding: '3rem 0', 
                textTransform: 'lowercase' 
              }}
            >
              no tasks assigned to you.
            </div>
          )}
        </div>
      )}

      {/* Task Details Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="update task progress">
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textTransform: 'lowercase' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>id: {selectedTask.id}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge text={selectedTask.priority} />
                <Badge text={selectedTask.status} />
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>{selectedTask.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {selectedTask.description}
            </p>

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem', 
                borderTop: '1px solid var(--border)', 
                borderBottom: '1px solid var(--border)', 
                padding: '1rem 0', 
                fontSize: '0.85rem' 
              }}
            >
              <div>
                <strong>deadline:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>{formatDate(selectedTask.deadline)}</span>
                </div>
              </div>
              <div>
                <strong>assigned by:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  <User size={14} />
                  <span>{selectedTask.assignedBy || 'management'}</span>
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong>expected outcome:</strong>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>{selectedTask.expectedOutcome || 'none specified'}</p>
              </div>
            </div>

            {/* Attachments list */}
            <div>
              <strong>attachments:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem' }}>
                {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                  selectedTask.attachments.map((file, fIdx) => (
                    <div 
                      key={fIdx} 
                      style={{ 
                        fontSize: '0.8rem', 
                        padding: '0.3rem 0.5rem', 
                        backgroundColor: 'var(--bg)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '4px' 
                      }}
                    >
                      {file.name} ({file.size})
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>no attachments</span>
                )}
              </div>
            </div>

            {/* Update form */}
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>update progress:</strong>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label>status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="not started">not started</option>
                    <option value="in progress">in progress</option>
                    <option value="blocked">blocked</option>
                    <option value="under review">under review</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <label>progress percentage ({progress}%)</label>
                  <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} style={{ padding: 0 }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label>mock deliverable attachment</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="e.g. frontend_v2_code.zip" 
                    value={fileUploadName}
                    onChange={(e) => setFileUploadName(e.target.value)}
                    style={{ flex: 1, fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button 
                  type="submit" 
                  className="primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Upload size={14} /> save progress
                </button>
              </div>
            </form>

            <DiscussionThread comments={selectedTask.comments} onAddComment={handleAddComment} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTasks;
