import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { createAnnouncement } from '../../services/api';
import { Plus, Megaphone, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const Announcements = ({ announcements, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('news');
  const [content, setContent] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAnnouncement({
        title,
        category,
        content,
        author: 'john doe' // CEO Name
      });
      showToast('Announcement posted successfully!');
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      showToast('Failed to post announcement.', 'error');
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.2px' }}>Announcements</h4>
        <button onClick={() => setIsModalOpen(true)} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Post Announcement
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.map((anc) => (
          <div key={anc.id} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', boxShadow: '0 4px 12px rgba(11,27,43,0.02)' }}>
            <div 
              style={{ 
                padding: '0.75rem', 
                backgroundColor: 'rgba(137, 225, 247, 0.15)', 
                borderRadius: '12px', 
                border: '1px solid var(--border)', 
                color: '#087E8B', 
                display: 'flex', 
                alignItems: 'center' 
              }}
            >
              <Megaphone size={20} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{anc.title}</h4>
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    backgroundColor: 'var(--border)', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '99px', 
                    color: 'var(--text-secondary)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {anc.category}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {anc.content}
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ fontWeight: '500' }}>Posted By: Rajesh Kumar</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {formatDate(anc.date)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post New Announcement">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Announcement Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="news">General News</option>
              <option value="policies">Company Policy</option>
              <option value="holidays">Holiday Info</option>
              <option value="events">Social & Events</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Announcement Message</label>
            <textarea rows={4} required value={content} onChange={(e) => setContent(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary">Post</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
