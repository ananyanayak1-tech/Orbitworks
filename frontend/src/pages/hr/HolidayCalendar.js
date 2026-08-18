import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { createHoliday } from '../../services/api';
import { Plus, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const HolidayCalendar = ({ holidays, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('public');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createHoliday({ title, date, type });
      showToast('Holiday added successfully!');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast('Failed to add holiday.', 'error');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, textTransform: 'lowercase', fontWeight: '600' }}>holiday calendar</h4>
        <button onClick={() => setIsModalOpen(true)} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', textTransform: 'lowercase' }}>
          <Plus size={16} /> add holiday
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {holidays.map((h) => (
          <div key={h.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div 
              style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--bg)', 
                borderRadius: '8px', 
                border: '1px solid var(--border)', 
                color: 'var(--accent)', 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <Calendar size={20} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', textTransform: 'lowercase' }}>
              <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{h.title}</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatDate(h.date)}</span>
                <Badge text={h.type} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="add new holiday">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textTransform: 'lowercase' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>holiday title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>type of holiday</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="public">public</option>
              <option value="company">company holiday</option>
              <option value="optional">optional leave</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>cancel</button>
            <button type="submit" className="primary">add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HolidayCalendar;
