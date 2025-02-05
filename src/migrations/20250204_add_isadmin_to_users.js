'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if column exists first
    const table = await queryInterface.describeTable('users');
    if (!table.isAdmin) {
      await queryInterface.addColumn('users', 'isAdmin', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });

      await queryInterface.sequelize.query(`
        UPDATE users
        SET "isAdmin" = false;
      `);

      await queryInterface.sequelize.query(`
        UPDATE users
        SET "isAdmin" = true
        WHERE email = 'admin@budafuldoordecor.com';
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');
    if (table.isAdmin) {
      await queryInterface.removeColumn('users', 'isAdmin');
    }
  }
};
