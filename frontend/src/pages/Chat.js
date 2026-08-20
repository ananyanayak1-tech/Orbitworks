import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getEmployees, getChatHistory } from '../services/api';
import { Send, Hash, User, Paperclip, MessageSquare, File, X } from 'lucide-react';
import io from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [myEmpId, setMyEmpId] = useState('');
  const [activeTab, setActiveTab] = useState({ id: 'general', type: 'channel', name: '#general' });
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          data: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Real-time messages state
  const [messages, setMessages] = useState({
    general: [
      { id: '1', senderName: 'Pooja Sharma', text: 'Welcome everyone to the OrbitWorks workspace!', time: '10:30 AM' },
      { id: '2', senderName: 'Rajesh Kumar', text: 'Please ensure your Q3 tasks are updated by Friday.', time: '10:35 AM' }
    ],
    engineering: [
      { id: '1', senderName: 'Rohan Sharma', text: 'Skeleton routing code is successfully configured.', time: '02:15 PM' },
      { id: '2', senderName: 'Vikram Singh', text: 'Nice! Working on dark mode alignment checks now.', time: '02:18 PM' }
    ],
    hr: [
      { id: '1', senderName: 'Pooja Sharma', text: 'Please upload your document proofs in the Documents tab.', time: '11:00 AM' }
    ]
  });

  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch employees list for Direct Messaging
  useEffect(() => {
    getEmployees().then(data => {
      const self = data.find(e => e.email.toLowerCase() === user.email.toLowerCase());
      if (self) setMyEmpId(self.id);
      // Exclude self from direct messages
      setEmployees(data.filter(e => e.email.toLowerCase() !== user.email.toLowerCase()));
    }).catch(console.error);
  }, [user]);

  // Connect WebSockets socket.io-client
  useEffect(() => {
    const socketUrl = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000').replace('/api', '');
    socketRef.current = io(socketUrl, {
      autoConnect: true,
      reconnectionAttempts: 3
    });

    socketRef.current.on('connect', () => {
      setSocketConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Listen to real-time messages from backend
    socketRef.current.on('message', (msg) => {
      const room = msg.room || 'general';
      setMessages(prev => ({
        ...prev,
        [room]: [...(prev[room] || []), msg]
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const currentRoomId = activeTab.type === 'channel' 
    ? activeTab.id 
    : (myEmpId && activeTab.id ? `dm_${[myEmpId, activeTab.id].sort().join('_')}` : activeTab.id);

  // Handle room joining and history loading on tab swap
  useEffect(() => {
    if (socketRef.current && socketConnected && currentRoomId) {
      socketRef.current.emit('join', currentRoomId);
    }
    
    // Load persistent chat history from DB
    const loadHistory = async () => {
      if (!currentRoomId) return;
      try {
        const history = await getChatHistory(currentRoomId);
        setMessages(prev => ({
          ...prev,
          [currentRoomId]: history
        }));
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    };
    
    loadHistory();
    scrollToBottom();
  }, [currentRoomId, socketConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedFile) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: user.name,
      text: messageText,
      time: timeString,
      room: currentRoomId,
      file: selectedFile ? { name: selectedFile.name, type: selectedFile.type, data: selectedFile.data } : null
    };

    // If socket is connected, emit the event to backend
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('sendMessage', newMsg);
    } else {
      // Offline fallback: simulate message locally
      setMessages(prev => ({
        ...prev,
        [currentRoomId]: [...(prev[currentRoomId] || []), newMsg]
      }));
      
      // Auto-reply mock if DMing someone to demonstrate it alive
      if (activeTab.type === 'dm') {
        setTimeout(() => {
          const reply = {
            id: `reply-${Date.now()}`,
            senderName: activeTab.name,
            text: `Thanks for the message! I am currently working. Let's sync up later.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            room: currentRoomId
          };
          setMessages(prev => ({
            ...prev,
            [currentRoomId]: [...(prev[currentRoomId] || []), reply]
          }));
        }, 1500);
      }
    }

    setMessageText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const channels = [
    { id: 'general', name: '#general' },
    { id: 'engineering', name: '#engineering' },
    { id: 'hr', name: '#hr' }
  ];

  const activeMessages = messages[currentRoomId] || [];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--surface)' }}>
      
      {/* Left Sidebar - Channels & DMs */}
      <div style={{ width: '260px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
        
        {/* Workspace Title */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={18} style={{ color: 'var(--accent)' }} />
          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Team Channels</span>
        </div>

        {/* Channels Section */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Channels</span>
          {channels.map((chan) => {
            const isSelected = activeTab.id === chan.id;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveTab({ id: chan.id, type: 'channel', name: chan.name })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isSelected ? 'var(--primary)' : 'none',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                <Hash size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <span>{chan.name.substring(1)}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Messages Section */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Direct Messages</span>
          {employees.map((emp) => {
            const isSelected = activeTab.id === emp.id;
            return (
              <button
                key={emp.id}
                onClick={() => setActiveTab({ id: emp.id, type: 'dm', name: emp.name })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: isSelected ? 'var(--primary)' : 'none',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem'
                }}
              >
                <User size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</span>
              </button>
            );
          })}
        </div>

        {/* Connection status footer */}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: socketConnected ? '#48BB78' : '#C53030' }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            {socketConnected ? 'Connected to WebSockets' : 'Sockets Offline (Mock Active)'}
          </span>
        </div>

      </div>

      {/* Right Pane - Chat Window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--surface)' }}>
        
        {/* Chat Window Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {activeTab.type === 'channel' ? <Hash size={18} style={{ color: 'var(--accent)' }} /> : <User size={18} style={{ color: 'var(--accent)' }} />}
          <span style={{ fontWeight: '700' }}>{activeTab.name}</span>
        </div>

        {/* Messages Feed */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeMessages.length > 0 ? (
            activeMessages.map((msg, idx) => {
              const isOwnMessage = msg.senderName === user.name;
              return (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>{msg.senderName}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{msg.time}</span>
                  </div>
                  <div 
                    style={{ 
                      padding: '0.65rem 0.9rem', 
                      borderRadius: '12px', 
                      borderTopRightRadius: isOwnMessage ? '2px' : '12px',
                      borderTopLeftRadius: isOwnMessage ? '12px' : '2px',
                      backgroundColor: isOwnMessage ? 'var(--primary)' : 'var(--bg)',
                      color: isOwnMessage ? '#FFFFFF' : 'var(--text-primary)',
                      border: '1px solid var(--border)',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    {msg.text && <span>{msg.text}</span>}
                    {msg.file && (
                      <div 
                        style={{ 
                          border: '1px solid var(--border)', 
                          borderRadius: '8px', 
                          padding: '0.5rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem', 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          maxWidth: '240px',
                          alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'
                        }}
                      >
                        {msg.file.type && msg.file.type.startsWith('image/') ? (
                          <img 
                            src={msg.file.data} 
                            alt={msg.file.name} 
                            style={{ maxWidth: '100%', borderRadius: '4px', maxHeight: '120px', objectFit: 'cover' }} 
                          />
                        ) : (
                          <>
                            <File size={16} style={{ minWidth: '16px', color: isOwnMessage ? '#FFFFFF' : 'var(--accent)' }} />
                            <a 
                              href={msg.file.data} 
                              download={msg.file.name} 
                              style={{ 
                                color: isOwnMessage ? '#FFFFFF' : 'var(--accent)', 
                                textDecoration: 'underline', 
                                fontSize: '0.8rem', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap',
                                maxWidth: '180px'
                              }}
                            >
                              {msg.file.name}
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '0.5rem' }}>
              <MessageSquare size={32} style={{ opacity: 0.3 }} />
              <span style={{ fontSize: '0.85rem' }}>No messages in {activeTab.name} yet. Say Hello!</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected File Attachment Preview Bar */}
        {selectedFile && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.35rem 0.65rem', 
              backgroundColor: 'var(--bg)', 
              borderRadius: '6px', 
              fontSize: '0.8rem', 
              width: 'fit-content', 
              margin: '0.5rem 1rem',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <File size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedFile.name}
            </span>
            <button 
              type="button" 
              onClick={() => setSelectedFile(null)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Message Input Bar */}
        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          
          <button 
            type="button" 
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>
          
          <input 
            type="text" 
            placeholder={`Message ${activeTab.name}`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.9rem' }}
          />

          <button 
            type="submit" 
            className="primary" 
            style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Send size={14} /> Send
          </button>
        </form>

      </div>

    </div>
  );
};

export default Chat;
