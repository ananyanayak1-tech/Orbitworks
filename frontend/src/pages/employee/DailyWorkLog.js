import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const DailyWorkLog = () => {
  const [todayWork, setTodayWork] = useState('');
  const [hours, setHours] = useState('');
  const [challenges, setChallenges] = useState('');
  const [tomorrowPlan, setTomorrowPlan] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('daily work log submitted successfully');
    setTodayWork('');
    setHours('');
    setChallenges('');
    setTomorrowPlan('');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div 
      className="card" 
      style={{ maxWidth: '600px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div>
        <h4 style={{ margin: 0, textTransform: 'lowercase', fontWeight: '600' }}>submit daily work log</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
          log your daily contributions, hours worked, and roadblocks faced
        </p>
      </div>

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
            fontSize: '0.85rem', 
            textTransform: 'lowercase' 
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textTransform: 'lowercase' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label>what did you work on today?</label>
          <textarea rows={3} required placeholder="describe today's tasks..." value={todayWork} onChange={(e) => setTodayWork(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label>hours worked</label>
          <input type="number" step="0.5" required min="1" max="24" placeholder="e.g. 8" value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label>challenges or roadblocks faced (optional)</label>
          <textarea rows={2} placeholder="describe any issues encountered..." value={challenges} onChange={(e) => setChallenges(e.target.value)} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label>what is your plan for tomorrow?</label>
          <textarea rows={2} required placeholder="describe planned tasks..." value={tomorrowPlan} onChange={(e) => setTomorrowPlan(e.target.value)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <button type="submit" className="primary">submit work log</button>
        </div>
      </form>
    </div>
  );
};

export default DailyWorkLog;
