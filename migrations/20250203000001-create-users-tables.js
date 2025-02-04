'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First check if the table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('users')) {
      await queryInterface.createTable('users', {
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
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // Add index for email lookups
      await queryInterface.addIndex('users', ['email'], {
        unique: true,
        name: 'users_email_unique',
      });
    }

    // Check if favorites table exists
    if (!tables.includes('favorites')) {
      await queryInterface.createTable('favorites', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      // Add unique composite index to prevent duplicate favorites
      await queryInterface.addIndex('favorites', ['userId', 'productId'], {
        unique: true,
        name: 'favorites_user_product_unique',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('favorites', { cascade: true });
    await queryInterface.dropTable('users', { cascade: true });
  },
};
