import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { getAttendance, markAttendanceManually } from '../../services/api';
import { Calendar, QrCode, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

const AttendanceManagement = ({ employees = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [scanSuccess, setScanSuccess] = useState(null); // true / false / null

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const records = await getAttendance(selectedDate);
      setAttendance(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // HTML5 QR Code Scanner Lifecycle for the Gate Scanner Tablet
  useEffect(() => {
    if (!isGateScannerOpen) return;

    let scanner = null;
    const containerId = "gate-scanner-container";

    const timer = setTimeout(() => {
      try {
        scanner = new Html5QrcodeScanner(
          containerId,
          { 
            fps: 10, 
            qrbox: { width: 220, height: 220 },
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
          },
          /* verbose= */ false
        );

        const onScanSuccess = async (decodedText) => {
          // Process scanned key badge
          if (decodedText.startsWith('ORBITWORKS_BADGE_')) {
            const empId = decodedText.replace('ORBITWORKS_BADGE_', '');
            handleScanGateCheckIn(empId);
          } else {
            setScanSuccess(false);
            setScanMessage(`Invalid badge scan: "${decodedText}"`);
            setTimeout(() => { setScanMessage(''); setScanSuccess(null); }, 4000);
          }
        };

        const onScanFailure = () => {
          // Silent failure on scanning empty frames
        };

        scanner.render(onScanSuccess, onScanFailure);
      } catch (err) {
        console.error("Gate scanner initialization error:", err);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(err => console.error("Gate scanner clear on unmount error:", err));
      }
    };
  }, [isGateScannerOpen]);

  const handleScanGateCheckIn = async (empId) => {
    const targetEmp = employees.find(e => e.id === empId);
    if (!targetEmp) {
      setScanSuccess(false);
      setScanMessage(`Employee ID ${empId} not found in directory.`);
      setTimeout(() => { setScanMessage(''); setScanSuccess(null); }, 4000);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.employeeId === empId && a.date === todayStr);
    const nowTime = new Date().toTimeString().slice(0, 5); // "HH:MM"

    let actionType = 'checked in';
    let data = {
      employeeId: empId,
      date: todayStr,
      status: 'present',
      checkIn: existing ? (existing.checkIn || nowTime) : nowTime,
      checkOut: ''
    };

    // If already checked in but hasn't checked out, trigger checkout
    if (existing && existing.checkIn) {
      data.checkOut = nowTime;
      actionType = 'checked out';
    }

    try {
      await markAttendanceManually(data);
      setScanSuccess(true);
      setScanMessage(`Access Granted: ${targetEmp.name} ${actionType} at ${nowTime}`);
      fetchAttendance();
      setTimeout(() => { setScanMessage(''); setScanSuccess(null); }, 4000);
    } catch (err) {
      console.error(err);
      setScanSuccess(false);
      setScanMessage(`Failed to log gate attendance for ${targetEmp.name}`);
      setTimeout(() => { setScanMessage(''); setScanSuccess(null); }, 4000);
    }
  };

  const handleMark = async (empId, status) => {
    const existing = attendance.find(a => a.employeeId === empId);
    const data = {
      employeeId: empId,
      date: selectedDate,
      status,
      checkIn: existing?.checkIn || '09:00',
      checkOut: existing?.checkOut || '17:00'
    };
    try {
      await markAttendanceManually(data);
      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeChange = async (empId, field, val) => {
    const existing = attendance.find(a => a.employeeId === empId);
    const data = {
      employeeId: empId,
      date: selectedDate,
      status: existing?.status || 'present',
      checkIn: field === 'checkIn' ? val : (existing?.checkIn || '09:00'),
      checkOut: field === 'checkOut' ? val : (existing?.checkOut || '17:00')
    };
    try {
      await markAttendanceManually(data);
      fetchAttendance();
    } catch (err) {
      console.error(err);
    }
  };

  const tableData = employees.map(emp => {
    const record = attendance.find(a => a.employeeId === emp.id);
    return {
      empId: emp.id,
      name: emp.name,
      status: record?.status || 'absent',
      checkIn: record?.checkIn || '',
      checkOut: record?.checkOut || ''
    };
  });

  const columns = [
    { header: 'Id', accessor: 'empId' },
    { header: 'Employee', accessor: 'name' },
    {
      header: 'Status',
      render: (row) => (
        <select 
          value={row.status} 
          onChange={(e) => handleMark(row.empId, e.target.value)}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late entry">Late entry</option>
          <option value="half day">Half day</option>
          <option value="wfh">WFH</option>
          <option value="leave">Leave</option>
        </select>
      )
    },
    {
      header: 'Check in',
      render: (row) => (
        <input 
          type="time" 
          value={row.checkIn} 
          onChange={(e) => handleTimeChange(row.empId, 'checkIn', e.target.value)}
          disabled={row.status === 'absent' || row.status === 'leave'}
          style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
        />
      )
    },
    {
      header: 'Check out',
      render: (row) => (
        <input 
          type="time" 
          value={row.checkOut} 
          onChange={(e) => handleTimeChange(row.empId, 'checkOut', e.target.value)}
          disabled={row.status === 'absent' || row.status === 'leave'}
          style={{ padding: '0.3rem 0.5rem', fontSize: '0.85rem' }}
        />
      )
    },
    {
      header: 'Badge',
      render: (row) => <Badge text={row.status} />
    }
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Action Header */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '1rem'
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontWeight: '600' }}>Attendance Tracking System</h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage daily register logs manually or launch the front gate scanner tablet</span>
        </div>

        <button 
          onClick={() => setIsGateScannerOpen(true)}
          className="primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--accent)', color: '#0B1B2B', border: '1px solid var(--accent)' }}
        >
          <QrCode size={16} /> Launch Office Gate Scanner
        </button>
      </div>

      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}
      >
        <h4 style={{ margin: 0, fontWeight: '600' }}>Manual attendance register</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '0.5rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
          Loading attendance logs...
        </div>
      ) : (
        <DataTable columns={columns} data={tableData} searchKey="name" searchPlaceholder="Search employees..." />
      )}

      {/* Front-Desk Gate Scanner Modal */}
      <Modal isOpen={isGateScannerOpen} onClose={() => setIsGateScannerOpen(false)} title="Office Entrance Gate Scanner">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: 0 }}>
            Tablet Scanner Mode: Employees show their phone ID Badges to this camera to log attendance.
          </p>

          {/* Real-time Status Alert Banner */}
          {scanMessage && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: scanSuccess ? 'var(--success-bg)' : 'var(--danger-bg)', 
                color: scanSuccess ? 'var(--success-text)' : 'var(--danger-text)', 
                border: `1px solid ${scanSuccess ? 'var(--success)' : 'var(--danger)'}`, 
                padding: '0.75rem 1rem', 
                borderRadius: '8px', 
                fontSize: '0.85rem',
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {scanSuccess ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
              <strong>{scanMessage}</strong>
            </div>
          )}

          {/* Camera Scanner Box */}
          <div 
            id="gate-scanner-container" 
            style={{ 
              width: '100%', 
              maxWidth: '350px', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid var(--border)',
              backgroundColor: '#000000'
            }} 
          />

          {/* Developer Simulator panel */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'center' }}>
              Developer Gate Simulator: Click to scan employee key badges
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.4rem', width: '100%' }}>
              {employees.slice(0, 4).map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  className="secondary"
                  onClick={() => handleScanGateCheckIn(emp.id)}
                  style={{ fontSize: '0.75rem', padding: '0.4rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                >
                  Scan {emp.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '0.5rem' }}>
            <button type="button" className="primary" onClick={() => setIsGateScannerOpen(false)}>Close Scanner</button>
          </div>

        </div>
      </Modal>

    </div>
  );
};

export default AttendanceManagement;
