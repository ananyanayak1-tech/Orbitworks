import React, { useState } from 'react';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { CheckSquare, Calendar, ShieldCheck, Megaphone, CheckCircle2, Circle, Clock, Activity } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const EmployeeDashboard = ({ tasks = [], attendance = [], leaveRequests = [], announcements = [], empRecord }) => {
  const myTasks = tasks.filter(t => t.assignedTo.includes(empRecord.id));
  const pendingTasksCount = myTasks.filter(t => (t.status || '').toLowerCase() !== 'completed').length;
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.employeeId === empRecord.id && a.date === today);
  const checkInStatusText = todayAttendance 
    ? `In: ${todayAttendance.checkIn || 'None'} / Out: ${todayAttendance.checkOut || 'None'}`
    : 'Not checked in';

  const upcomingDeadlines = myTasks
    .filter(t => (t.status || '').toLowerCase() !== 'completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  // Dynamic Activity Timeline
  const recentActivities = [
    { text: todayAttendance ? `Checked in today at ${todayAttendance.checkIn || '09:00 AM'}` : 'Attendance pending for today', time: 'Today', type: 'attendance' },
    { text: myTasks.length > 0 ? `Assigned to ${myTasks.length} projects & tasks` : 'No tasks assigned yet', time: '1 day ago', type: 'task' },
    { text: empRecord.phone ? 'Updated profile contact details' : 'Complete profile contact fields', time: '2 days ago', type: 'profile' }
  ];

  // Onboarding Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Submit Identity Proof Document', done: true },
    { id: 2, text: 'Log first Daily Attendance Check-In', done: !!todayAttendance },
    { id: 3, text: 'Complete Profile emergency contact details', done: !!empRecord.emergencyContact },
    { id: 4, text: 'Fill out skills list in Profile settings', done: !!(empRecord.skills && empRecord.skills.length > 0) },
    { id: 5, text: 'Read the latest Company Announcements', done: announcements.length > 0 }
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>Dashboard Overview</h2>
      <div className="stat-grid">
        <StatCard title="Pending Tasks" value={pendingTasksCount} icon={CheckSquare} />
        <StatCard title="Attendance Status" value={todayAttendance ? todayAttendance.status : 'Absent'} icon={ShieldCheck} description={checkInStatusText} />
        <StatCard title="Leave Requests" value={leaveRequests.filter(r => r.employeeId === empRecord.id && (r.status || '').toLowerCase() === 'pending').length} icon={Calendar} description="Pending Approvals" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Onboarding Checklist */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>Onboarding Checklist</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {checklist.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleChecklistItem(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.4rem 0.5rem', 
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {item.done ? (
                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                ) : (
                  <Circle size={18} style={{ color: 'var(--text-secondary)' }} />
                )}
                <span style={{ 
                  fontSize: '0.85rem', 
                  color: item.done ? 'var(--text-secondary)' : 'var(--text-primary)',
                  textDecoration: item.done ? 'line-through' : 'none'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>My Activity Timeline</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.25rem' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', left: '7px', top: '5px', bottom: '5px', width: '2px', backgroundColor: 'var(--border)' }} />
            
            {recentActivities.map((act, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {/* Bullet node */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-20px', 
                    top: '4px', 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--accent)',
                    border: '2px solid var(--surface)'
                  }} 
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {act.text}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={10} /> {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks & Deadlines */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>Upcoming Deadlines</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task) => (
                <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{task.title}</strong>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Project: {task.projectName}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Badge text={task.priority} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Due: {formatDate(task.deadline)}</span>
                  </div>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No upcoming deadlines. Great job!</span>
            )}
          </div>
        </div>

        {/* Company Announcements Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1' }}>
          <h4 style={{ margin: 0, fontWeight: '600' }}>Company Announcements</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {announcements.slice(0, 3).map((anc) => (
              <div key={anc.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <Megaphone size={14} style={{ color: 'var(--accent)', marginTop: '0.2rem' }} />
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{anc.title}</strong>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{anc.content.slice(0, 80)}...</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{formatDate(anc.date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
