'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // First check if the table exists
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('users')) {
      await queryInterface.createTable('users', {
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
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
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
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        productSku: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: 'products',
            key: 'sku',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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

      // Add unique composite index to prevent duplicate favorites
      await queryInterface.addIndex('favorites', ['userId', 'productSku'], {
        unique: true,
        name: 'favorites_user_product_unique',
      });
    }
  },

  async down(queryInterface) {
    // Drop tables in reverse order to handle foreign key constraints
    await queryInterface.dropTable('favorites', { cascade: true });
    await queryInterface.dropTable('users', { cascade: true });
  },
};
