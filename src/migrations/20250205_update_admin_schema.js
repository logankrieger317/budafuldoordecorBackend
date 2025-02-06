'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if the Admins table exists
      const tables = await queryInterface.showAllTables();
      
      // Drop and recreate the table to ensure clean state
      if (tables.includes('Admins')) {
        // Get existing admin data
        const admins = await queryInterface.sequelize.query(
          'SELECT * FROM "Admins";',
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        // Drop the table
        await queryInterface.dropTable('Admins');

        // Create the table with correct schema
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

        // Reinsert the data, mapping username to email if necessary
        if (admins.length > 0) {
          const updatedAdmins = admins.map(admin => ({
            id: admin.id,
            email: admin.email || admin.username,
            password: admin.password,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt
          }));

          await queryInterface.bulkInsert('Admins', updatedAdmins);
        }
      } else {
        // Create the table if it doesn't exist
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
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // We don't want to risk data loss in production, so down migration is not supported
    throw new Error('Down migration is not supported for this migration');
  }
};
