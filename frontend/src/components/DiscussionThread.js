import React, { useState } from 'react';
import Avatar from './Avatar';
import { Trash2 } from 'lucide-react';

const DiscussionThread = ({ comments = [], onAddComment, onDeleteComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(text);
    setText('');
  };

  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
      <h4 style={{ marginBottom: '1rem', textTransform: 'lowercase' }}>discussion thread</h4>
      
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          marginBottom: '1.5rem', 
          maxHeight: '300px', 
          overflowY: 'auto', 
          paddingRight: '0.5rem' 
        }}
      >
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id || comment._id} style={{ display: 'flex', gap: '0.75rem' }}>
              <Avatar name={comment.senderName || comment.userName} size={32} />
              <div 
                style={{ 
                  flex: 1, 
                  backgroundColor: 'var(--bg)', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                    {comment.senderName || comment.userName}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {(() => {
                        const d = new Date(comment.time || comment.timestamp);
                        if (isNaN(d.getTime())) return 'Invalid Date';
                        return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                      })()}
                    </span>
                    {onDeleteComment && (
                      <button 
                        onClick={() => onDeleteComment(comment.id || comment._id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--text-secondary)', 
                          cursor: 'pointer', 
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        title="Delete Comment"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <p 
                  style={{ 
                    margin: 0, 
                    fontSize: '0.85rem', 
                    color: 'var(--text-primary)', 
                    whiteSpace: 'pre-wrap', 
                    textTransform: 'lowercase' 
                  }}
                >
                  {comment.text.split(/(\s+)/).map((word, idx) => {
                    if (word.startsWith('@')) {
                      return <span key={idx} style={{ color: 'var(--accent)', fontWeight: '600' }}>{word}</span>;
                    }
                    return word;
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', padding: '1rem 0' }}>
            no comments yet. start the discussion.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="write a comment... (use @name to mention)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, fontSize: '0.85rem' }}
        />
        <button type="submit" className="primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          post
        </button>
      </form>
    </div>
  );
};

export default DiscussionThread;
