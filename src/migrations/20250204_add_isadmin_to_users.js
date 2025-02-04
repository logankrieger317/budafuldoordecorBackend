const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('users', 'isAdmin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Set specific email addresses as admin
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "isAdmin" = true
      WHERE "email" = 'admin@budafuldoordecor.com';
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'isAdmin');
  }
};
