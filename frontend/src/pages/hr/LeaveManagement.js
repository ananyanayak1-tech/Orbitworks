import React from 'react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import { updateLeaveRequestStatus } from '../../services/api';
import { Check, X } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const LeaveManagement = ({ leaveRequests, onRefresh }) => {
  const { showToast } = useToast();
  const handleAction = async (id, status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      showToast(`Leave request successfully ${status}!`);
      onRefresh();
    } catch (err) {
      showToast('Failed to update leave request status.', 'error');
      console.error(err);
    }
  };

  const pendingLeaves = leaveRequests.filter(r => (r.status || '').toLowerCase() === 'pending');
  const processedLeaves = leaveRequests.filter(r => (r.status || '').toLowerCase() !== 'pending');

  const pendingColumns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Type', accessor: 'leaveType' },
    { header: 'Timeline', render: (row) => `${formatDate(row.startDate)} to ${formatDate(row.endDate)}` },
    { header: 'Reason', accessor: 'reason' },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            onClick={() => handleAction(row.id, 'approved')} 
            className="secondary"
            style={{ 
              padding: '0.25rem 0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              color: 'var(--success-text)', 
              backgroundColor: 'var(--success-bg)', 
              borderColor: 'var(--success)' 
            }}
            title="approve"
          >
            <Check size={14} />
          </button>
          <button 
            onClick={() => handleAction(row.id, 'rejected')} 
            className="secondary"
            style={{ 
              padding: '0.25rem 0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              color: 'var(--danger-text)', 
              backgroundColor: 'var(--danger-bg)', 
              borderColor: 'var(--danger)' 
            }}
            title="reject"
          >
            <X size={14} />
          </button>
        </div>
      )
    }
  ];

  const processedColumns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Type', accessor: 'leaveType' },
    { header: 'Timeline', render: (row) => `${formatDate(row.startDate)} to ${formatDate(row.endDate)}` },
    { header: 'Reason', accessor: 'reason' },
    { header: 'Status', render: (row) => <Badge text={row.status} /> }
  ];

  // Mock employee leave balance
  const balances = [
    { name: 'rohan sharma', casual: 10, sick: 8, wfh: 12, permission: 4 },
    { name: 'vikram singh', casual: 12, sick: 6, wfh: 15, permission: 3 },
    { name: 'priya iyer', casual: 8, sick: 10, wfh: 10, permission: 5 },
  ];

  const balanceColumns = [
    { header: 'Employee', accessor: 'name' },
    { header: 'Casual leave (days)', accessor: 'casual' },
    { header: 'Sick leave (days)', accessor: 'sick' },
    { header: 'WFH (days)', accessor: 'wfh' },
    { header: 'Permission (hours)', accessor: 'permission' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Leave Balances */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Leave balances</h4>
        <DataTable columns={balanceColumns} data={balances} searchKey="name" searchPlaceholder="Search balance..." />
      </div>

      {/* Pending Leave Requests */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Pending leave requests</h4>
        <DataTable columns={pendingColumns} data={pendingLeaves} searchKey="employeeName" searchPlaceholder="Search pending..." />
      </div>

      {/* History */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Leave history</h4>
        <DataTable columns={processedColumns} data={processedLeaves} searchKey="employeeName" searchPlaceholder="Search history..." />
      </div>

    </div>
  );
};

export default LeaveManagement;
