import React from 'react';
import StatCard from '../../components/StatCard';
import { Users, Building2, Briefcase, CheckSquare, Clock } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

const CeoDashboard = ({ employees, departments, projects, tasks }) => {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => (e.status || '').toLowerCase() === 'active').length;
  const totalDepts = departments.length;
  const activeProjects = projects.filter(p => (p.status || '').toLowerCase() === 'active').length;
  const pendingTasks = tasks.filter(t => (t.status || '').toLowerCase() !== 'completed').length;
  const completedTasks = tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length;

  // Mock chart data aligning with design system colors
  const attendanceChartData = [
    { name: 'Mon', present: 4, wfh: 1, absent: 0 },
    { name: 'Tue', present: 3, wfh: 2, absent: 0 },
    { name: 'Wed', present: 5, wfh: 0, absent: 0 },
    { name: 'Thu', present: 4, wfh: 1, absent: 0 },
    { name: 'Fri', present: 3, wfh: 1, absent: 1 },
  ];

  const performanceChartData = [
    { name: 'Management', completionRate: 90, avgTimeDays: 2 },
    { name: 'HR', completionRate: 85, avgTimeDays: 3 },
    { name: 'Engineering', completionRate: 95, avgTimeDays: 4 },
    { name: 'Design', completionRate: 80, avgTimeDays: 3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>Dashboard Overview</h2>
      <div className="stat-grid">
        <StatCard title="Total Employees" value={totalEmployees} icon={Users} />
        <StatCard title="Active Employees" value={activeEmployees} icon={Users} description={`${totalEmployees - activeEmployees} Deactivated`} />
        <StatCard title="Departments" value={totalDepts} icon={Building2} />
        <StatCard title="Ongoing Projects" value={activeProjects} icon={Briefcase} />
        <StatCard title="Pending Tasks" value={pendingTasks} icon={Clock} highlight={true} />
        <StatCard title="Completed Tasks" value={completedTasks} icon={CheckSquare} description="All-Time Completed" />
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.1px' }}>Weekly Attendance Overview</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Bar dataKey="present" fill="var(--chart-present)" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="wfh" fill="var(--accent)" name="WFH" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="var(--danger)" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.1px' }}>Department Performance</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="completionRate" stroke="var(--chart-primary)" strokeWidth={2} name="Completion %" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="avgTimeDays" stroke="var(--accent)" strokeWidth={2} name="Avg Completion (Days)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeoDashboard;
