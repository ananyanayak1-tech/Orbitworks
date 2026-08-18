import React, { useState } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { updateEmployee } from '../../services/api';
import { Edit2, Eye, FileText } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';

const EmployeeRecords = ({ employees, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Search filters
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  // Form edit fields
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [skills, setSkills] = useState('');

  const openViewProfile = (emp) => {
    setSelectedEmp(emp);
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setName(emp.name);
    setDepartment(emp.department);
    setDesignation(emp.designation);
    setPhone(emp.phone);
    setEmergencyContact(emp.emergencyContact);
    setJoiningDate(emp.joiningDate);
    setSkills(emp.skills ? emp.skills.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const updatedData = {
      name,
      department,
      designation,
      phone,
      emergencyContact,
      joiningDate,
      skills: skillsArray
    };

    try {
      await updateEmployee(selectedEmp.id, updatedData);
      setIsEditModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Id', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Joining date', accessor: 'joiningDate' },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => openViewProfile(row)} 
            className="secondary" 
            style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
            title="view records"
          >
            <Eye size={14} />
          </button>
          <button 
            onClick={() => openEditModal(row)} 
            className="secondary" 
            style={{ padding: '0.3rem 0.5rem', display: 'flex', alignItems: 'center' }}
            title="edit records"
          >
            <Edit2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    if (String(emp.designation || '').toLowerCase() === 'ceo') {
      return false;
    }
    const matchesName = !searchName || String(emp.name || '').toLowerCase().includes(searchName.toLowerCase());
    const matchesDept = !searchDept || String(emp.department || '').toLowerCase().includes(searchDept.toLowerCase());
    return matchesName && matchesDept;
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h4 style={{ margin: 0, fontWeight: '600' }}>Employee records management</h4>

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

      {/* View Detailed Record modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detailed employee records">
        {selectedEmp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textTransform: 'lowercase' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 'bold', 
                  fontSize: '1.25rem' 
                }}
              >
                {selectedEmp.name ? selectedEmp.name[0].toLowerCase() : '?'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600' }}>{selectedEmp.name}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedEmp.designation} • {selectedEmp.department}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <strong>employee ID:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.id}</p>
              </div>
              <div>
                <strong>contact:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.phone}</p>
              </div>
              <div>
                <strong>emergency contact:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{selectedEmp.emergencyContact}</p>
              </div>
              <div>
                <strong>joining date:</strong>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{formatDate(selectedEmp.joiningDate)}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>skills & qualifications:</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {selectedEmp.skills && selectedEmp.skills.map((skill, idx) => (
                  <span key={idx} style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <strong style={{ fontSize: '0.85rem' }}>employee documents:</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {selectedEmp.documents && selectedEmp.documents.length > 0 ? (
                  selectedEmp.documents.map((doc, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        fontSize: '0.8rem', 
                        padding: '0.4rem', 
                        border: '1px solid var(--border)', 
                        borderRadius: '4px', 
                        backgroundColor: 'var(--bg)' 
                      }}
                    >
                      <FileText size={14} style={{ color: 'var(--text-secondary)' }} />
                      <span style={{ flex: 1 }}>{doc.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{doc.type} • {doc.uploadDate}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>no documents uploaded</span>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Record Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee Records">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Full Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Emergency Contact Details</label>
            <input type="text" required value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Skills</label>
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeRecords;
