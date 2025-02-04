import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Set specific email addresses as admin
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "isAdmin" = true
      WHERE "email" = 'admin@budafuldoordecor.com';
    `);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Users', 'isAdmin');
  }
};
