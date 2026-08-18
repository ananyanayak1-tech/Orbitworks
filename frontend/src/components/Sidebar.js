import React from 'react';
import { useAuth } from '../context/AuthContext';
import picLogo from '../assets/pic.png';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FolderGit, 
  CheckSquare, 
  Megaphone, 
  BarChart3, 
  Clock, 
  CalendarRange, 
  CalendarDays, 
  Files, 
  User, 
  ClipboardList, 
  Bell,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();
  const [hoveredId, setHoveredId] = React.useState(null);
  if (!user) return null;

  const role = (user.role || '').toLowerCase();

  const getMenuItems = () => {
    if (role === 'ceo') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'projects', label: 'Projects', icon: FolderGit },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'chat', label: 'Chat', icon: MessageSquare }
      ];
    } else if (role === 'hr') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leaves', icon: CalendarRange },
        { id: 'holidays', label: 'Holidays', icon: CalendarDays },
        { id: 'documents', label: 'Documents', icon: Files },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'chat', label: 'Chat', icon: MessageSquare }
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'worklog', label: 'Work Log', icon: ClipboardList },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'leave', label: 'Leaves', icon: CalendarRange },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'chat', label: 'Chat', icon: MessageSquare }
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001,
          }}
          className="mobile-overlay-toggle"
        />
      )}

      {/* Sidebar container */}
      <div 
        className="sidebar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1002,
          boxSizing: 'border-box'
        }}
      >
        <div 
          style={{ 
            padding: isCollapsed ? '1.5rem 0.5rem' : '1.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isCollapsed ? 'center' : 'space-between',
            borderBottom: '1px solid rgba(229, 226, 220, 0.1)',
            flexDirection: isCollapsed ? 'column' : 'row',
            gap: isCollapsed ? '0.75rem' : '0'
          }}
        >
          {isCollapsed ? (
            <img 
              src={picLogo} 
              alt="Logo" 
              style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} 
            />
          ) : (
            <div className="sidebar-text" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <img 
                src={picLogo} 
                alt="Logo" 
                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--accent)', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                  OrbitWorks
                </span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.75)', marginTop: '0.1rem' }}>
                  {role === 'ceo' ? 'CEO Dashboard' : role === 'hr' ? 'HR & Admin Panel' : 'Employee Portal'}
                </span>
              </div>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="mobile-only"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--surface)', 
              cursor: 'pointer',
              padding: 0
            }}
          >
            <X size={20} />
          </button>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="desktop-only"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'rgba(255, 255, 255, 0.65)', 
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              outline: 'none'
            }}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: isCollapsed ? 'center' : 'stretch' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  gap: isCollapsed ? '0' : '0.75rem',
                  width: isCollapsed ? 'calc(100% - 0.75rem)' : 'calc(100% - 1.5rem)',
                  margin: isCollapsed ? '0.15rem 0.375rem' : '0.15rem 0.75rem',
                  padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
                  backgroundColor: isActive 
                    ? 'rgba(137, 225, 247, 0.08)' 
                    : (hoveredId === item.id ? 'rgba(255, 255, 255, 0.04)' : 'transparent'),
                  border: 'none',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isActive ? 'var(--accent)' : (hoveredId === item.id ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.65)'),
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--accent)' : 'inherit' }} />
                {!isCollapsed && <span className="sidebar-text" style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div 
          style={{ 
            padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.5rem', 
            borderTop: '1px solid rgba(229, 226, 220, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: isCollapsed ? '0' : '0.75rem',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--accent)', 
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                flexShrink: 0
              }}
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="sidebar-text" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
