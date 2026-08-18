import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import { createEmployee, updateEmployee } from '../../services/api';
import { Edit2, ToggleLeft, ToggleRight, Plus, Eye } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { useToast } from '../../context/ToastContext';

const EmployeeManagement = ({ employees, onRefresh }) => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  // Search filters
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [skills, setSkills] = useState('');
  const [username, setUsername] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [assets, setAssets] = useState('');
  const [role, setRole] = useState('');

  const openAddModal = () => {
    setSelectedEmp(null);
    setName('');
    setEmail('');
    setDepartment('');
    setDesignation('');
    setPhone('');
    setEmergencyContact('');
    setJoiningDate('');
    setSkills('');
    setUsername('');
    setEmpPassword('');
    setAssets('');
    setRole('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setEmail(emp.email);
    setDepartment(emp.department);
    setDesignation(emp.designation);
    setPhone(emp.phone);
    setEmergencyContact(emp.emergencyContact);
    setJoiningDate(emp.joiningDate);
    setSkills(emp.skills ? emp.skills.join(', ') : '');
    setUsername(emp.username || emp.email || '');
    setEmpPassword(emp.password || 'password');
    setAssets(emp.assets ? emp.assets.join(', ') : '');
    setRole(emp.role || '');
    setIsModalOpen(true);
  };

  const openViewProfile = (emp) => {
    setSelectedEmp(emp);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = async (emp) => {
    const nextStatus = (emp.status || '').toLowerCase() === 'active' ? 'Deactivated' : 'Active';
    await updateEmployee(emp.id, { status: nextStatus });
    showToast(`Employee status updated to ${nextStatus}!`);
    onRefresh();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const assetsArray = assets.split(',').map(a => a.trim()).filter(Boolean);
    const empData = {
      name,
      email,
      department,
      designation,
      phone,
      emergencyContact,
      joiningDate,
      skills: skillsArray,
      username,
      password: empPassword,
      assets: assetsArray,
      role
    };

    try {
      if (selectedEmp) {
        await updateEmployee(selectedEmp.id, empData);
        showToast('Employee updated successfully!');
      } else {
        await createEmployee(empData);
        showToast('Employee added successfully!');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to save employee.';
      showToast(errMsg, 'error');
      console.error(err);
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Status', render: (row) => <Badge text={row.status} /> },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => openViewProfile(row)} 
            className="secondary" 
            style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
            title="view profile"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => openEditModal(row)} 
            className="secondary" 
            style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onClick={() => handleToggleStatus(row)} 
            className="secondary" 
            style={{ 
              padding: '0.3rem 0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              color: (row.status || '').toLowerCase() === 'active' ? 'var(--danger-text)' : 'var(--success-text)',
              backgroundColor: (row.status || '').toLowerCase() === 'active' ? 'var(--danger-bg)' : 'var(--success-bg)',
              borderColor: (row.status || '').toLowerCase() === 'active' ? 'var(--danger)' : 'var(--success)'
            }}
            title={(row.status || '').toLowerCase() === 'active' ? 'Deactivate' : 'Activate'}
          >
            {(row.status || '').toLowerCase() === 'active' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </button>
        </div>
      )
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesName = !searchName || String(emp.name || '').toLowerCase().includes(searchName.toLowerCase());
    const matchesDept = !searchDept || String(emp.department || '').toLowerCase().includes(searchDept.toLowerCase());
    return matchesName && matchesDept;
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Employee Records</h4>
        <button onClick={openAddModal} className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Plus size={16} /> Add Employee
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Search by Name</label>
          <input 
            type="text" 
            placeholder="Search by Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, minWidth: '200px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Search by Department</label>
          <input 
            type="text" 
            placeholder="Search by Department..."
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredEmployees} />

      {/* Profile view modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Employee Profile">
        {selectedEmp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold' 
                }}
              >
                {selectedEmp.name ? selectedEmp.name[0].toLowerCase() : '?'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>{selectedEmp.name}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedEmp.designation} • {selectedEmp.department}</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Email:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.email}</p>
              </div>
              <div>
                <strong>Phone:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.phone}</p>
              </div>
              <div>
                <strong>Joining Date:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{formatDate(selectedEmp.joiningDate)}</p>
              </div>
              <div>
                <strong>Emergency Contact:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.emergencyContact}</p>
              </div>
              <div>
                <strong>Dashboard Access:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{selectedEmp.role || 'employee'}</p>
              </div>
            </div>

            <div>
              <strong>Skills:</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {selectedEmp.skills && selectedEmp.skills.map((skill, sIdx) => (
                  <span key={sIdx} style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong>Assigned Assets:</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {selectedEmp.assets && selectedEmp.assets.length > 0 ? (
                  selectedEmp.assets.map((asset, aIdx) => (
                    <span key={aIdx} style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)', color: 'var(--success-text)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>
                      {asset}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No assets assigned</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add / Edit modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedEmp ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
                <option value="" disabled hidden>Choose the Department</option>
                <option value="Management">Management</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Designation</label>
              <input type="text" required value={designation} onChange={(e) => setDesignation(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Phone Number</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Joining Date</label>
              <input type="date" required value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Emergency Contact Details</label>
              <input type="text" required placeholder="Contact Name (Phone)" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Access Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required style={{
                width: '100%',
                padding: '0.45rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                boxSizing: 'border-box'
              }}>
                <option value="" disabled hidden>Choose the Access Role</option>
                <option value="CEO">CEO</option>
                <option value="HR">HR</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Skills</label>
            <input type="text" placeholder="e.g. React, Node, Design" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Assigned Assets (comma separated)</label>
            <input type="text" placeholder="e.g. Laptop (MacBook Pro), Security Key, Headset" value={assets} onChange={(e) => setAssets(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Username</label>
              <input type="text" required placeholder="e.g. johndoe" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label>Password</label>
              <input type="password" required placeholder="••••••••" value={empPassword} onChange={(e) => setEmpPassword(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
