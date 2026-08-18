import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HrDashboard from './hr/HrDashboard';
import EmployeeRecords from './hr/EmployeeRecords';
import AttendanceManagement from './hr/AttendanceManagement';
import LeaveManagement from './hr/LeaveManagement';
import HolidayCalendar from './hr/HolidayCalendar';
import DocumentManagement from './hr/DocumentManagement';
import Announcements from './ceo/Announcements'; // Reusing announcements component!
import Chat from './Chat';
import { getEmployees, getAttendance, getLeaveRequests, getAnnouncements, getHolidays } from '../services/api';

const Hr = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  // Data states
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [emp, att, leave, anc, hol] = await Promise.all([
        getEmployees(),
        getAttendance(),
        getLeaveRequests(),
        getAnnouncements(),
        getHolidays()
      ]);
      setEmployees(emp);
      setAttendance(att);
      setLeaveRequests(leave);
      setAnnouncements(anc);
      setHolidays(hol);
    } catch (err) {
      console.error('failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
          loading dashboard data...
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <HrDashboard employees={employees} attendance={attendance} leaveRequests={leaveRequests} />;
      case 'employees':
        return <EmployeeRecords employees={employees} onRefresh={fetchData} />;
      case 'attendance':
        return <AttendanceManagement employees={employees} onRefresh={fetchData} />;
      case 'leave':
        return <LeaveManagement leaveRequests={leaveRequests} onRefresh={fetchData} />;
      case 'holidays':
        return <HolidayCalendar holidays={holidays} onRefresh={fetchData} />;
      case 'documents':
        return <DocumentManagement employees={employees} onRefresh={fetchData} />;
      case 'announcements':
        return <Announcements announcements={announcements} onRefresh={fetchData} />;
      case 'chat':
        return <Chat />;
      default:
        return <HrDashboard employees={employees} attendance={attendance} leaveRequests={leaveRequests} />;
    }
  };

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={(val) => {
          setSidebarCollapsed(val);
          localStorage.setItem('sidebar_collapsed', val);
        }}
      />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Hr;
