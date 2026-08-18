import React, { useState } from 'react';
import { formatDate } from '../utils/dateFormatter';

const DataTable = ({ columns, data = [], searchKey, searchPlaceholder = 'Search...' }) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(item => {
    if (!search || !searchKey) return true;
    if (Array.isArray(searchKey)) {
      return searchKey.some(key => {
        const val = item[key];
        return String(val || '').toLowerCase().includes(search.toLowerCase());
      });
    }
    const val = item[searchKey];
    return String(val || '').toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      {searchKey && (
        <div style={{ marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: '100%', maxWidth: '300px' }}
          />
        </div>
      )}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'var(--surface)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  style={{ 
                    padding: '0.75rem 1rem', 
                    color: 'var(--text-secondary)', 
                    fontWeight: '600', 
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderRight: idx === columns.length - 1 ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  style={{ 
                    borderBottom: rIdx === paginatedData.length - 1 ? 'none' : '1px solid var(--border)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  {columns.map((col, cIdx) => (
                    <td 
                      key={cIdx} 
                      style={{ 
                        padding: '0.75rem 1rem', 
                        fontSize: '0.9rem', 
                        color: 'var(--text-primary)',
                        borderRight: cIdx === columns.length - 1 ? 'none' : '1px solid var(--border)'
                      }}
                    >
                      {col.render ? col.render(row) : formatDate(row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', alignItems: 'center' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
