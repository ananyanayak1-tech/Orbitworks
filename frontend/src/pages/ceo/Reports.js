import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/dateFormatter';

const Reports = () => {
  const [reports, setReports] = useState([
    { title: 'Attendance Report Q2', desc: 'Detailed records of check-ins, check-outs, leave logs, and overtime hours.', date: '2026-07-31' },
    { title: 'Task Performance Stats', desc: 'Evaluation metrics mapping employee task completion ratios, deadlines missed, and task efficiency.', date: '2026-07-28' },
    { title: 'Departmental Cost Analysis', desc: 'Financial summaries showing budget allocations, employee payouts (excluding salary details), and resource utilization.', date: '2026-07-25' },
    { title: 'Active Projects Progress Log', desc: 'Real-time milestones tracking document for ongoing customer commitments and sprint targets.', date: '2026-07-20' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [reportType, setReportType] = useState('Attendance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = (type, reportTitle) => {
    alert(`Exporting "${reportTitle}" as ${type}... (simulated download)`);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    
    // Construct default description if blank
    const finalDesc = desc.trim() || `${reportType} analysis generated for timeline ${startDate || 'N/A'} to ${endDate || 'N/A'}.`;
    
    const newReport = {
      title: title.trim(),
      desc: finalDesc,
      date: new Date().toISOString().split('T')[0]
    };

    setReports([newReport, ...reports]);
    setIsModalOpen(false);

    // Reset fields
    setTitle('');
    setDesc('');
    setReportType('Attendance');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>Performance Reports</h4>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Create Report
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reports.map((rep, idx) => (
          <div 
            key={idx} 
            className="card" 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              gap: '1.25rem',
              flexWrap: 'wrap',
              boxShadow: '0 4px 12px rgba(11,27,43,0.02)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '250px' }}>
              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>{rep.title}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '600px' }}>
                {rep.desc}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>
                Generated Date: {formatDate(rep.date)}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleExport('PDF', rep.title)} 
                className="secondary" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FileText size={14} /> Export PDF
              </button>
              <button 
                onClick={() => handleExport('Excel', rep.title)} 
                className="secondary" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.8rem', 
                  padding: '0.5rem 0.75rem'
                }}
              >
                <FileSpreadsheet size={14} /> Export Excel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Report">
        <form onSubmit={handleCreateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Report Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Q3 Sales & Attendance Summary" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="Attendance">Attendance</option>
              <option value="Tasks">Tasks</option>
              <option value="Departments">Departments</option>
              <option value="Projects">Projects</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Start Date</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>End Date</label>
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Description (Optional)</label>
            <textarea 
              rows={3} 
              placeholder="Provide context, parameters or notes for this report..." 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)} 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary">Generate</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reports;
