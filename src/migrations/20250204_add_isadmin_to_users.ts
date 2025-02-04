import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('Users', 'isAdmin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Set specific email addresses as admin
    await queryInterface.sequelize.query(`
      UPDATE "Users"
      SET "isAdmin" = true
      WHERE email IN ('admin@budafuldoordecor.com')
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('Users', 'isAdmin');
  }
};
