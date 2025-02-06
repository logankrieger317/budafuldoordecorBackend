'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if the Admins table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('Admins')) {
        // Create the Admins table if it doesn't exist
        await queryInterface.createTable('Admins', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          }
        });
        return;
      }

      // Get table info
      const tableInfo = await queryInterface.describeTable('Admins');
      
      // If username exists but email doesn't, create email column
      if (tableInfo.username && !tableInfo.email) {
        // Add email column
        await queryInterface.addColumn('Admins', 'email', {
          type: Sequelize.STRING,
          allowNull: true, // temporarily allow null
          unique: true,
        });

        // Copy username data to email
        await queryInterface.sequelize.query(`
          UPDATE "Admins"
          SET email = username
          WHERE email IS NULL;
        `);

        // Make email non-nullable
        await queryInterface.changeColumn('Admins', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        });

        // Remove username column
        await queryInterface.removeColumn('Admins', 'username');
      }

      // If neither username nor email exists, add email
      if (!tableInfo.username && !tableInfo.email) {
        await queryInterface.addColumn('Admins', 'email', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const tableInfo = await queryInterface.describeTable('Admins');
      
      // If email exists, revert back to username
      if (tableInfo.email) {
        // Add username column
        await queryInterface.addColumn('Admins', 'username', {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        });

        // Copy email data to username
        await queryInterface.sequelize.query(`
          UPDATE "Admins"
          SET username = email
          WHERE username IS NULL;
        `);

        // Make username non-nullable
        await queryInterface.changeColumn('Admins', 'username', {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        });

        // Remove email column
        await queryInterface.removeColumn('Admins', 'email');
      }
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  }
};
