import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import EmployeeDashboard from './employee/EmployeeDashboard';
import MyProfile from './employee/MyProfile';
import MyTasks from './employee/MyTasks';
import DailyWorkLog from './employee/DailyWorkLog';
import EmployeeAttendance from './employee/EmployeeAttendance';
import EmployeeLeave from './employee/EmployeeLeave';
import EmployeeNotifications from './employee/EmployeeNotifications';
import Chat from './Chat';
import { useAuth } from '../context/AuthContext';
import { getEmployees, getAttendance, getLeaveRequests, getTasks, getAnnouncements, getNotifications } from '../services/api';

const Employee = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  // Data states
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showLoading = false) => {
    if (!user) return;
    if (showLoading) setLoading(true);
    try {
      const [emp, att, leave, tsk, anc, notif] = await Promise.all([
        getEmployees(),
        getAttendance(),
        getLeaveRequests(),
        getTasks(),
        getAnnouncements(),
        getNotifications(user.id)
      ]);
      setEmployees(emp);
      setAttendance(att);
      setLeaveRequests(leave);
      setTasks(tsk);
      setAnnouncements(anc);
      setNotifications(notif);
    } catch (err) {
      console.error('failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const empRecord = employees.find(e => e.email.toLowerCase() === user?.email?.toLowerCase()) || {};

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)', textTransform: 'lowercase' }}>
          loading employee portal...
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <EmployeeDashboard 
            tasks={tasks} 
            attendance={attendance} 
            leaveRequests={leaveRequests} 
            announcements={announcements} 
            empRecord={empRecord} 
          />
        );
      case 'profile':
        return <MyProfile empRecord={empRecord} onRefresh={fetchData} />;
      case 'tasks':
        return <MyTasks tasks={tasks} empRecord={empRecord} onRefresh={fetchData} />;
      case 'worklog':
        return <DailyWorkLog />;
      case 'attendance':
        return <EmployeeAttendance empRecord={empRecord} />;
      case 'leave':
        return <EmployeeLeave leaveRequests={leaveRequests} empRecord={empRecord} onRefresh={fetchData} />;
      case 'notifications':
        return <EmployeeNotifications notifications={notifications} onRefresh={fetchData} />;
      case 'chat':
        return <Chat />;
      default:
        return (
          <EmployeeDashboard 
            tasks={tasks} 
            attendance={attendance} 
            leaveRequests={leaveRequests} 
            announcements={announcements} 
            empRecord={empRecord} 
          />
        );
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

export default Employee;
