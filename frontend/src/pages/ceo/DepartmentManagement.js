import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { createDepartment, updateDepartment } from '../../services/api';
import { Plus, Users, Landmark, Edit2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DepartmentManagement = ({ departments, employees, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [head, setHead] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setSelectedDept(null);
    setName('');
    setHead('');
    setBudget('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setSelectedDept(dept);
    setName(dept.name);
    setHead(dept.head || '');
    setBudget(dept.budget || '');
    setDescription(dept.description || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const deptData = {
      name,
      head,
      budget,
      description
    };

    try {
      if (selectedDept) {
        await updateDepartment(selectedDept.id, deptData);
        showToast('Department updated successfully!');
      } else {
        await createDepartment(deptData);
        showToast('Department created successfully!');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast('Failed to save department.', 'error');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.2px' }}>Departments</h4>
        <button onClick={openAddModal} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Create Department
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {departments.map((dept) => (
          <div key={dept.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(11,27,43,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{dept.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {dept.id}</span>
              </div>
              <button 
                onClick={() => openEditModal(dept)} 
                className="secondary" 
                style={{ padding: '0.35rem 0.5rem', display: 'flex', alignItems: 'center' }}
                title="Edit Department"
              >
                <Edit2 size={12} />
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '3em', lineHeight: '1.4' }}>
              {dept.description || 'No description provided'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem', fontSize: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  <Users size={14} />
                  <span>Employees</span>
                </div>
                <strong>{dept.employeesCount || 0} Active</strong>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                  <Landmark size={14} />
                  <span>Budget</span>
                </div>
                <strong>{dept.budget || 'N/A'}</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Department Head:</span>
              <div style={{ fontWeight: '600', marginTop: '0.2rem', color: 'var(--text-primary)' }}>{dept.head || 'Unassigned'}</div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDept ? 'Edit Department' : 'Create Department'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Department Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Department Head</label>
            <select value={head} onChange={(e) => setHead(e.target.value)}>
              <option value="">Select head...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Annual Budget</label>
            <input type="text" placeholder="e.g. $100,000/yr" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>

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

export default DepartmentManagement;
