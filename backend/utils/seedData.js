const { User, SLA } = require('../models');

const initializeDefaultUsers = async () => {
  try {
    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Default users already exist.');
      return;
    }

    // Create default users
    const defaultUsers = [
      {
        name: 'Admin User',
        email: 'admin@helpdesk.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Agent User',
        email: 'agent@helpdesk.com',
        password: 'agent123',
        role: 'agent'
      },
      {
        name: 'Test User',
        email: 'user@helpdesk.com',
        password: 'user123',
        role: 'user'
      }
    ];

    for (const userData of defaultUsers) {
      await User.create(userData);
    }

    console.log('Default users created successfully.');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

const initializeDefaultSLAs = async () => {
  try {
    const slaCount = await SLA.count();
    if (slaCount > 0) {
      console.log('Default SLAs already exist.');
      return;
    }

    const defaultSLAs = [
      {
        name: 'Low Priority SLA',
        priority: 'low',
        responseTime: 24, // 24 hours
        resolutionTime: 72 // 72 hours
      },
      {
        name: 'Medium Priority SLA',
        priority: 'medium',
        responseTime: 8, // 8 hours
        resolutionTime: 24 // 24 hours
      },
      {
        name: 'High Priority SLA',
        priority: 'high',
        responseTime: 2, // 2 hours
        resolutionTime: 8 // 8 hours
      },
      {
        name: 'Urgent Priority SLA',
        priority: 'urgent',
        responseTime: 1, // 1 hour
        resolutionTime: 4 // 4 hours
      }
    ];

    for (const slaData of defaultSLAs) {
      await SLA.create(slaData);
    }

    console.log('Default SLAs created successfully.');
  } catch (error) {
    console.error('Error creating default SLAs:', error);
  }
};

module.exports = {
  initializeDefaultUsers,
  initializeDefaultSLAs
};

