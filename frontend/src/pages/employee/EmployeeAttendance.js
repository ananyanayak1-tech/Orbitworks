import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { getEmployeeAttendanceHistory, checkIn as apiCheckIn, checkOut as apiCheckOut } from '../../services/api';
import { LogIn, LogOut, CheckCircle2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const EmployeeAttendance = ({ empRecord }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const records = await getEmployeeAttendanceHistory(empRecord.id);
      setHistory(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = history.find(h => h.date === today);

  const handleCheckIn = async () => {
    try {
      await apiCheckIn(empRecord.id);
      setMessage('checked in successfully');
      fetchHistory();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      await apiCheckOut(empRecord.id);
      setMessage('checked out successfully');
      fetchHistory();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'date', accessor: 'date' },
    { header: 'check in', render: (row) => row.checkIn || '-' },
    { header: 'check out', render: (row) => row.checkOut || '-' },
    { header: 'status', render: (row) => <Badge text={row.status} /> }
  ];

  // Calculations for monthly summary
  const presentDays = history.filter(h => String(h.status).toLowerCase() === 'present').length;
  const lateDays = history.filter(h => String(h.status).toLowerCase() === 'late entry').length;
  const wfhDays = history.filter(h => String(h.status).toLowerCase() === 'wfh').length;
  const absentDays = history.filter(h => String(h.status).toLowerCase() === 'absent').length;

  const initials = empRecord.name ? empRecord.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {message && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--success-bg)', 
            color: 'var(--success-text)', 
            border: '1px solid var(--success)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            fontSize: '0.85rem'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Buttons Action card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'center' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>clock register</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>register check-ins and check-outs for daily attendance logs</p>
          
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button 
              disabled={!!todayRecord?.checkIn}
              onClick={handleCheckIn}
              className="primary" 
              style={{ flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <LogIn size={16} /> check in
            </button>
            
            <button 
              disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
              onClick={handleCheckOut}
              className="secondary" 
              style={{ flex: 1, minWidth: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <LogOut size={16} /> check out
            </button>

            <button 
              onClick={() => setIsBadgeOpen(true)}
              className="primary" 
              style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', color: '#0B1B2B', border: '1px solid var(--accent)' }}
            >
              <QrCode size={16} /> Show Attendance QR Badge
            </button>
          </div>
          
          <div 
            style={{ 
              borderTop: '1px solid var(--border)', 
              paddingTop: '1rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.25rem', 
              fontSize: '0.8rem', 
              color: 'var(--text-secondary)' 
            }}
          >
            <span>today status: <strong>{todayRecord ? todayRecord.status : 'not registered'}</strong></span>
            <span>check-in time: <strong>{todayRecord?.checkIn || 'none'}</strong></span>
            <span>check-out time: <strong>{todayRecord?.checkOut || 'none'}</strong></span>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>monthly attendance summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', backgroundColor: 'var(--bg)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>present days</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.25rem' }}>{presentDays}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', backgroundColor: 'var(--bg)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>wfh days</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.25rem' }}>{wfhDays}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', backgroundColor: 'var(--bg)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>late entry days</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.25rem' }}>{lateDays}</div>
            </div>
            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem', backgroundColor: 'var(--bg)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>absent days</span>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', marginTop: '0.25rem' }}>{absentDays}</div>
            </div>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>attendance history</h4>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>
            loading history...
          </div>
        ) : (
          <DataTable columns={columns} data={history} />
        )}
      </div>

      {/* Digital QR ID Badge Modal */}
      <Modal isOpen={isBadgeOpen} onClose={() => setIsBadgeOpen(false)} title="My Digital Attendance Badge">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0' }}>
          
          {/* Badge Layout Card */}
          <div 
            style={{ 
              width: '280px', 
              borderRadius: '16px', 
              border: '2px solid var(--accent)', 
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.5rem',
              textAlign: 'center',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Band */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', backgroundColor: 'var(--accent)' }} />

            {/* OrbitWorks logo label */}
            <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '0.5rem' }}>
              OrbitWorks Badge
            </span>

            {/* User Details */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div 
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #1A365D 100%)', 
                  color: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold', 
                  fontSize: '1.25rem',
                  border: '2px solid var(--accent)'
                }}
              >
                {initials}
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{empRecord.name}</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{empRecord.designation}</span>
              <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--border)', color: 'var(--text-secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                ID: {empRecord.id}
              </span>
            </div>

            {/* QR Code Container */}
            <div style={{ border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
              <QRCodeSVG 
                value={`ORBITWORKS_BADGE_${empRecord.id}`} 
                size={140}
                fgColor="#0B1B2B"
                bgColor="#FFFFFF"
                level="M"
              />
            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Hold this badge up to the office tablet scanner to check in/out.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', width: '100%' }}>
            <button type="button" className="primary" onClick={() => setIsBadgeOpen(false)}>Close Badge</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default EmployeeAttendance;
