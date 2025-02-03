'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    
    await queryInterface.bulkInsert('admins', [{
      id: uuidv4(),
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('admins', {});
  }
};
