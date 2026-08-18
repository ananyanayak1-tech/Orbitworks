import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { createProject, updateProject } from '../../services/api';
import { Plus, Calendar, User, Edit2 } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const ProjectManagement = ({ projects, employees, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [manager, setManager] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  const openAddModal = () => {
    setSelectedProject(null);
    setName('');
    setManager('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setProgress(0);
    setIsModalOpen(true);
  };

  const openEditModal = (proj) => {
    setSelectedProject(proj);
    setName(proj.name);
    setManager(proj.manager || '');
    setStartDate(proj.startDate || '');
    setEndDate(proj.endDate || '');
    setDescription(proj.description || '');
    setProgress(proj.progress || 0);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const projData = {
      name,
      manager,
      startDate,
      endDate,
      description,
      progress: Number(progress)
    };

    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, projData);
        showToast('Project updated successfully!');
      } else {
        await createProject(projData);
        showToast('Project created successfully!');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast('Failed to save project.', 'error');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.2px' }}>Projects</h4>
        <button onClick={openAddModal} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Create Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {projects.map((proj) => {
          const projectMilestones = proj.milestones || [
            { text: 'Requirements Analysis', completed: proj.progress >= 20 },
            { text: 'UI/UX Design Approval', completed: proj.progress >= 40 },
            { text: 'Frontend Prototype build', completed: proj.progress >= 60 },
            { text: 'Backend Integration', completed: proj.progress >= 80 },
            { text: 'Deployment & Launch', completed: proj.progress >= 100 }
          ];

          return (
            <div key={proj.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', boxShadow: '0 4px 12px rgba(11,27,43,0.02)', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{proj.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {proj.id}</span>
                </div>
                <button 
                  onClick={() => openEditModal(proj)} 
                  className="secondary" 
                  style={{ padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center' }}
                  title="Edit Project"
                >
                  <Edit2 size={12} />
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '3em', lineHeight: '1.4' }}>
                {proj.description || 'No description provided'}
              </p>

              {/* Milestones list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Milestones:</span>
                {projectMilestones.map((m, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      const updated = projectMilestones.map((item, i) => i === idx ? { ...item, completed: !item.completed } : item);
                      const completedCount = updated.filter(item => item.completed).length;
                      const nextProgress = Math.round((completedCount / updated.length) * 100);
                      updateProject(proj.id, { ...proj, milestones: updated, progress: nextProgress }).then(onRefresh);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    <input type="checkbox" checked={m.completed} readOnly style={{ cursor: 'pointer' }} />
                    <span style={{ color: m.completed ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                      {m.text}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Progress</span>
                  <strong>{proj.progress}%</strong>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                    <User size={14} />
                    <span>Manager</span>
                  </div>
                  <strong>{proj.manager || 'Unassigned'}</strong>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                    <Calendar size={14} />
                    <span>Timeline</span>
                  </div>
                  <strong>{formatDate(proj.startDate)} / {formatDate(proj.endDate)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProject ? 'Edit Project' : 'Create Project'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Project Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Project Manager</label>
            <select value={manager} onChange={(e) => setManager(e.target.value)}>
              <option value="">Select manager...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Start Date</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>End Date</label>
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {selectedProject && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Progress ({progress}%)</label>
              <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(e.target.value)} style={{ padding: 0 }} />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
