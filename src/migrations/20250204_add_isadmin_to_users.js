'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isAdmin');
  }
};
