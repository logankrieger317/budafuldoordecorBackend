'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      sku: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      length: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      isWired: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
