import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import DiscussionThread from '../../components/DiscussionThread';
import { createTask, updateTask, addTaskComment, deleteTaskComment } from '../../services/api';
import { Plus, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const getTaskCode = (task) => {
  if (!task) return '';
  if (task.taskCode) return task.taskCode;
  const idStr = String(task._id || task.id || '');
  if (idStr.endsWith('9c')) return 'TSK-101';
  if (idStr.endsWith('9d')) return 'TSK-102';
  if (idStr.endsWith('9e')) return 'TSK-103';
  if (idStr.length > 5) {
    return `TSK-${idStr.slice(-5).toUpperCase()}`;
  }
  return 'TSK-100';
};

const TaskManagement = ({ tasks, employees, projects, onRefresh }) => {
  const { showToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tempStatus, setTempStatus] = useState('');

  // Form fields for creation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [expectedOutcome, setExpectedOutcome] = useState('');

  const openCreateModal = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setProjectName(projects[0]?.name || '');
    setStartDate('');
    setDeadline('');
    setAssignedTo([]);
    setExpectedOutcome('');
    setIsCreateModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      priority,
      projectName,
      startDate,
      deadline,
      assignedTo,
      expectedOutcome,
      assignedBy: 'john doe' // Mock CEO name
    };

    try {
      await createTask(taskData);
      showToast('Task created successfully!');
      setIsCreateModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast('Failed to create task.', 'error');
      console.error(err);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTempStatus(task.status || 'not started');
  };

  const handlePost = async (text) => {
    const hasStatusChanged = tempStatus && tempStatus !== selectedTask.status;
    const hasComment = text && text.trim() !== '';
    if (!hasStatusChanged && !hasComment) return;

    try {
      let updatedTaskObj = selectedTask;
      const taskId = selectedTask._id || selectedTask.id;
      
      // 1. If status has changed, update status in DB
      if (hasStatusChanged) {
        updatedTaskObj = await updateTask(taskId, { status: tempStatus });
      }
      
      // 2. If there is a comment text, add comment
      if (hasComment) {
        updatedTaskObj = await addTaskComment(taskId, {
          senderName: 'john doe', // Mock CEO name
          text: text.trim()
        });
      }
      
      setSelectedTask(null);
      onRefresh();
      showToast('Task details updated successfully!');
    } catch (err) {
      showToast('Failed to save update.', 'error');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updated = await deleteTaskComment(selectedTask._id || selectedTask.id, commentId);
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

  const getAssignedNames = (empIds = []) => {
    return empIds
      .map(id => employees.find(e => e.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.2px' }}>Task Boards</h4>
        <button onClick={openCreateModal} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Assign Task
        </button>
      </div>

      <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} onTaskStatusChange={handleTaskStatusChange} />

      {/* View Task Details Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details">
        {selectedTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Task ID: {getTaskCode(selectedTask)}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Badge text={selectedTask.priority} />
                <Badge text={selectedTask.status} />
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedTask.title}</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{selectedTask.description}</p>
            
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
                <strong style={{ fontWeight: '600' }}>Timeline:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} />
                  <span>{formatDate(selectedTask.startDate || selectedTask.createdAt)} / {formatDate(selectedTask.deadline || selectedTask.dueDate)}</span>
                </div>
              </div>
              <div>
                <strong style={{ fontWeight: '600' }}>Assigned To:</strong>
                <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  {getAssignedNames(selectedTask.assignedTo)}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <strong style={{ fontWeight: '600' }}>Expected Outcome:</strong>
                <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  {selectedTask.expectedOutcome || 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ fontWeight: '600', fontSize: '0.85rem' }}>Status Update:</strong>
              <select 
                value={tempStatus} 
                onChange={(e) => setTempStatus(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
              >
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="under review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <DiscussionThread 
              comments={selectedTask.comments} 
              onAddComment={handlePost} 
              onDeleteComment={handleDeleteComment} 
            />
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Assign New Task">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Task Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Description</label>
            <textarea 
              rows={3} 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ fontSize: '0.95rem', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Project</label>
              <select 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Start Date</label>
              <input 
                type="date" 
                required 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                style={{ fontSize: '0.95rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Deadline</label>
              <input 
                type="date" 
                required 
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Assign To Employees (Hold Ctrl to select multiple)</label>
            <select 
              multiple 
              required
              value={assignedTo} 
              onChange={(e) => {
                const options = [...e.target.selectedOptions];
                setAssignedTo(options.map(opt => opt.value));
              }}
              style={{ minHeight: '120px', borderRadius: '8px', border: '1.5px solid var(--card-border)', fontSize: '0.95rem' }}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.designation})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: '600' }}>Expected Outcome</label>
            <input 
              type="text" 
              placeholder="e.g. Documentation, files, tests passed" 
              value={expectedOutcome} 
              onChange={(e) => setExpectedOutcome(e.target.value)} 
              style={{ fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsCreateModalOpen(false)} style={{ fontSize: '0.95rem' }}>Cancel</button>
            <button type="submit" className="primary" style={{ fontSize: '0.95rem', minWidth: '100px' }}>Assign</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
