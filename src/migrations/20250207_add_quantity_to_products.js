'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add quantity column to wreath_products
    await queryInterface.addColumn('wreath_products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add quantity column to ribbon_products
    await queryInterface.addColumn('ribbon_products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add quantity column to seasonal_products
    await queryInterface.addColumn('seasonal_products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add quantity column to mum_products
    await queryInterface.addColumn('mum_products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // Add quantity column to braid_products
    await queryInterface.addColumn('braid_products', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove quantity column from wreath_products
    await queryInterface.removeColumn('wreath_products', 'quantity');

    // Remove quantity column from ribbon_products
    await queryInterface.removeColumn('ribbon_products', 'quantity');

    // Remove quantity column from seasonal_products
    await queryInterface.removeColumn('seasonal_products', 'quantity');

    // Remove quantity column from mum_products
    await queryInterface.removeColumn('mum_products', 'quantity');

    // Remove quantity column from braid_products
    await queryInterface.removeColumn('braid_products', 'quantity');
  }
};
