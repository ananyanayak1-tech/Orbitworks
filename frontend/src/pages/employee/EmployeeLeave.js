import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { createLeaveRequest } from '../../services/api';
import { FilePlus } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const EmployeeLeave = ({ leaveRequests, empRecord, onRefresh }) => {
  const { showToast } = useToast();
  const [leaveType, setLeaveType] = useState('casual leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest({
        employeeId: empRecord.id,
        employeeName: empRecord.name,
        leaveType,
        startDate,
        endDate,
        reason
      });
      showToast('Leave application submitted successfully!');
      setStartDate('');
      setEndDate('');
      setReason('');
      onRefresh();
    } catch (err) {
      showToast('Failed to submit leave request.', 'error');
      console.error(err);
    }
  };

  const myLeaves = leaveRequests.filter(r => r.employeeId === empRecord.id);

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Type', accessor: 'leaveType' },
    { header: 'Timeline', render: (row) => `${formatDate(row.startDate)} to ${formatDate(row.endDate)}` },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Status', render: (row) => <Badge text={row.status} /> }
  ];

  return (
    <div className="dashboard-grid">
      
      {/* Apply Form */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Apply for leave</h4>
        


        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Leave type</label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
              <option value="casual leave">Casual leave</option>
              <option value="sick leave">Sick leave</option>
              <option value="wfh">WFH</option>
              <option value="permission">Permission</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Start date</label>
              <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>End date</label>
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Reason</label>
            <textarea rows={3} required placeholder="State your reason..." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>

          <button 
            type="submit" 
            className="primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              marginTop: '0.5rem' 
            }}
          >
            <FilePlus size={16} /> Submit request
          </button>
        </form>
      </div>

      {/* History log */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>My leave requests</h4>
        <DataTable columns={columns} data={myLeaves} />
      </div>

    </div>
  );
};

export default EmployeeLeave;
