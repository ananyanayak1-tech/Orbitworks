import React, { useState } from 'react';
import { updateDemoRequestStatus } from '../../services/api';
import { Check, X, Mail, Phone, Calendar, Briefcase, Eye } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';

const DemoManagement = ({ demoRequests = [], onRefresh }) => {
  const { showToast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handleStatusChange = async (requestId, newStatus) => {
    setActionLoadingId(requestId);
    try {
      await updateDemoRequestStatus(requestId, newStatus);
      showToast(`Demo request ${newStatus} successfully!`);
      onRefresh();
    } catch (err) {
      console.error("Failed to update demo request status:", err);
      showToast("Failed to update demo request status", "error");
    } finally {
      setActionLoadingId(null);
      if (selectedRequest && selectedRequest._id === requestId) {
        setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'pending').toLowerCase();
    let bg = 'rgba(234, 179, 8, 0.1)';
    let color = '#EAB308';
    let text = 'Pending Review';

    if (s === 'approved') {
      bg = 'rgba(34, 197, 94, 0.1)';
      color = '#22C55E';
      text = 'Approved / Granted';
    } else if (s === 'rejected') {
      bg = 'rgba(239, 68, 68, 0.1)';
      color = '#EF4444';
      text = 'Denied / Blocked';
    }

    return (
      <span 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          padding: '4px 10px', 
          borderRadius: '999px', 
          fontSize: '0.75rem', 
          fontWeight: '600', 
          backgroundColor: bg, 
          color: color 
        }}
      >
        {text}
      </span>
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
            Demo Access Requests
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Grant or deny platform access for prospective customers requesting custom walks.
          </span>
        </div>
      </div>

      {/* Main Table Grid Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Prospective Client</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Contact Info</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Explore Intent</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Request Date</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demoRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1.25rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No demo requests found in the system database.
                  </td>
                </tr>
              ) : (
                demoRequests.map((req) => (
                  <tr key={req._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }}>
                    
                    {/* Prospective Client name & company */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{req.firstName} {req.lastName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.2rem' }}>
                          <Briefcase size={12} /> {req.companyName}
                        </span>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          <Mail size={12} /> {req.email}
                        </span>
                        {req.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            <Phone size={12} /> {req.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td style={{ padding: '1rem 1.25rem', maxWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span 
                          style={{ 
                            textOverflow: 'ellipsis', 
                            overflow: 'hidden', 
                            whiteSpace: 'nowrap', 
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem'
                          }}
                        >
                          {req.message || <em style={{ color: 'var(--text-secondary)' }}>No custom message</em>}
                        </span>
                        {req.message && (
                          <button 
                            onClick={() => setSelectedRequest(req)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--accent)', 
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'inline-flex'
                            }}
                            title="View Full Message"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Request Date */}
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {formatDate(req.createdAt)}
                      </span>
                    </td>

                    {/* Current Status */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Actions Panel */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => handleStatusChange(req._id, 'approved')}
                          disabled={actionLoadingId === req._id || req.status === 'approved'}
                          className="secondary"
                          style={{ 
                            padding: '0.4rem 0.6rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: req.status === 'approved' ? 'var(--text-secondary)' : '#10B981',
                            borderColor: req.status === 'approved' ? 'transparent' : 'rgba(16, 185, 129, 0.2)',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'rejected')}
                          disabled={actionLoadingId === req._id || req.status === 'rejected'}
                          className="secondary"
                          style={{ 
                            padding: '0.4rem 0.6rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            color: req.status === 'rejected' ? 'var(--text-secondary)' : '#EF4444',
                            borderColor: req.status === 'rejected' ? 'transparent' : 'rgba(239, 68, 68, 0.2)',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}
                        >
                          <X size={14} /> Deny
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Dialog Modal */}
      {selectedRequest && (
        <Modal 
          isOpen={!!selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
          title="Demo Access Request Details"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedRequest.firstName} {selectedRequest.lastName}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {selectedRequest.companyName}
                </span>
              </div>
              <div>
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Email Address</span>
                <strong>{selectedRequest.email}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Phone Number</span>
                <strong>{selectedRequest.phone || 'Not provided'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Request Date</span>
                <strong>{formatDate(selectedRequest.createdAt)}</strong>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                EXPLORATION MESSAGE / INTENT
              </span>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                {selectedRequest.message || 'No additional details provided by prospect.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
              <button 
                onClick={() => handleStatusChange(selectedRequest._id, 'approved')} 
                disabled={actionLoadingId === selectedRequest._id || selectedRequest.status === 'approved'}
                style={{ 
                  backgroundColor: '#10B981', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: '0.5rem 1.25rem', 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  cursor: 'pointer' 
                }}
              >
                Approve Request
              </button>
              <button 
                onClick={() => handleStatusChange(selectedRequest._id, 'rejected')} 
                disabled={actionLoadingId === selectedRequest._id || selectedRequest.status === 'rejected'}
                style={{ 
                  backgroundColor: '#EF4444', 
                  color: '#ffffff', 
                  border: 'none', 
                  borderRadius: '6px', 
                  padding: '0.5rem 1.25rem', 
                  fontSize: '0.85rem', 
                  fontWeight: '600',
                  cursor: 'pointer' 
                }}
              >
                Deny Request
              </button>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="secondary"
                style={{ fontSize: '0.85rem', fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DemoManagement;
