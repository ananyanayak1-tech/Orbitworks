const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const dbo = require('./config/db');

const app = express();
const server = http.createServer(app);

// Configure CORS to permit react frontend connection
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('OrbitWorks Backend API is running! Access /health for API status.');
});

// Basic sanity check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/misc', require('./routes/misc'));

// Setup Real-time WebSockets Server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Group channel rooms (e.g. general, engineering, marketing, admin)
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // Listen for team messages and broadcast to matching room
  socket.on('sendMessage', (msg) => {
    console.log(`Message received for room ${msg.room}:`, msg);
    // msg structure: { room: 'engineering', sender: 'Alex Carter', text: '...', timestamp: '...' }
    io.to(msg.room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to Database and start server
const PORT = process.env.PORT || 5000;
dbo.connectToServer().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start server due to DB connection error:", err);
});
