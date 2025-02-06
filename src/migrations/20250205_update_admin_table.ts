import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // First, check if the table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('Admins')) {
      // Create the table if it doesn't exist
      await queryInterface.createTable('Admins', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      });
    } else {
      // If the table exists, check if we need to rename username to email
      const tableInfo = await queryInterface.describeTable('Admins');
      if (tableInfo.username && !tableInfo.email) {
        await queryInterface.renameColumn('Admins', 'username', 'email');
      }
      // Add email column if neither exists
      if (!tableInfo.username && !tableInfo.email) {
        await queryInterface.addColumn('Admins', 'email', {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        });
      }
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const tableInfo = await queryInterface.describeTable('Admins');
    if (tableInfo.email) {
      // If rolling back and email exists, rename it back to username
      await queryInterface.renameColumn('Admins', 'email', 'username');
    }
  },
};
