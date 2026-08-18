import React, { useState } from 'react';

const Dropdown = ({ trigger, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      {isOpen && (
        <>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
            onClick={() => setIsOpen(false)}
          />
          <div 
            style={{
              position: 'absolute',
              right: 0,
              marginTop: '0.5rem',
              minWidth: '160px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              zIndex: 999,
              padding: '0.25rem 0'
            }}
          >
            {items.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  textTransform: 'lowercase',
                }}
                className="dropdown-item"
              >
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
