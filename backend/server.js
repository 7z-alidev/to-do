const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


// Root Endpoint Healthcheck
app.get('/', (req, res) => {
  res.json({
    message: '🚀 MERN Todo API is running successfully',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos',
      stats: '/api/todos/stats'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToUse) + 1;
      console.warn(`⚠️ Port ${portToUse} is in use, switching to port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
