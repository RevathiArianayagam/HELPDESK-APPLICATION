const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const { initializeDefaultUsers, initializeDefaultSLAs } = require('./utils/seedData');
require('./utils/createUploadsDir'); // Ensure uploads directory exists

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Helpdesk API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
initializeDatabase()
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synchronized.');
    return initializeDefaultUsers();
  })
  .then(() => {
    return initializeDefaultSLAs();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  });

module.exports = app;

