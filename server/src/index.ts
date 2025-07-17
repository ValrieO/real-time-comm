import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

interface User {
  id: string;
  username: string;
}

const users: Record<string, User> = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('join', (username: string) => {
    users[socket.id] = { id: socket.id, username };
    io.emit('userList', Object.values(users));
    io.emit('message', {
      sender: 'System',
      text: `${username} has joined the chat`,
      timestamp: new Date().toISOString()
    });
  });

  // Handle messages
  socket.on('message', (message: string) => {
    const user = users[socket.id];
    if (user) {
      io.emit('message', {
        sender: user.username,
        text: message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle typing indicator
  socket.on('typing', () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.emit('typing', user.username);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      io.emit('userList', Object.values(users));
      io.emit('message', {
        sender: 'System',
        text: `${user.username} has left the chat`,
        timestamp: new Date().toISOString()
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});