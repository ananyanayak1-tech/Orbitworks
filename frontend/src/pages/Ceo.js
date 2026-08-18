import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CeoDashboard from './ceo/CeoDashboard';
import EmployeeManagement from './ceo/EmployeeManagement';
import DepartmentManagement from './ceo/DepartmentManagement';
import ProjectManagement from './ceo/ProjectManagement';
import TaskManagement from './ceo/TaskManagement';
import Announcements from './ceo/Announcements';
import Reports from './ceo/Reports';
import Chat from './Chat';
import { getEmployees, getDepartments, getProjects, getTasks, getAnnouncements } from '../services/api';

const Ceo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [emp, dept, proj, tsk, anc] = await Promise.all([
        getEmployees(),
        getDepartments(),
        getProjects(),
        getTasks(),
        getAnnouncements()
      ]);
      setEmployees(emp);
      setDepartments(dept);
      setProjects(proj);
      setTasks(tsk);
      setAnnouncements(anc);
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
        return <CeoDashboard employees={employees} departments={departments} projects={projects} tasks={tasks} />;
      case 'employees':
        return <EmployeeManagement employees={employees} onRefresh={fetchData} />;
      case 'departments':
        return <DepartmentManagement departments={departments} employees={employees} onRefresh={fetchData} />;
      case 'projects':
        return <ProjectManagement projects={projects} employees={employees} onRefresh={fetchData} />;
      case 'tasks':
        return <TaskManagement tasks={tasks} employees={employees} projects={projects} onRefresh={fetchData} />;
      case 'announcements':
        return <Announcements announcements={announcements} onRefresh={fetchData} />;
      case 'reports':
        return <Reports />;
      case 'chat':
        return <Chat />;
      default:
        return <CeoDashboard employees={employees} departments={departments} projects={projects} tasks={tasks} />;
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

export default Ceo;
