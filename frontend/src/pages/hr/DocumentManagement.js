import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { updateEmployee } from '../../services/api';

const DocumentManagement = ({ employees, onRefresh }) => {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [docType, setDocType] = useState('offer_letter');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileName) return;

    setUploading(true);
    setMessage('');
    
    // Simulate upload delay
    setTimeout(async () => {
      const emp = employees.find(e => e.id === selectedEmpId);
      if (emp) {
        const newDoc = {
          name: fileName,
          type: docType,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        const updatedDocs = [...(emp.documents || []), newDoc];
        try {
          await updateEmployee(emp.id, { documents: updatedDocs });
          setFileName('');
          setMessage('document uploaded successfully');
          onRefresh();
        } catch (err) {
          console.error(err);
          setMessage('upload failed');
        } finally {
          setUploading(false);
        }
      } else {
        setUploading(false);
        setMessage('employee not found');
      }
    }, 1000);
  };

  // Compile all documents across employees for tracking
  const allDocs = employees.flatMap(emp => 
    (emp.documents || []).map(doc => ({
      ...doc,
      employeeName: emp.name,
      employeeId: emp.id
    }))
  );

  return (
    <div className="dashboard-grid">
      
      {/* Upload UI */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Upload employee document</h4>
        
        {message && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: 'var(--success-bg)', 
              color: 'var(--success-text)', 
              border: '1px solid var(--success)', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              fontSize: '0.85rem' 
            }}
          >
            <CheckCircle2 size={16} />
            <span>{message.charAt(0).toUpperCase() + message.slice(1)}</span>
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Select employee</label>
            <select value={selectedEmpId} onChange={(e) => setSelectedEmpId(e.target.value)} required>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>Document type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="offer_letter">Offer letter</option>
              <option value="id_proof">ID proof</option>
              <option value="experience_letter">Experience letter</option>
              <option value="certificate">Certificates</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label>File name</label>
            <input 
              type="text" 
              placeholder="e.g. passport_scan.pdf" 
              required 
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            className="primary" 
            disabled={uploading || !fileName} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem', 
              marginTop: '0.5rem' 
            }}
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload document'}
          </button>
        </form>
      </div>

      {/* Document Feed / List */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, fontWeight: '600' }}>Document log feed</h4>
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            maxHeight: '400px', 
            overflowY: 'auto', 
            paddingRight: '0.5rem' 
          }}
        >
          {allDocs.length > 0 ? (
            allDocs.map((doc, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px' 
                }}
              >
                <div 
                  style={{ 
                    padding: '0.4rem', 
                    backgroundColor: 'var(--bg)', 
                    borderRadius: '6px', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text-secondary)', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}
                >
                  <FileText size={16} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{doc.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Owner: {doc.employeeName} ({doc.employeeId})</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{doc.type.replace('_', ' ')}</span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '2rem 0' }}>
              No documents found.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default DocumentManagement;
